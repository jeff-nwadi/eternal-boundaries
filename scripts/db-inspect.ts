/**
 * Read-only database inspector. Run with the env file so DATABASE_URL is set:
 *   npx tsx --env-file=.env.local scripts/db-inspect.ts
 * Prints a REDACTED connection summary, the public tables, whether a Drizzle
 * migration journal exists, and whether the `remediation` table is present.
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  let summary: Record<string, unknown> = { present: Boolean(url) };
  try {
    const u = new URL(url);
    summary = {
      present: true,
      scheme: u.protocol.replace(":", ""),
      hasUser: Boolean(u.username),
      hasPassword: Boolean(u.password),
      isNeon: u.hostname.endsWith(".neon.tech"),
      hasDatabase: u.pathname.length > 1,
      sslmode: u.searchParams.get("sslmode"),
    };
  } catch (err) {
    summary = { present: Boolean(url), parseError: String(err) };
  }
  console.log("DATABASE_URL (redacted):", JSON.stringify(summary));

  if (!url || "parseError" in summary) {
    console.log("=> No usable DATABASE_URL. It is not being loaded.");
    process.exit(1);
  }

  const sql = neon(url);

  const tables = (await sql`
    select tablename from pg_tables where schemaname = 'public' order by tablename
  `) as { tablename: string }[];
  console.log(
    "public tables:",
    tables.map((t) => t.tablename).join(", ") || "(none)"
  );

  let journal = "no journal table";
  try {
    const j = (await sql`select count(*)::int as n from drizzle."__drizzle_migrations"`) as {
      n: number;
    }[];
    journal = `drizzle.__drizzle_migrations rows=${j[0].n}`;
  } catch {
    try {
      const j2 = (await sql`select count(*)::int as n from "__drizzle_migrations"`) as {
        n: number;
      }[];
      journal = `public.__drizzle_migrations rows=${j2[0].n}`;
    } catch {
      journal = "no journal table (schema was likely applied via db:push)";
    }
  }
  console.log("migration journal:", journal);
  console.log(
    "remediation table exists:",
    tables.some((t) => t.tablename === "remediation")
  );
}

main().catch((err) => {
  console.error("INSPECT ERROR:", err instanceof Error ? err.message : err);
  process.exit(1);
});
