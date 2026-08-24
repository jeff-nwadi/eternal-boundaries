"use server";

import { eq } from "drizzle-orm";

import { requireAuth } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { remediation } from "@/lib/db/schema";

const ENGINE_TIMEOUT_MS = Number(process.env.GATE_ENGINE_TIMEOUT_MS ?? 5000);

export type RemediationOutcome =
  | { status: "verifying" }
  | { status: "verification_error"; detail: string };

/**
 * "Mark as remediated" (CLAUDE.md §5.5). Sets the finding to `verifying`, then
 * fires the outbound webhook to the client's on-prem engine with a bounded
 * timeout. It NEVER sets `covered` — that can only come from the signed engine
 * callback (/api/remediate/webhook). Any outbound failure/timeout is fail-closed
 * to `verification_error` so the UI can distinguish it from a plain "open".
 */
export async function requestRemediation(input: {
  vulnerabilityId: string;
  targetAsset: string;
}): Promise<RemediationOutcome> {
  const session = await requireAuth();
  const vulnerabilityId = input.vulnerabilityId.trim();
  const targetAsset = input.targetAsset.trim();
  if (!vulnerabilityId || !targetAsset) {
    return { status: "verification_error", detail: "Missing finding details." };
  }

  const now = new Date();
  await db
    .insert(remediation)
    .values({
      vulnerabilityId,
      targetAsset,
      status: "verifying",
      requestedByUserId: session.user.id,
      requestedAt: now,
      detail: null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: remediation.vulnerabilityId,
      set: {
        status: "verifying",
        targetAsset,
        requestedByUserId: session.user.id,
        requestedAt: now,
        detail: null,
        updatedAt: now,
      },
    });

  const engineUrl = process.env.GATE_ENGINE_URL;
  if (!engineUrl) {
    return failClosed(vulnerabilityId, "Engine endpoint is not configured.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ENGINE_TIMEOUT_MS);
  try {
    const res = await fetch(engineUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        vulnerability_id: vulnerabilityId,
        target_asset: targetAsset,
        callback_path: "/api/remediate/webhook",
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return failClosed(vulnerabilityId, `Engine responded ${res.status}.`);
    }
    // Accepted. The engine now replays the exploit and POSTs the signed result
    // to our webhook; the UI polls status until covered / verification_error.
    return { status: "verifying" };
  } catch (err) {
    clearTimeout(timer);
    const timedOut = err instanceof Error && err.name === "AbortError";
    return failClosed(
      vulnerabilityId,
      timedOut ? "Engine timed out." : "Engine unreachable."
    );
  }
}

async function failClosed(
  vulnerabilityId: string,
  detail: string
): Promise<RemediationOutcome> {
  await db
    .update(remediation)
    .set({ status: "verification_error", detail, updatedAt: new Date() })
    .where(eq(remediation.vulnerabilityId, vulnerabilityId));
  return { status: "verification_error", detail };
}
