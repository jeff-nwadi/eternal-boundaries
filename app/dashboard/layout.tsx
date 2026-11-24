import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-guards";
import { isMasterTenant } from "@/lib/tenancy";
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

  // Founders (master tenant) have no standing access to the SOC dashboard (§6b):
  // send them to the account-control panel instead.
  if (isMasterTenant(tenantId)) redirect("/admin");

  // Read-only org name + status (the acting user's own tenant). Falls back if no
  // DB. Status is captured here and acted on below — redirect() must run outside
  // the try/catch so its control-flow signal isn't swallowed.
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

  // A suspended tenant locks every user out of the product (§6b founders' panel).
  if (status === "suspended") redirect("/suspended");

  return (
    <DashboardShell user={{ name, email, role }} orgName={orgName}>
      {children}
    </DashboardShell>
  );
}
