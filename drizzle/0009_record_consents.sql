--> statement-breakpoint
ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "accepted_policies" boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "accepted_policies" boolean NOT NULL DEFAULT false;
