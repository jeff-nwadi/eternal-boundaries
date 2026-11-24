import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guards";
import { isMasterTenant } from "@/lib/tenancy";
import { db } from "@/lib/db";
import { tenant } from "@/lib/db/schema";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

// Admin lives inside the same minimal shell as the dashboard. requireAdmin
// guards the whole section (non-admins redirect to /dashboard).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const { name, email } = session.user;
  const role = session.user.role ?? "admin";
  const tenantId = (session.user as { tenantId?: string }).tenantId;

  const isMaster = isMasterTenant(tenantId);
  let orgName = "Your organization";
  let status: string | null = null;
  if (tenantId) {
    try {
      const [row] = await db
        .select({ name: tenant.name, status: tenant.status })
        .from(tenant)
        .where(eq(tenant.id, tenantId))
        .limit(1);
      if (row?.name) orgName = row.name;
      status = row?.status ?? null;
    } catch {
      // No DB configured — keep the fallback.
    }
  }

  // A suspended *client* admin is locked out too. The master tenant can never be
  // suspended, so founders are unaffected.
  if (!isMaster && status === "suspended") redirect("/suspended");

  return (
    <DashboardShell
      user={{ name, email, role }}
      orgName={orgName}
      isMaster={isMaster}
    >
      {children}
    </DashboardShell>
  );
}
