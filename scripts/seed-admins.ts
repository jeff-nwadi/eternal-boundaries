/**
 * One-time bootstrap for the first TWO admin accounts.
 *
 * Why this exists: the invite system is a closed loop — accounts are created
 * only from invites, and invites can only be issued by an existing admin
 * (schema-enforced not-null FK to user.id). On a fresh database there is no
 * admin to issue that first invite, so there is no in-app way to create one.
 * This manual script is the single sanctioned exception (CLAUDE.md §6a).
 *
 * Safety properties:
 *   - Not an HTTP route. It cannot be triggered by a request — it only runs
 *     when an operator executes it from a shell.
 *   - One-time. It refuses to run if ANY admin already exists, so it can never
 *     re-seed a database that has already been set up.
 *   - Dev/setup only. It refuses to run under NODE_ENV=production.
 *   - Passwords are generated, printed once, and never stored in plaintext —
 *     only BetterAuth's hash reaches the database.
 *
 * Run (needs a real DATABASE_URL + BETTER_AUTH_SECRET in .env.local):
 *   npm run db:seed-admins -- first.admin@company.com second.admin@company.com
 * or set ADMIN_EMAIL_1 / ADMIN_EMAIL_2 in .env.local and run:
 *   npm run db:seed-admins
 */
import { randomBytes } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import { db } from "../lib/db";
import { schema, tenant, user } from "../lib/db/schema";
import { MASTER_TENANT_ID, MASTER_TENANT_NAME } from "../lib/tenancy";

// CLI-only BetterAuth instance — no nextCookies plugin, so it works outside a
// request context. Account creation here is in-process and never touches the
// HTTP sign-up endpoint (which is blocked anyway).
//
// tenantId must be a declared additionalField (input: true) so the signup body
// can set the NOT NULL tenant column at insert time (CLAUDE.md §6b).
const cliAuth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      tenantId: { type: "string", required: true, input: true },
    },
  },
});

function generatePassword(): string {
  // ~24 chars, URL-safe, ~108 bits of entropy.
  return randomBytes(18).toString("base64url");
}

function isEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    fail("Refusing to run under NODE_ENV=production. This is a dev/setup-only bootstrap.");
  }
  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL is not set. Point it at your Neon instance in .env.local first.");
  }

  // Emails: positional args win, otherwise ADMIN_EMAIL_1 / ADMIN_EMAIL_2.
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const email1 = (args[0] ?? process.env.ADMIN_EMAIL_1 ?? "").trim().toLowerCase();
  const email2 = (args[1] ?? process.env.ADMIN_EMAIL_2 ?? "").trim().toLowerCase();

  if (!email1 || !email2) {
    fail(
      "Two admin emails are required.\n" +
        "    Usage: npm run db:seed-admins -- admin1@company.com admin2@company.com\n" +
        "    Or set ADMIN_EMAIL_1 and ADMIN_EMAIL_2 in .env.local."
    );
  }
  if (!isEmail(email1) || !isEmail(email2)) {
    fail("One of the provided values is not a valid email address.");
  }
  if (email1 === email2) {
    fail("Provide two distinct email addresses.");
  }

  // One-time guard: refuse if the database already has any admin.
  const existingAdmin = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.role, "admin"))
    .limit(1);
  if (existingAdmin.length > 0) {
    fail(
      "This database already has an admin. Bootstrap is one-time — use the in-app\n" +
        "    invite flow to add more admins."
    );
  }

  // Ensure the founders' master tenant exists (§6b). Idempotent.
  await db
    .insert(tenant)
    .values({ id: MASTER_TENANT_ID, name: MASTER_TENANT_NAME, isMaster: true })
    .onConflictDoNothing();

  const created: { email: string; password: string }[] = [];
  for (const email of [email1, email2]) {
    const password = generatePassword();
    try {
      const res = await cliAuth.api.signUpEmail({
        // Both founders belong to the master tenant.
        body: { email, password, name: email.split("@")[0], tenantId: MASTER_TENANT_ID },
      });
      await db.update(user).set({ role: "admin" }).where(eq(user.id, res.user.id));
      created.push({ email, password });
    } catch (err) {
      console.error(
        `  ✗ Could not create ${email}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (created.length === 0) {
    fail("No admin accounts were created.");
  }

  console.log("\n  ✓ Admin accounts created.");
  console.log("  Copy these temporary passwords NOW — they are not stored anywhere");
  console.log("  and will never be shown again.\n");
  for (const c of created) {
    console.log(`    email:    ${c.email}`);
    console.log(`    password: ${c.password}\n`);
  }
  console.log("  Sign in at /login, then change each password immediately.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
