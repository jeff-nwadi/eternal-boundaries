"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireMasterAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { demoRequest } from "@/lib/db/schema";

/**
 * Master-tenant-only. Permanently deletes a captured demo request (lead).
 */
export async function deleteDemoRequest(
  id: string
): Promise<{ success: true } | { error: string }> {
  const session = await requireMasterAdmin();
  if (!id) return { error: "Missing request." };

  const deleted = await db
    .delete(demoRequest)
    .where(eq(demoRequest.id, id))
    .returning({ id: demoRequest.id, email: demoRequest.email });

  if (deleted.length === 0) return { error: "Request not found." };

  await recordAudit({
    action: "demo_request.deleted",
    actorUserId: session.user.id,
    actorEmail: session.user.email,
    actorTenantId: tenantScopeOf(session),
    targetLabel: deleted[0].email,
  });

  revalidatePath("/admin/demo-requests");
  revalidatePath("/admin/audit");
  return { success: true };
}
