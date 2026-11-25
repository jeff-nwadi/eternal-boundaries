import "server-only";

import { Resend } from "resend";

/**
 * Emails the team about a new demo request. Returns true if sent.
 *
 * Fails soft: if Resend isn't configured (no RESEND_API_KEY, or no
 * DEMO_TO_EMAIL recipient), or the send errors, it returns false WITHOUT
 * throwing — the request is already persisted and the user still sees success.
 * Set RESEND_API_KEY, DEMO_TO_EMAIL (team inbox), and optionally DEMO_FROM_EMAIL
 * to enable it.
 */
export async function sendDemoRequestEmail(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DEMO_TO_EMAIL;
  const from = process.env.DEMO_FROM_EMAIL ?? "Eternal Boundaries <onboarding@resend.dev>";

  if (!apiKey || !to) return false;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New demo request — ${email}`,
      text: [
        "A new demo request came in from the landing page.",
        "",
        `Email:   ${email}`,
        `Time:    ${new Date().toISOString()}`,
        `Source:  landing-cta`,
      ].join("\n"),
    });
    return !error;
  } catch {
    return false;
  }
}
