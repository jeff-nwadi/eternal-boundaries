import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // `db:generate` reads the schema only and does not connect; `db:migrate`
    // and `db:studio` require a real DATABASE_URL in .env.local.
    url: process.env.DATABASE_URL ?? "postgresql://placeholder/placeholder",
  },
  verbose: true,
  strict: true,
});
