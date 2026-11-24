import "server-only";

import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";

/**
 * The closed set of account-control actions we record. Keeping this a union (and
 * passing it through `recordAudit`) means every call site writes a consistent,
 * grep-able action key rather than an ad-hoc string.
 */
export type AuditAction =
  | "tenant.provisioned"
  | "tenant.suspended"
  | "tenant.reactivated"
  | "invite.created"
  | "invite.revoked"
  | "invite.redeemed"
  | "user.promoted_auditor";

export type AuditEntry = {
  action: AuditAction;
  actorUserId: string | null;
  actorEmail: string;
  actorTenantId: string;
  targetTenantId?: string | null;
  targetLabel?: string | null;
  detail?: string | null;
};

/**
 * Writes one append-only audit row. Awaited by callers so a write failure
 * surfaces loudly rather than silently dropping an audit entry — an audit trail
 * that quietly loses records is worse than none.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  await db.insert(auditLog).values({
    action: entry.action,
    actorUserId: entry.actorUserId,
    actorEmail: entry.actorEmail,
    actorTenantId: entry.actorTenantId,
    targetTenantId: entry.targetTenantId ?? null,
    targetLabel: entry.targetLabel ?? null,
    detail: entry.detail ?? null,
  });
}
