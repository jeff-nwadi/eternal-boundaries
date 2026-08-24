-- Multi-tenancy (CLAUDE.md §6b). Hand-tuned from the generated diff so it is
-- safe on a table that already holds Phase-2 rows: columns are added NULLABLE,
-- every existing row is backfilled into the master tenant, and only then are
-- the NOT NULL + FK constraints enforced. No existing account/invite is dropped.

-- 1. Tenants table + the founders' master tenant.
CREATE TABLE "tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_master" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "tenant" ("id", "name", "is_master")
VALUES ('system-admin-01', 'Eternal Boundaries (Founders)', true)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint

-- 2. Add the columns NULLABLE first so existing rows survive the ALTER.
ALTER TABLE "invite" ADD COLUMN "tenant_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tenant_id" text;--> statement-breakpoint

-- 3. Backfill every pre-existing row into the master tenant. (No-op on an
--    empty database.)
UPDATE "invite" SET "tenant_id" = 'system-admin-01' WHERE "tenant_id" IS NULL;--> statement-breakpoint
UPDATE "user" SET "tenant_id" = 'system-admin-01' WHERE "tenant_id" IS NULL;--> statement-breakpoint

-- 4. Now enforce referential integrity and non-nullability.
ALTER TABLE "invite" ADD CONSTRAINT "invite_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite" ALTER COLUMN "tenant_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "tenant_id" SET NOT NULL;
