import "server-only";

import arcjet, { protectSignup, shield } from "@arcjet/next";

/**
 * Arcjet client for the public demo-request form. One `protectSignup` rule
 * bundles bot detection, email validation, and an IP rate limit; `shield`
 * covers common attacks. Only created when ARCJET_KEY is set — absent (e.g. in
 * local dev), this is `null` and the caller fails open (skips protection) so the
 * form still works. Add ARCJET_KEY from https://app.arcjet.com to enable it.
 */
const key = process.env.ARCJET_KEY;

export const demoRequestAj = key
  ? arcjet({
      key,
      rules: [
        shield({ mode: "LIVE" }),
        protectSignup({
          email: {
            mode: "LIVE",
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
          },
          bots: { mode: "LIVE", allow: [] },
          rateLimit: { mode: "LIVE", interval: "10m", max: 5 },
        }),
      ],
    })
  : null;
