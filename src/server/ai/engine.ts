import { z } from "zod";

type ContactLeadInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type LeadAgentParsedOutput = {
  summary: string;
  detected_service: string;
  lead_temperature: "cold" | "warm" | "hot";
  missing_information: string[];
  suggested_next_action: string;
  reply_to_client: string;
  is_in_scope: boolean;
  out_of_scope_reason: string | null;
  safe_reply: string;
};

type LeadAgentRunResponse = {
  success: boolean;
  data?: {
    runId: string;
    parsedOutput: LeadAgentParsedOutput;
    metadata: {
      durationMs: number;
      model: string;
      provider: string;
    };
  };
  error?: {
    code?: string;
    message?: string;
  };
};

const boolFromEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) {
    return fallback;
  }
  return value.toLowerCase() === "true";
};

const timeoutFromEnv = (): number => {
  const raw = Number(process.env.AI_ENGINE_TIMEOUT_MS ?? 3500);
  if (!Number.isFinite(raw) || raw < 500) {
    return 3500;
  }
  if (raw > 20000) {
    return 20000;
  }
  return Math.trunc(raw);
};

export const isAiEngineEnabled = (): boolean => boolFromEnv(process.env.AI_ENGINE_ENABLED, false);

const getBaseUrl = (): string | null => {
  const value = process.env.AI_ENGINE_BASE_URL?.trim();
  if (!value) {
    return null;
  }
  return value.replace(/\/$/, "");
};

const buildLeadInput = (input: ContactLeadInput) => ({
  leadMessage: input.message,
  companyContext: `Contacto web Vytronix. Nombre: ${input.name}. Email: ${input.email}. Telefono: ${input.phone}.`,
  knownServices: ["Landing pages", "Ads management", "CRM automation", "Web development"]
});

const responseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      runId: z.string(),
      parsedOutput: z.object({
        summary: z.string(),
        detected_service: z.string(),
        lead_temperature: z.enum(["cold", "warm", "hot"]),
        missing_information: z.array(z.string()),
        suggested_next_action: z.string(),
        reply_to_client: z.string(),
        is_in_scope: z.boolean(),
        out_of_scope_reason: z.string().nullable(),
        safe_reply: z.string()
      }),
      metadata: z.object({
        durationMs: z.number(),
        model: z.string(),
        provider: z.string()
      })
    })
    .optional(),
  error: z
    .object({
      code: z.string().optional(),
      message: z.string().optional()
    })
    .optional()
});

export const runLeadAgentForContact = async (input: ContactLeadInput): Promise<LeadAgentRunResponse> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      success: false,
      error: {
        code: "AI_ENGINE_BASE_URL_MISSING",
        message: "AI_ENGINE_BASE_URL is not configured"
      }
    };
  }

  const timeoutMs = timeoutFromEnv();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/agents/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AI_ENGINE_API_KEY ? { "X-API-Key": process.env.AI_ENGINE_API_KEY } : {})
      },
      body: JSON.stringify({
        agent: "lead",
        mode: "standard",
        input: buildLeadInput(input)
      }),
      signal: controller.signal
    });

    const payload = (await response.json().catch(() => null)) as unknown;
    const parsed = responseSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "AI_ENGINE_RESPONSE_INVALID",
          message: "Invalid AI engine response"
        }
      };
    }

    if (!response.ok || !parsed.data.success) {
      return {
        success: false,
        error: {
          code: parsed.data.error?.code ?? "AI_ENGINE_REQUEST_FAILED",
          message: parsed.data.error?.message ?? `AI engine HTTP ${response.status}`
        }
      };
    }

    return parsed.data;
  } catch (error) {
    const isAbortError = error instanceof Error && error.name === "AbortError";
    return {
      success: false,
      error: {
        code: isAbortError ? "AI_ENGINE_TIMEOUT" : "AI_ENGINE_UNREACHABLE",
        message: error instanceof Error ? error.message : "Unknown AI engine error"
      }
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
