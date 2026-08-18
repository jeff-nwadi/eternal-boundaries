import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import { schema } from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),

  // Placeholder secret keeps `next build` working before env is set; a real
  // BETTER_AUTH_SECRET must be provided in .env.local for any real deployment.
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "development-placeholder-secret-set-a-real-one-in-env",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    // There is no public sign-up: the HTTP /sign-up endpoint is blocked in the
    // route handler (app/api/auth/[...all]/route.ts). User records are created
    // only in-process by the invite-redemption action. autoSignIn logs the
    // redeemer straight in via the nextCookies plugin.
    autoSignIn: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "analyst",
        // Critical: a client can NEVER set its own role during account
        // creation. Role is assigned server-side from the invite (and can
        // only ever be analyst or admin there — see actions/invites.ts).
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },

  // nextCookies must be the last plugin so it can flush auth cookies set during
  // server actions (e.g. redemption auto-sign-in).
  plugins: [nextCookies()],
});
