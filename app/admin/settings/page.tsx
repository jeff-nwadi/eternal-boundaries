import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { requireMasterAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { tenant } from "@/lib/db/schema";
import { SettingsView } from "@/components/dashboard/settings/settings-view";

export const metadata: Metadata = { title: "Settings" };

export const dynamic = "force-dynamic";

/**
 * Founders-only (master tenant) settings — profile, organization, and account.
 * Reuses the shared SettingsView; scoped to the acting founder's own account.
 */
export default async function AdminSettingsPage() {
  const session = await requireMasterAdmin();
  const { name, email } = session.user;
  const role = session.user.role ?? "admin";
  const tenantId = (session.user as { tenantId?: string }).tenantId;

  let orgName = "Eternal Boundaries (Founders)";
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
    <SettingsView
      name={name ?? ""}
      email={email ?? ""}
      role={role}
      orgName={orgName}
    />
  );
}
