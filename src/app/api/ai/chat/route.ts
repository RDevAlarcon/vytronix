import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAiEngineEnabled, runAgentForContact, selectAgentsForContact, type AgentName } from "@/server/ai/engine";

export const runtime = "nodejs";

const schema = z.object({
  message: z.string().min(3).max(1000),
  agent: z.enum(["auto", "lead", "landing", "proposal", "support"]).default("auto")
});

const chooseAgent = (message: string, preferred: "auto" | AgentName): AgentName => {
  if (preferred !== "auto") {
    return preferred;
  }

  const selected = selectAgentsForContact({
    name: "Website Visitor",
    email: "visitor@vytronix.local",
    phone: "N/A",
    message
  });

  return selected[0] ?? "lead";
};

const formatReply = (agent: AgentName, parsedOutput: Record<string, unknown>): string => {
  const readString = (...keys: string[]): string | null => {
    for (const key of keys) {
      const value = parsedOutput[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
    return null;
  };

  switch (agent) {
    case "lead":
      return (
        readString("safe_reply", "reply_to_client", "suggested_next_action", "summary") ??
        "Gracias por tu consulta. Te contactaremos para ayudarte con el siguiente paso comercial."
      );
    case "landing":
      return (
        readString("brief_markdown", "project_summary") ??
        "Podemos preparar un brief de landing. Necesitamos objetivo, audiencia y CTA principal."
      );
    case "proposal":
      return (
        readString("executive_summary", "proposal_title") ??
        "Podemos preparar una propuesta inicial con alcance, entregables y siguientes pasos."
      );
    case "support":
      return (
        readString("suggested_reply", "summary") ??
        "Recibimos tu incidencia y la derivaremos al equipo de soporte para revisarla."
      );
    default:
      return "Gracias por tu mensaje."
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Solicitud invalida" }, { status: 400 });
  }

  if (!isAiEngineEnabled()) {
    return NextResponse.json({ success: false, error: "Asistente AI no disponible" }, { status: 503 });
  }

  const requestedAgent = parsed.data.agent;
  const chosenAgent = chooseAgent(parsed.data.message, requestedAgent);

  const runResult = await runAgentForContact(chosenAgent, {
    name: "Website Visitor",
    email: "visitor@vytronix.local",
    phone: "N/A",
    message: parsed.data.message
  });

  if (!runResult.success || !runResult.data) {
    return NextResponse.json(
      {
        success: false,
        error: runResult.error?.message ?? "No fue posible responder en este momento"
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    agent: chosenAgent,
    reply: formatReply(chosenAgent, runResult.data.parsedOutput),
    runId: runResult.data.runId
  });
}
