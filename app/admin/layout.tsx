import { eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth-guards";
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

  let orgName = "Your organization";
  if (tenantId) {
    try {
      const [row] = await db
        .select({ name: tenant.name })
        .from(tenant)
        .where(eq(tenant.id, tenantId))
        .limit(1);
      if (row?.name) orgName = row.name;
    } catch {
      // No DB configured — keep the fallback.
    }
  }

  return (
    <DashboardShell user={{ name, email, role }} orgName={orgName}>
      {children}
    </DashboardShell>
  );
}
