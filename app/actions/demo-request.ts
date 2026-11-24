"use server";

import { demoRequestSchema, type DemoRequestState } from "@/lib/schemas/demo-request";

/** Lead destination and Arcjet rate limiting are intentionally not configured yet. */
export async function requestDemo(
  _previousState: DemoRequestState,
  formData: FormData,
): Promise<DemoRequestState> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { status: "not_configured" };
  }

  const result = demoRequestSchema.safeParse({ email: formData.get("email") });
  if (!result.success) return { status: "invalid" };

  // Add Arcjet before accepting requests, then connect an approved destination.
  // Do not report success until a real destination has accepted the request.
  return { status: "not_configured" };
}
