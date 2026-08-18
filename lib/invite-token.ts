import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Generates a fresh invite token (returned once, embedded in the invite link)
 * and the SHA-256 hash that is stored in the database. The plaintext is never
 * persisted.
 */
export function generateInviteToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashInviteToken(token) };
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time comparison of two token hashes. */
export function tokenHashesEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
