import crypto from "node:crypto";

/**
 * HMAC-SHA256 verification for the remediation webhook (CLAUDE.md §5.5).
 *
 * The engine signs the concatenation of `vulnerability_id + target_asset +
 * verification_status`. We recompute the HMAC over the same fields and compare
 * with `crypto.timingSafeEqual` (never `===`). Rotation is supported by
 * verifying against an array of currently-valid secrets (current + incoming).
 */

/** Verification-status values the engine returns that count as isolated. */
const VERIFIED_ISOLATED = new Set([
  "verified",
  "isolated",
  "blocked",
  "intercepted",
  "verified-isolated",
]);

/** A signed result only flips a finding to Covered if it confirms isolation. */
export function isVerifiedIsolated(verificationStatus: string): boolean {
  return VERIFIED_ISOLATED.has(verificationStatus.trim().toLowerCase());
}

/** The payload the signature covers — exactly the three signed fields. */
export function remediationPayload(
  vulnerabilityId: string,
  targetAsset: string,
  verificationStatus: string
): string {
  return `${vulnerabilityId}${targetAsset}${verificationStatus}`;
}

/**
 * Currently-valid secrets, newest first. `GATE_ENGINE_SECRET` is the active
 * secret; `GATE_ENGINE_SECRET_ROTATING` optionally holds the incoming (or
 * outgoing) secret during a rotation window. Never hardcoded.
 */
export function activeSecrets(): string[] {
  return [process.env.GATE_ENGINE_SECRET, process.env.GATE_ENGINE_SECRET_ROTATING]
    .map((s) => s?.trim())
    .filter((s): s is string => Boolean(s));
}

/** Reference dual-secret verification from CLAUDE.md §5.5 (typed). */
export function verifySignatureDualSecret(
  payload: string,
  receivedSignature: string,
  secretsArray: string[]
): boolean {
  if (!receivedSignature) return false;
  const receivedBuffer = Buffer.from(receivedSignature, "utf8");
  for (const secret of secretsArray) {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    const computedBuffer = Buffer.from(computedSignature, "utf8");
    if (computedBuffer.length === receivedBuffer.length) {
      if (crypto.timingSafeEqual(computedBuffer, receivedBuffer)) return true;
    }
  }
  return false;
}

/** Sign a payload (used by tests and the local mock engine, never in the route). */
export function signRemediationPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
