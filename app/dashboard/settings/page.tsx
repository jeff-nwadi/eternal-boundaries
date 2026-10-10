import { eq } from "drizzle-orm";

import { requireAuth } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { tenant } from "@/lib/db/schema";
import { SettingsView } from "@/components/dashboard/settings/settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireAuth();
  const { name, email } = session.user;
  const role = session.user.role ?? "analyst";
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
    <SettingsView
      name={name ?? ""}
      email={email ?? ""}
      role={role}
      orgName={orgName}
    />
  );
}
