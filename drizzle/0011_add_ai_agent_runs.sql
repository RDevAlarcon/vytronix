--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_agent_runs" (
  "id" text PRIMARY KEY NOT NULL,
  "contact_request_id" text NOT NULL,
  "agent" text NOT NULL,
  "status" text NOT NULL,
  "engine_run_id" text,
  "provider" text,
  "model" text,
  "duration_ms" integer,
  "attempt_count" integer,
  "parsed_output" jsonb,
  "error_code" text,
  "error_message" text,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "ai_agent_runs_contact_request_id_contact_requests_id_fk"
    FOREIGN KEY ("contact_request_id") REFERENCES "public"."contact_requests"("id")
    ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_agent_runs_contact_request_idx" ON "ai_agent_runs" USING btree ("contact_request_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_agent_runs_created_idx" ON "ai_agent_runs" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_agent_runs_status_idx" ON "ai_agent_runs" USING btree ("status");
