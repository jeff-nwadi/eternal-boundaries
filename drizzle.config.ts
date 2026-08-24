import { readFileSync } from "node:fs";

import { defineConfig } from "drizzle-kit";

// drizzle-kit auto-loads `.env` but NOT `.env.local` (a Next.js convention),
// so without this the connection string is missing and the CLI hangs on the
// placeholder host. Load `.env.local` here unless the var is already set.
if (!process.env.DATABASE_URL) {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env.local — `db:generate` (schema-only) still works.
  }
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // `db:generate` reads the schema only and doesn't connect; `db:push`
    // (this project's workflow) and `db:studio` need a real DATABASE_URL.
    url: process.env.DATABASE_URL ?? "postgresql://placeholder/placeholder",
  },
  verbose: true,
  strict: true,
});
