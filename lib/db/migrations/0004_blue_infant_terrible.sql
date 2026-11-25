CREATE TYPE "public"."demo_request_status" AS ENUM('new', 'reviewed', 'archived');--> statement-breakpoint
CREATE TABLE "demo_request" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"status" "demo_request_status" DEFAULT 'new' NOT NULL,
	"source" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
