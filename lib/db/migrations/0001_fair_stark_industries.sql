CREATE TYPE "public"."remediation_status" AS ENUM('open', 'verifying', 'covered', 'verification_error');--> statement-breakpoint
CREATE TABLE "remediation" (
	"id" text PRIMARY KEY NOT NULL,
	"vulnerability_id" text NOT NULL,
	"target_asset" text NOT NULL,
	"status" "remediation_status" DEFAULT 'open' NOT NULL,
	"verification_status" text,
	"detail" text,
	"requested_by_user_id" text,
	"requested_at" timestamp,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "remediation_vulnerability_id_unique" UNIQUE("vulnerability_id")
);
--> statement-breakpoint
ALTER TABLE "remediation" ADD CONSTRAINT "remediation_requested_by_user_id_user_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;