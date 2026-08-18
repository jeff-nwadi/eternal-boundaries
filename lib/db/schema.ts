import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Full set of roles a *user* can hold. `auditor` exists here because a user
 * can be promoted to it — but see `inviteRole` below: it is deliberately NOT
 * grantable through the invite/redemption path (CLAUDE.md §6a, Rule 1).
 */
export const userRole = pgEnum("user_role", ["analyst", "auditor", "admin"]);

/**
 * Roles that an *invite* is allowed to carry. `auditor` is intentionally
 * absent, so the database itself makes it impossible to issue (or redeem) an
 * auditor invite. This is the schema-level half of Rule 1 (deny by default).
 */
export const inviteRole = pgEnum("invite_role", ["analyst", "admin"]);

// ---------------------------------------------------------------------------
// BetterAuth core tables (user / session / account / verification)
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // Role is an additional field on the BetterAuth user. Default is the
  // least-privileged role; it is never settable from the client at sign-up
  // (see lib/auth.ts additionalFields `input: false`).
  role: userRole("role").notNull().default("analyst"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Invites — the only path to account creation (CLAUDE.md §6a)
// ---------------------------------------------------------------------------

export const invite = pgTable("invite", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // The address the invite was issued to. Redemption binds the new account to
  // this email; it cannot be changed by the redeemer.
  email: text("email").notNull(),

  // Rule 1 (schema level): `inviteRole` has no `auditor` member, so an auditor
  // invite is unrepresentable in the database.
  role: inviteRole("role").notNull().default("analyst"),

  // Only the SHA-256 hash of the token is stored. The plaintext token exists
  // only in the invite link handed to the recipient.
  tokenHash: text("token_hash").notNull().unique(),

  // Rule 2 (schema level): every invite is attributed to the admin who issued
  // it — a not-null foreign key to user.id, enforced by the database.
  invitedByAdminId: text("invited_by_admin_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),

  // Rule 2: issue + redemption bookkeeping.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  redeemedAt: timestamp("redeemed_at"),
  redeemedByUserId: text("redeemed_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
});

export type User = typeof user.$inferSelect;
export type Invite = typeof invite.$inferSelect;

// Re-exported so the BetterAuth drizzle adapter receives the full schema.
export const schema = { user, session, account, verification, invite };
