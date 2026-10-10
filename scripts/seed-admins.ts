/**
 * One-time bootstrap (and optional reset) for the single master-tenant admin account.
 *
 * Why this exists: the invite system is a closed loop — accounts are created
 * only from invites, and invites can only be issued by an existing admin
 * (schema-enforced NOT NULL FK to user.id). On a fresh database there is no
 * admin to issue that first invite, so there is no in-app way to create one.
 * This manual script is the single sanctioned exception (CLAUDE.md §6a).
 *
 * Safety properties (all retained from the original):
 *   - Not an HTTP route. Runs only when an operator executes it from a shell.
 *   - One-time by default. Refuses to run if ANY admin already exists, unless
 *     the --reset flag is passed with explicit intent to wipe and recreate.
 *   - Dev/setup only. Refuses to run under NODE_ENV=production.
 *   - Password is typed interactively with hidden/masked input — it is NEVER
 *     printed, logged, or stored in plaintext. Only BetterAuth's hash is written.
 *
 * Run (needs DATABASE_URL + BETTER_AUTH_SECRET in .env.local):
 *
 *   # Fresh database — no admin yet:
 *   npm run db:seed-admins -- admin@company.com
 *
 *   # Reset: wipe existing admin(s) and start fresh:
 *   npm run db:seed-admins -- admin@company.com --reset
 *
 *   # Or set ADMIN_EMAIL in .env.local and omit the argument:
 *   npm run db:seed-admins
 *   npm run db:seed-admins -- --reset
 */
import * as readline from "node:readline";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq, inArray } from "drizzle-orm";

import { db } from "../lib/db";
import { schema, tenant, user, account, session, invite } from "../lib/db/schema";
import { MASTER_TENANT_ID, MASTER_TENANT_NAME } from "../lib/tenancy";

// ---------------------------------------------------------------------------
// CLI-only BetterAuth instance — no nextCookies plugin, no HTTP exposure.
// ---------------------------------------------------------------------------
const cliAuth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  user: {
    additionalFields: {
      tenantId: { type: "string", required: true, input: true },
    },
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

function isEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

/**
 * Prompts for a password with hidden/masked input (input is NOT echoed to the
 * terminal). Returns the typed string. Works on Windows and Unix.
 */
async function promptPassword(label: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Hide input: replace the stream's write so nothing is echoed.
    const originalWrite = (rl as unknown as { output: { write: (s: string) => void } }).output.write.bind(
      (rl as unknown as { output: { write: (s: string) => void } }).output
    );
    (rl as unknown as { output: { write: (s: string) => void } }).output.write = (s: string) => {
      // Allow the prompt label itself; suppress everything that follows.
      if (s === label) originalWrite(s);
    };

    rl.question(label, (answer) => {
      // Emit a newline since we suppressed the \n from Enter.
      originalWrite("\n");
      rl.close();
      resolve(answer);
    });
  });
}

// ---------------------------------------------------------------------------
// Reset: delete existing admin users and their related rows
// ---------------------------------------------------------------------------

async function deleteExistingAdmins() {
  const existing = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.role, "admin"));

  if (existing.length === 0) return;

  const ids = existing.map((u) => u.id);

  console.log("\n  Existing admin accounts to be removed:");
  for (const u of existing) {
    console.log(`    • ${u.email} (id: ${u.id})`);
  }
  console.log();

  // Cascade manually in the correct dependency order.
  // session → account have ON DELETE CASCADE from user, but invite.invited_by_admin_id
  // is RESTRICT, so we null-ify / delete dependent invites first.
  //
  // Un-redeem invites issued BY these admins (set invited_by_admin_id is RESTRICT FK).
  // Since we're wiping the whole admin tier, delete those invites entirely.
  await db.delete(invite).where(inArray(invite.invitedByAdminId, ids));

  // sessions and accounts are ON DELETE CASCADE from user, but drizzle-ORM won't
  // automatically cascade — call explicit deletes for safety.
  await db.delete(session).where(inArray(session.userId, ids));
  await db.delete(account).where(inArray(account.userId, ids));
  await db.delete(user).where(inArray(user.id, ids));

  console.log(`  ✓ Removed ${existing.length} admin account(s) and their related rows.\n`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (process.env.NODE_ENV === "production") {
    fail("Refusing to run under NODE_ENV=production. This is a dev/setup-only bootstrap.");
  }
  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL is not set. Point it at your Neon instance in .env.local first.");
  }
  if (!process.env.BETTER_AUTH_SECRET) {
    fail("BETTER_AUTH_SECRET is not set in .env.local.");
  }

  // Parse args: any non-flag arg is the email; --reset enables wipe mode.
  const rawArgs = process.argv.slice(2);
  const flags = new Set(rawArgs.filter((a) => a.startsWith("--")));
  const positional = rawArgs.filter((a) => !a.startsWith("--"));

  const isReset = flags.has("--reset");
  const email = (positional[0] ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

  if (!email) {
    fail(
      "An admin email is required.\n" +
        "    Usage: npm run db:seed-admins -- admin@company.com\n" +
        "    Or set ADMIN_EMAIL in .env.local and omit the argument."
    );
  }
  if (!isEmail(email)) {
    fail(`"${email}" is not a valid email address.`);
  }

  // ---------------------------------------------------------------------------
  // Guard: check for existing admin
  // ---------------------------------------------------------------------------
  const existingAdmins = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.role, "admin"));

  if (existingAdmins.length > 0 && !isReset) {
    const list = existingAdmins.map((u) => `  • ${u.email}`).join("\n");
    fail(
      `This database already has ${existingAdmins.length} admin account(s):\n\n${list}\n\n` +
        "  Bootstrap is one-time by default.\n" +
        "  To wipe and recreate, re-run with --reset:\n" +
        "    npm run db:seed-admins -- admin@company.com --reset"
    );
  }

  // ---------------------------------------------------------------------------
  // Collect password interactively — hidden/masked, never printed
  // ---------------------------------------------------------------------------
  console.log(`\n  Setting up admin account: ${email}`);
  if (isReset) {
    console.log("  ⚠  --reset mode: existing admin(s) will be deleted before creating the new one.\n");
  }

  let password = "";
  let confirmed = "";

  while (true) {
    password = await promptPassword("  Enter password (min 12 chars): ");
    if (password.length < 12) {
      console.error("  ✗ Password must be at least 12 characters. Try again.\n");
      continue;
    }
    confirmed = await promptPassword("  Confirm password: ");
    if (password !== confirmed) {
      console.error("  ✗ Passwords do not match. Try again.\n");
      continue;
    }
    break;
  }

  // ---------------------------------------------------------------------------
  // Reset: delete existing admins if --reset was passed
  // ---------------------------------------------------------------------------
  if (isReset) {
    await deleteExistingAdmins();
  }

  // ---------------------------------------------------------------------------
  // Ensure master tenant exists (idempotent)
  // ---------------------------------------------------------------------------
  await db
    .insert(tenant)
    .values({ id: MASTER_TENANT_ID, name: MASTER_TENANT_NAME, isMaster: true })
    .onConflictDoNothing();

  // ---------------------------------------------------------------------------
  // Create the admin account via BetterAuth (password is hashed in-process)
  // ---------------------------------------------------------------------------
  try {
    const res = await cliAuth.api.signUpEmail({
      body: {
        email,
        password,
        name: email.split("@")[0],
        tenantId: MASTER_TENANT_ID,
      },
    });
    await db.update(user).set({ role: "admin" }).where(eq(user.id, res.user.id));
  } catch (err) {
    fail(
      `Could not create admin account: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Explicitly clear the password variable from memory.
  password = "";
  confirmed = "";

  console.log("\n  ✓ Admin account created successfully.");
  console.log(`    email:  ${email}`);
  console.log("    tenant: " + MASTER_TENANT_ID);
  console.log("\n  Sign in at /login.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
