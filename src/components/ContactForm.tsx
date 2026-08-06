"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Ingresa tu nombre").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(7, "Teléfono demasiado corto")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[+\d().\-\s]+$/i, "Formato de teléfono inválido"),
  message: z
    .string()
    .min(10, "Cuéntanos un poco más (mín. 10 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
});

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrs, setFieldErrs] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [consentErr, setConsentErr] = useState<string | null>(null);

  function validateField(key: keyof typeof fieldErrs, value: string) {
    let result;
    if (key === "name") result = schema.shape.name.safeParse(value);
    if (key === "email") result = schema.shape.email.safeParse(value);
    if (key === "phone") result = schema.shape.phone.safeParse(value);
    if (key === "message") result = schema.shape.message.safeParse(value);
    const msg = result && !result.success ? result.error.issues[0]?.message : undefined;
    setFieldErrs((prev) => ({ ...prev, [key]: msg }));
    return msg;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setConsentErr(null);
    setSent(false);

    const parsed = schema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0], message: fe.message?.[0] });
      return;
    }

    if (!acceptedPolicies) {
      setConsentErr("Debes aceptar la Política de Privacidad y los Términos y Condiciones.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, acceptedPolicies }),
      });

      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setFieldErrs({});
        setAcceptedPolicies(false);
      } else if (res.status === 429) {
        setErr("Demasiadas solicitudes. Intenta nuevamente en unos minutos.");
      } else {
        try {
          const data = await res.json();
          const fe = data?.details?.fieldErrors || {};
          setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0], message: fe.message?.[0] });
        } catch {}
        setErr("No se pudo enviar tu solicitud. Intenta nuevamente.");
      }
    } catch {
      setErr("No se pudo enviar tu solicitud. Revisa tu conexión e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-white/80 bg-white/76 px-4 py-3 text-slate-950 outline-none shadow-[0_10px_24px_rgba(9,26,52,0.045)] transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <div className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Nueva solicitud</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">Solicita nuestros servicios</h3>
        </div>
        <span className="hidden rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-blue-800 shadow-sm sm:inline-flex">
          Brief express
        </span>
      </div>
      {sent ? (
        <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
          Gracias. Tu solicitud quedó registrada y pronto te contactaré.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div>
            <input className={inputClass} placeholder="Nombre" value={name} onChange={(e) => { setName(e.target.value); if (fieldErrs.name) validateField("name", e.target.value); }} onBlur={(e) => validateField("name", e.target.value)} />
            {fieldErrs.name && <p className="mt-1 text-sm text-red-600">{fieldErrs.name}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <input className={inputClass} placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (fieldErrs.email) validateField("email", e.target.value); }} onBlur={(e) => validateField("email", e.target.value)} />
              {fieldErrs.email && <p className="mt-1 text-sm text-red-600">{fieldErrs.email}</p>}
            </div>
            <div>
              <input className={inputClass} placeholder="Teléfono" value={phone} onChange={(e) => { setPhone(e.target.value); if (fieldErrs.phone) validateField("phone", e.target.value); }} onBlur={(e) => validateField("phone", e.target.value)} />
              {fieldErrs.phone && <p className="mt-1 text-sm text-red-600">{fieldErrs.phone}</p>}
            </div>
          </div>
          <div>
            <textarea
              className={`${inputClass} h-44 resize-y`}
              placeholder="Cuéntanos qué necesitas (alcance, plazos, presupuesto, etc.)"
              value={message}
              onChange={(e) => { setMessage(e.target.value); if (fieldErrs.message) validateField("message", e.target.value); }}
              onBlur={(e) => validateField("message", e.target.value)}
            />
            {fieldErrs.message && <p className="mt-1 text-sm text-red-600">{fieldErrs.message}</p>}
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 p-3">
            <div className="flex items-start gap-2">
              <input
                id="contact-consent"
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(event) => {
                  setAcceptedPolicies(event.target.checked);
                  if (consentErr && event.target.checked) setConsentErr(null);
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
                required
              />
              <label htmlFor="contact-consent" className="text-sm leading-6 text-slate-700">
                Acepto la <Link href="/privacidad" className="font-black underline">Política de Privacidad</Link> y los <Link href="/terminos" className="font-black underline">Términos y Condiciones</Link> de Vytronix.
              </label>
            </div>
          </div>
          {consentErr && <p className="text-sm font-bold text-red-600">{consentErr}</p>}
          {err && <p className="text-sm font-bold text-red-600">{err}</p>}
          <button className="btn-primary btn-hero min-h-14 w-full disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
          <div className="grid gap-2 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-3 text-xs font-black text-slate-700 sm:grid-cols-3 sm:text-center">
            <span>Respuesta en 24h</span>
            <span>Propuesta clara</span>
            <span>Sin compromiso</span>
          </div>
        </form>
      )}
    </div>
  );
}
