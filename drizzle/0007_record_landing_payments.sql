CREATE TABLE IF NOT EXISTS "landing_payments" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "external_reference" text NOT NULL,
  "status" text NOT NULL,
  "status_detail" text,
  "transaction_amount" integer NOT NULL,
  "currency_id" text NOT NULL,
  "payment_method_id" text,
  "payment_type_id" text,
  "payer_email" text,
  "mp_created_at" timestamptz,
  "raw_payload" jsonb,
  "created_at" timestamptz DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "landing_payments_user_idx" ON "landing_payments" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "landing_payments_reference_idx" ON "landing_payments" ("external_reference");
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "landing_discount_consumed_at" timestamptz;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "landing_discount_payment_id" text;
