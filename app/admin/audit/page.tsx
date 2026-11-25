import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";

import { requireMasterAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { auditLog, type AuditLog } from "@/lib/db/schema";
import { StatusPill, type Tone } from "@/components/dashboard/status-pill";

export const metadata: Metadata = { title: "Audit log" };

export const dynamic = "force-dynamic";

// Human-readable label + tone per action key.
const ACTION_META: Record<string, { label: string; tone: Tone }> = {
  "tenant.provisioned": { label: "Tenant provisioned", tone: "positive" },
  "tenant.suspended": { label: "Tenant suspended", tone: "critical" },
  "tenant.reactivated": { label: "Tenant reactivated", tone: "positive" },
  "tenant.deleted": { label: "Tenant deleted", tone: "critical" },
  "invite.created": { label: "Invite created", tone: "neutral" },
  "invite.revoked": { label: "Invite revoked", tone: "high" },
  "invite.redeemed": { label: "Invite redeemed", tone: "neutral" },
  "user.promoted_auditor": { label: "Promoted to auditor", tone: "medium" },
  "demo_request.deleted": { label: "Demo request deleted", tone: "high" },
};

function actionMeta(action: string) {
  return ACTION_META[action] ?? { label: action, tone: "neutral" as Tone };
}

function fmt(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/**
 * Founders-only audit trail (§6b). Scoped to actions performed *by* the master
 * tenant via `actorTenantId` — the founders see their own account-control
 * actions, never a client tenant's internal activity.
 */
export default async function AuditLogPage() {
  const session = await requireMasterAdmin();
  const scope = tenantScopeOf(session);

  let entries: AuditLog[] = [];
  try {
    entries = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.actorTenantId, scope))
      .orderBy(desc(auditLog.createdAt))
      .limit(200);
  } catch {
    // No DB configured — render the empty state.
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-black sm:text-4xl">
          Audit log
        </h1>
        <p className="text-sm text-black/55">
          Account-control actions taken by your founders&apos; team — tenant
          provisioning, suspensions, invites and promotions.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Recent activity</h2>
          <span className="text-sm tabular-nums text-black/55">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl bg-black/[0.04] p-6 text-sm text-black/55">
            No account-control actions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-black/[0.04]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-black/55">
                  <th className="px-6 py-3 font-normal">When</th>
                  <th className="px-6 py-3 font-normal">Actor</th>
                  <th className="px-6 py-3 font-normal">Action</th>
                  <th className="px-6 py-3 font-normal">Target</th>
                  <th className="px-6 py-3 font-normal">Detail</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const meta = actionMeta(e.action);
                  return (
                    <tr key={e.id} className="border-t border-black/[0.06] align-top">
                      <td className="whitespace-nowrap px-6 py-3 tabular-nums text-black/55">
                        {fmt(e.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-black">{e.actorEmail}</td>
                      <td className="px-6 py-3">
                        <StatusPill label={meta.label} tone={meta.tone} />
                      </td>
                      <td className="px-6 py-3 text-black/70">{e.targetLabel ?? "—"}</td>
                      <td className="px-6 py-3 text-black/55">{e.detail ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
