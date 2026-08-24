import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { isMasterTenant } from "@/lib/tenancy";

/** Returns the current session (or null) without redirecting. */
export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Requires any authenticated user; otherwise redirects to /login. */
export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session;
}

/** Requires an `admin`; unauthenticated → /login, non-admin → /dashboard. */
export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}

/**
 * Requires an `admin` who belongs to the founders' master tenant (§6b). Used to
 * gate tenant provisioning. A non-master admin is bounced back to /admin — the
 * master tenant has no cross-tenant read access, only the provisioning action.
 */
export async function requireMasterAdmin() {
  const session = await requireAdmin();
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!isMasterTenant(tenantId)) redirect("/admin");
  return session;
}

/** The acting admin's tenant scope — the value every admin query filters by. */
export function tenantScopeOf(session: {
  user: { tenantId?: string };
}): string {
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    // A session without a tenant should be impossible post-migration; fail
    // closed rather than returning an unscoped query.
    throw new Error("Session is missing a tenant_id — cannot scope admin data.");
  }
  return tenantId;
}
