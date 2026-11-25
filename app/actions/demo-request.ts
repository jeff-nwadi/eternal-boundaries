"use server";

import { request } from "@arcjet/next";

import { demoRequestSchema, type DemoRequestState } from "@/lib/schemas/demo-request";
import { demoRequestAj } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { demoRequest } from "@/lib/db/schema";
import { sendDemoRequestEmail } from "@/lib/email/demo-notification";

/**
 * Handle a landing-page demo request:
 *  1. honeypot + email validation
 *  2. Arcjet (bot / email / rate limit) — skipped if ARCJET_KEY is unset
 *  3. persist to Neon (shows up in the founders' Demo requests view)
 *  4. best-effort team email notification (never blocks success)
 */
export async function requestDemo(
  _previousState: DemoRequestState,
  formData: FormData,
): Promise<DemoRequestState> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { status: "error" };
  }

  const parsed = demoRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { status: "invalid" };
  const email = parsed.data.email.toLowerCase();

  // Arcjet: bot detection, email validation, and IP rate limiting. Fails open
  // (skips) when the client isn't configured or Arcjet is unreachable.
  if (demoRequestAj) {
    try {
      const decision = await demoRequestAj.protect(await request(), { email });
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) return { status: "rate_limited" };
        if (decision.reason.isEmail()) return { status: "invalid" };
        return { status: "error" };
      }
    } catch {
      // Arcjet unreachable — don't block a legitimate request.
    }
  }

  try {
    await db.insert(demoRequest).values({ email, source: "landing-cta" });
  } catch {
    return { status: "error" };
  }

  // Notify the team. Soft-fails (no key / send error) without failing the request.
  await sendDemoRequestEmail(email);

  return { status: "success" };
}
