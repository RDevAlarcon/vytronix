ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'nuevo';
CREATE INDEX IF NOT EXISTS "cr_status_idx" ON "contact_requests" ("status");
