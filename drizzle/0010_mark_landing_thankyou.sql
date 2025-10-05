--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "landing_discount_thankyou_shown" boolean NOT NULL DEFAULT false;
