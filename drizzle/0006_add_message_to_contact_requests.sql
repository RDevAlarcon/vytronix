ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "message" text NOT NULL DEFAULT '';
