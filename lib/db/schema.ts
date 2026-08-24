import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Full set of roles a *user* can hold. `auditor` exists here because a user
 * can be promoted to it — but see `inviteRole` below: it is deliberately NOT
 * grantable through the invite/redemption path (CLAUDE.md §6a, Rule 1).
 */
export const userRole = pgEnum("user_role", ["analyst", "auditor", "admin"]);

/**
 * Roles that an *invite* is allowed to carry. `auditor` is intentionally
 * absent, so the database itself makes it impossible to issue (or redeem) an
 * auditor invite. This is the schema-level half of Rule 1 (deny by default).
 */
export const inviteRole = pgEnum("invite_role", ["analyst", "admin"]);

// ---------------------------------------------------------------------------
// Tenants (CLAUDE.md §6b) — every user/invite belongs to exactly one tenant.
// ---------------------------------------------------------------------------

export const tenant = pgTable("tenant", {
  // Slug-like id: "system-admin-01" for the founders' master tenant,
  // "tenant_<uuid>" for provisioned client tenants.
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // Exactly one row is the master tenant (the founders). It may provision new
  // tenants but has no standing access to their users/invites (§6b).
  isMaster: boolean("is_master").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ---------------------------------------------------------------------------
// BetterAuth core tables (user / session / account / verification)
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // Role is an additional field on the BetterAuth user. Default is the
  // least-privileged role; it is never settable from the client at sign-up
  // (see lib/auth.ts additionalFields `input: false`).
  role: userRole("role").notNull().default("analyst"),
  // Tenant isolation (§6b). Mandatory, non-nullable. Assigned server-side from
  // the invite at redemption — never settable by the redeemer.
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenant.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Invites — the only path to account creation (CLAUDE.md §6a)
// ---------------------------------------------------------------------------

export const invite = pgTable("invite", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Tenant the invite belongs to (§6b). Mandatory, non-nullable. Inherited
  // automatically from the issuing admin's own tenant (createInvite), except
  // for the master tenant's explicit provisionTenant step, which issues the
  // first admin invite for a brand-new client tenant.
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenant.id, { onDelete: "restrict" }),

  // The address the invite was issued to. Redemption binds the new account to
  // this email; it cannot be changed by the redeemer.
  email: text("email").notNull(),

  // Rule 1 (schema level): `inviteRole` has no `auditor` member, so an auditor
  // invite is unrepresentable in the database.
  role: inviteRole("role").notNull().default("analyst"),

  // Only the SHA-256 hash of the token is stored. The plaintext token exists
  // only in the invite link handed to the recipient.
  tokenHash: text("token_hash").notNull().unique(),

  // Rule 2 (schema level): every invite is attributed to the admin who issued
  // it — a not-null foreign key to user.id, enforced by the database.
  invitedByAdminId: text("invited_by_admin_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),

  // Rule 2: issue + redemption bookkeeping.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  redeemedAt: timestamp("redeemed_at"),
  redeemedByUserId: text("redeemed_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
});

// ---------------------------------------------------------------------------
// Remediation verification (CLAUDE.md §5.5)
// ---------------------------------------------------------------------------

/**
 * Per-finding remediation state. Overlays the (currently static) vuln findings
 * keyed by CVE/finding id, so a finding's verified status is persisted:
 *  - open                → not (yet) remediated / not confirmed
 *  - verifying           → "Verifying Matrix Isolation…" — engine replay in flight
 *  - covered             → ONLY set by a signature-verified engine callback
 *  - verification_error  → fix attempted but the engine was unreachable/timed out
 *                          or the fail-closed path fired. Distinct from `open`.
 */
export const remediationStatus = pgEnum("remediation_status", [
  "open",
  "verifying",
  "covered",
  "verification_error",
]);

export const remediation = pgTable("remediation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  // The finding this row is about — the CVE / scan-result id. One row per finding.
  vulnerabilityId: text("vulnerability_id").notNull().unique(),
  targetAsset: text("target_asset").notNull(),
  status: remediationStatus("status").notNull().default("open"),
  // Raw verification_status reported by the engine on the signed callback.
  verificationStatus: text("verification_status"),
  detail: text("detail"),
  requestedByUserId: text("requested_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  requestedAt: timestamp("requested_at"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Tenant = typeof tenant.$inferSelect;
export type User = typeof user.$inferSelect;
export type Invite = typeof invite.$inferSelect;
export type Remediation = typeof remediation.$inferSelect;

// Re-exported so the BetterAuth drizzle adapter receives the full schema.
export const schema = {
  tenant,
  user,
  session,
  account,
  verification,
  invite,
  remediation,
};
