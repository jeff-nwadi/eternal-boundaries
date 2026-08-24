import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { remediation } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type RemediationStatusValue =
  | "open"
  | "verifying"
  | "covered"
  | "verification_error";

export type RemediationStatusMap = Record<
  string,
  { status: RemediationStatusValue; detail: string | null }
>;

/**
 * Auth-gated status feed for the dashboard to poll while a remediation is in
 * flight. Returns a map of vulnerabilityId → { status, detail }.
 */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let statuses: RemediationStatusMap = {};
  try {
    const rows = await db
      .select({
        vulnerabilityId: remediation.vulnerabilityId,
        status: remediation.status,
        detail: remediation.detail,
      })
      .from(remediation);
    statuses = Object.fromEntries(
      rows.map((r) => [r.vulnerabilityId, { status: r.status, detail: r.detail }])
    );
  } catch (err) {
    // Table not migrated / DB unavailable — return empty rather than 500 so the
    // dashboard still renders the findings (all treated as "open").
    console.error("[remediate/status] read failed", err);
  }

  return NextResponse.json({ statuses });
}
