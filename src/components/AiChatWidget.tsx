"use client";

import { FormEvent, useMemo, useState } from "react";

type AgentChoice = "auto" | "lead" | "landing" | "proposal" | "support";

type ChatItem = {
  role: "user" | "assistant";
  text: string;
};

type ChatResponse = {
  success: boolean;
  agent?: string;
  reply?: string;
  error?: string;
};

const AGENT_OPTIONS: Array<{ value: AgentChoice; label: string }> = [
  { value: "auto", label: "Auto (recomendado)" },
  { value: "lead", label: "Lead Agent" },
  { value: "landing", label: "Landing Agent" },
  { value: "proposal", label: "Proposal Agent" },
  { value: "support", label: "Support Agent" }
];

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState<AgentChoice>("auto");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: "assistant",
      text: "Hola, soy el asistente de Vytronix. Te ayudo con leads, landing pages, propuestas y soporte." 
    }
  ]);

  const canSend = useMemo(() => input.trim().length >= 3 && !sending, [input, sending]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    const message = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setSending(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, agent })
      });

      const payload = (await response.json().catch(() => null)) as ChatResponse | null;
      if (!response.ok || !payload || !payload.success || !payload.reply) {
        const fallback = payload?.error ?? "No pude responder ahora. Intenta nuevamente en unos minutos.";
        setMessages((prev) => [...prev, { role: "assistant", text: fallback }]);
        return;
      }

      const tag = payload.agent ? `[${payload.agent}] ` : "";
      setMessages((prev) => [...prev, { role: "assistant", text: `${tag}${payload.reply}` }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "No hay conexion con el asistente en este momento." }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-20 right-4 z-50 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
        aria-label="Abrir asistente de Vytronix"
      >
        {open ? "Cerrar asistente" : "Asistente AI"}
      </button>

      {open ? (
        <section className="fixed bottom-36 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-2xl">
          <header className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Asistente Vytronix</h3>
            <p className="text-xs text-slate-600">Respuestas guiadas por agentes especializados.</p>
          </header>

          <div className="space-y-2 px-3 py-3 max-h-72 overflow-y-auto bg-slate-50">
            {messages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                    : "mr-8 rounded-lg bg-white px-3 py-2 text-sm text-slate-800 border border-slate-200"
                }
              >
                {message.text}
              </div>
            ))}
            {sending ? <div className="text-xs text-slate-500">Escribiendo...</div> : null}
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 p-3 space-y-2">
            <label className="text-xs font-medium text-slate-700" htmlFor="agent-choice">Agente</label>
            <select
              id="agent-choice"
              value={agent}
              onChange={(event) => setAgent(event.target.value as AgentChoice)}
              className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
            >
              {AGENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu consulta..."
              className="min-h-[80px] w-full resize-y rounded-md border border-slate-300 px-2 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
