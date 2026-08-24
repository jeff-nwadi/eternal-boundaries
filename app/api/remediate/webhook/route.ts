import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { remediation } from "@/lib/db/schema";
import {
  activeSecrets,
  isVerifiedIsolated,
  remediationPayload,
  verifySignatureDualSecret,
} from "@/lib/remediation-verify";

// node runtime: uses node:crypto (via remediation-verify) and the DB driver.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inbound remediation callback from the client's on-prem engine (CLAUDE.md §5.5).
 *
 * POST /api/remediate/webhook
 *   headers: X-Engine-Signature: <hex HMAC-SHA256>
 *   body:    { vulnerability_id, target_asset, verification_status }
 *
 * The signature is verified BEFORE any database access. On mismatch we return
 * 401 and touch nothing. Only a valid signature whose verification_status
 * confirms isolation flips the finding to "covered".
 */
export async function POST(req: Request) {
  const signature = req.headers.get("x-engine-signature") ?? "";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const vulnerabilityId = String(record.vulnerability_id ?? "").trim();
  const targetAsset = String(record.target_asset ?? "").trim();
  const verificationStatus = String(record.verification_status ?? "").trim();

  if (!vulnerabilityId || !targetAsset || !verificationStatus) {
    return NextResponse.json(
      { error: "Missing vulnerability_id, target_asset, or verification_status." },
      { status: 400 }
    );
  }

  // --- Signature gate: verify BEFORE any DB state is read or written. ---
  const payload = remediationPayload(vulnerabilityId, targetAsset, verificationStatus);
  const secrets = activeSecrets();
  if (secrets.length === 0 || !verifySignatureDualSecret(payload, signature, secrets)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  // Fail-closed: only a confirmed-isolated result flips to "covered". A signed
  // response that does NOT confirm isolation returns the finding to "open".
  const covered = isVerifiedIsolated(verificationStatus);
  const now = new Date();

  try {
    await db
      .insert(remediation)
      .values({
        vulnerabilityId,
        targetAsset,
        status: covered ? "covered" : "open",
        verificationStatus,
        detail: covered ? null : "Engine replay did not confirm isolation.",
        verifiedAt: covered ? now : null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: remediation.vulnerabilityId,
        set: {
          status: covered ? "covered" : "open",
          targetAsset,
          verificationStatus,
          detail: covered ? null : "Engine replay did not confirm isolation.",
          verifiedAt: covered ? now : null,
          updatedAt: now,
        },
      });
  } catch (err) {
    console.error("[remediate/webhook] db write failed", err);
    return NextResponse.json({ error: "Persistence failed." }, { status: 500 });
  }

  // NOTE: the compliance-ledger recompute is intentionally NOT derived here.
  // The sample has no CVE→control link (CLAUDE.md §5.4/§6), so mapping a finding
  // to a specific control would be fabricated. The finding's verified "covered"
  // status is the source of truth; the ledger rollup can consume it once real
  // mapping logic exists.

  return NextResponse.json({ ok: true, status: covered ? "covered" : "open" });
}
