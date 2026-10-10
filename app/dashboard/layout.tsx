import { eq } from "drizzle-orm";

import { requireAuth } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { tenant } from "@/lib/db/schema";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const { name, email } = session.user;
  const role = session.user.role ?? "analyst";
  const tenantId = (session.user as { tenantId?: string }).tenantId;

  // Read-only org name (the acting user's own tenant). Falls back if no DB.
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
