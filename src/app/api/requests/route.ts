import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db/client";
import { aiAgentRuns, contactRequests } from "@/server/db/schema";
import { sendContactNotificationEmail } from "@/server/email/mailer";
import { rateLimit } from "@/server/utils/rate-limit";
import { isAiEngineEnabled, runAgentForContact, selectAgentsForContact, type AgentName } from "@/server/ai/engine";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20).regex(/^[+\d().\-\s]+$/i, "Formato de telefono invalido"),
  message: z.string().min(10, "Cuentanos un poco mas (min. 10 caracteres)").max(1000, "Maximo 1000 caracteres"),
  acceptedPolicies: z
    .boolean()
    .refine((value) => value === true, { message: "Debes aceptar la politica de privacidad" })
});

const persistAiRun = async (
  params: {
    contactRequestId: string;
    agent: AgentName;
    status: "success" | "error";
    engineRunId?: string | null;
    provider?: string | null;
    model?: string | null;
    durationMs?: number | null;
    attemptCount?: number | null;
    parsedOutput?: Record<string, unknown> | null;
    errorCode?: string | null;
    errorMessage?: string | null;
  }
): Promise<void> => {
  await db.insert(aiAgentRuns).values({
    id: crypto.randomUUID(),
    contactRequestId: params.contactRequestId,
    agent: params.agent,
    status: params.status,
    engineRunId: params.engineRunId ?? null,
    provider: params.provider ?? null,
    model: params.model ?? null,
    durationMs: params.durationMs ?? null,
    attemptCount: params.attemptCount ?? null,
    parsedOutput: params.parsedOutput ?? null,
    errorCode: params.errorCode ?? null,
    errorMessage: params.errorMessage ?? null
  });
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return NextResponse.json(
      { error: "invalid", details: { fieldErrors: flattened.fieldErrors } },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = parsed.data;

  // Rate limit: 5 por 10 minutos por IP/email
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown";
  const WINDOW = 10 * 60 * 1000;
  const MAX = 5;
  const rl1 = rateLimit(`req:ip:${ip}`, WINDOW, MAX);
  const rl2 = rateLimit(`req:email:${email}`, WINDOW, MAX);
  if (!rl1.ok || !rl2.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const id = crypto.randomUUID();
  try {
    await db.insert(contactRequests).values({ id, name, email, phone, message, acceptedPolicies: true });
  } catch {
    // Fallback si la columna message aun no existe en la base
    await db.execute(sql`insert into "contact_requests" ("id","name","email","phone","accepted_policies") values (${id}, ${name}, ${email}, ${phone}, ${true})`);
  }

  const mailResult = await sendContactNotificationEmail({ name, email, phone, message });
  if (!mailResult.ok) {
    console.error("[MAIL] Contact notification error", mailResult.error);
  }

  // Integracion opcional con Vytronix AI Engine (no bloqueante)
  if (isAiEngineEnabled()) {
    const contactInput = { name, email, phone, message };
    const selectedAgents = selectAgentsForContact(contactInput);

    void Promise.allSettled(
      selectedAgents.map(async (agent) => {
        const aiResult = await runAgentForContact(agent, contactInput);

        if (!aiResult.success) {
          await persistAiRun({
            contactRequestId: id,
            agent,
            status: "error",
            errorCode: aiResult.error?.code ?? null,
            errorMessage: aiResult.error?.message ?? "Unknown AI engine error"
          });

          console.error(`[AI] ${agent} run failed`, aiResult.error);
          return;
        }

        await persistAiRun({
          contactRequestId: id,
          agent,
          status: "success",
          engineRunId: aiResult.data?.runId ?? null,
          provider: aiResult.data?.metadata.provider ?? null,
          model: aiResult.data?.metadata.model ?? null,
          durationMs: aiResult.data?.metadata.durationMs ?? null,
          attemptCount: aiResult.data?.metadata.attemptCount ?? null,
          parsedOutput: aiResult.data?.parsedOutput ?? null
        });

        console.log(`[AI] ${agent} run success`, {
          runId: aiResult.data?.runId,
          model: aiResult.data?.metadata.model,
          durationMs: aiResult.data?.metadata.durationMs
        });
      })
    ).catch((error) => {
      console.error("[AI] Unexpected multi-agent pipeline error", error);
    });
  }

  return NextResponse.json({ ok: true });
}
