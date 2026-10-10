"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { requireAdmin, requireMasterAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { invite, tenant, user } from "@/lib/db/schema";
import { generateInviteToken, hashInviteToken } from "@/lib/invite-token";

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Roles that may be attached to an invite. `auditor` is intentionally excluded
// (CLAUDE.md §6a, Rule 1) — it is also unrepresentable in the invite_role enum.
type InviteRole = "analyst" | "admin";

/**
 * Base URL for every invite link. These are sent to people on other networks
 * (and often opened later), so they must point at the public product domain,
 * never a local/dev origin like localhost. Overridable via APP_PUBLIC_URL.
 */
function inviteBaseUrl() {
  return process.env.APP_PUBLIC_URL ?? "https://app.eternalboundaries.com";
}

/**
 * Admin-only. Issues an invite bound to the calling admin's user id (Rule 2)
 * and returns the one-time invite link. `auditor` is rejected here in addition
 * to being impossible at the schema level (Rule 1).
 */
export async function createInvite(input: {
  email: string;
  role?: InviteRole;
}): Promise<{ inviteUrl: string } | { error: string }> {
  const session = await requireAdmin();

  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const role = input.role ?? "analyst";
  // Rule 1 (application layer): only analyst or admin may be invited. Anything
  // else — including an attempt to smuggle in `auditor` — is refused.
  if (role !== "analyst" && role !== "admin") {
    return {
      error:
        "Invites can only grant analyst or admin. Auditor is assigned by a separate promotion.",
    };
  }

  const { token, tokenHash } = generateInviteToken();

  await db.insert(invite).values({
    email,
    role,
    tokenHash,
    // §6b point 4: the invite inherits the issuing admin's own tenant. The
    // tenant is taken from the server session, never from client input.
    tenantId: tenantScopeOf(session),
    // Rule 2: attribution to the issuing admin (schema-enforced not-null FK).
    invitedByAdminId: session.user.id,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });

  revalidatePath("/admin");
  return { inviteUrl: `${inviteBaseUrl()}/invite/${token}` };
}

/**
 * Master-tenant-only (§6b point 6). Provisions a brand-new client tenant and
 * issues the FIRST admin invite for it. This is the ONLY place an invite's
 * tenant differs from the acting admin's own tenant. Note there is deliberately
 * no counterpart that lists or reads another tenant's users/invites — the master
 * tenant gets provisioning, not standing cross-tenant visibility.
 */
export async function provisionTenant(input: {
  name: string;
  adminEmail: string;
}): Promise<{ inviteUrl: string; tenantId: string } | { error: string }> {
  const session = await requireMasterAdmin();

  const name = input.name.trim();
  const email = input.adminEmail.trim().toLowerCase();
  if (!name) return { error: "Enter an organization name for the new tenant." };
  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email for the new tenant's first admin." };
  }

  const tenantId = `tenant_${crypto.randomUUID()}`;
  await db.insert(tenant).values({ id: tenantId, name, isMaster: false });

  const { token, tokenHash } = generateInviteToken();
  await db.insert(invite).values({
    // The new client tenant — NOT the master's own tenant.
    tenantId,
    email,
    role: "admin",
    tokenHash,
    // Rule 2: still attributed to the founder who provisioned the tenant.
    invitedByAdminId: session.user.id,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });

  revalidatePath("/admin");
  return { inviteUrl: `${inviteBaseUrl()}/invite/${token}`, tenantId };
}

/**
 * Public (unauthenticated) redemption. Validates the invite, creates the
 * account in-process, then records the redemption. The granted role can only
 * ever be analyst or admin — never auditor (Rule 1), clamped here as
 * defense-in-depth on top of the invite_role enum.
 */
export async function redeemInvite(input: {
  token: string;
  name: string;
  password: string;
}): Promise<{ success: true } | { error: string }> {
  const name = input.name.trim();
  if (!name) return { error: "Enter your name." };
  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const tokenHash = hashInviteToken(input.token);
  const [row] = await db
    .select()
    .from(invite)
    .where(eq(invite.tokenHash, tokenHash))
    .limit(1);

  if (!row) return { error: "This invite link is not valid." };
  if (row.redeemedAt) return { error: "This invite has already been used." };
  if (row.expiresAt.getTime() < Date.now()) {
    return { error: "This invite has expired. Ask an admin for a new one." };
  }

  // Rule 1: redemption never yields auditor. Only an admin invite grants admin;
  // everything else collapses to the least-privileged analyst.
  const grantedRole: "analyst" | "admin" = row.role === "admin" ? "admin" : "analyst";

  let newUserId: string;
  try {
    const result = await auth.api.signUpEmail({
      // §6b: the new account is born into the invite's tenant. tenantId comes
      // from the invite row (server-trusted), not from the redeemer.
      body: { name, email: row.email, password: input.password, tenantId: row.tenantId },
      headers: await headers(),
    });
    newUserId = result.user.id;
  } catch {
    // Most commonly a duplicate email (the invited address already has an
    // account), which also blocks a second redemption of the same invite.
    return { error: "An account for this email already exists." };
  }

  // Assign the role server-side (users are created as `analyst` by default;
  // `input: false` means the redeemer could not have set this themselves).
  if (grantedRole !== "analyst") {
    await db.update(user).set({ role: grantedRole }).where(eq(user.id, newUserId));
  }

  // Record redemption; the `isNull` guard makes the claim idempotent.
  await db
    .update(invite)
    .set({ redeemedAt: new Date(), redeemedByUserId: newUserId })
    .where(and(eq(invite.id, row.id), isNull(invite.redeemedAt)));

  return { success: true };
}

/**
 * Admin-only, and the ONLY path to the `auditor` role (CLAUDE.md §6a, Rule 1).
 * Deliberately separate from the invite/redemption flow.
 */
export async function promoteToAuditor(
  userId: string
): Promise<{ success: true } | { error: string }> {
  const session = await requireAdmin();

  if (!userId) return { error: "Missing user." };

  // §6b point 5: promotion is tenant-scoped. The tenant predicate is part of
  // the UPDATE's WHERE clause, so a userId from another tenant matches zero
  // rows and nothing is changed — enforced at the data layer, not the UI.
  const updated = await db
    .update(user)
    .set({ role: "auditor" })
    .where(and(eq(user.id, userId), eq(user.tenantId, tenantScopeOf(session))))
    .returning({ id: user.id });

  if (updated.length === 0) {
    return { error: "User not found in your organization." };
  }

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Admin-only. Revokes a pending (un-redeemed) invite by deleting it, so the
 * token can no longer be used. A redeemed invite can't be revoked — the account
 * already exists.
 */
export async function revokeInvite(
  inviteId: string
): Promise<{ success: true } | { error: string }> {
  const session = await requireAdmin();

  if (!inviteId) return { error: "Missing invite." };

  // §6b: revocation is tenant-scoped — an admin can only revoke invites that
  // belong to their own tenant.
  const deleted = await db
    .delete(invite)
    .where(
      and(
        eq(invite.id, inviteId),
        eq(invite.tenantId, tenantScopeOf(session)),
        isNull(invite.redeemedAt)
      )
    )
    .returning({ id: invite.id });

  if (deleted.length === 0) {
    return { error: "Invite not found, or it has already been redeemed." };
  }

  revalidatePath("/admin");
  return { success: true };
}
