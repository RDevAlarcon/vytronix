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
    .max(20, "Maximo 20 caracteres")
    .regex(/^[+\d().\-\s]+$/i, "Formato de teléfono inválido"),
  message: z
    .string()
    .min(10, "Cuentanos un poco más (mín. 10 caracteres)")
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
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [consentErr, setConsentErr] = useState<string | null>(null);

  function validateField(key: keyof typeof fieldErrs, value: string) {
    let r;
    if (key === "name") r = schema.shape.name.safeParse(value);
    if (key === "email") r = schema.shape.email.safeParse(value);
    if (key === "phone") r = schema.shape.phone.safeParse(value);
    if (key === "message") r = schema.shape.message.safeParse(value);
    const msg = r && !r.success ? r.error.issues[0]?.message : undefined;
    setFieldErrs((p) => ({ ...p, [key]: msg }));
    return msg;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setConsentErr(null);

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
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message, acceptedPolicies })
    });
    if (res.ok) {
      setSent(true);
      setName(""); setEmail(""); setPhone(""); setMessage(""); setFieldErrs({}); setAcceptedPolicies(false);
    } else if (res.status === 429) {
      setErr("Demasiadas solicitudes. Intenta más tarde.");
    } else {
      try {
        const data = await res.json();
        const fe = data?.details?.fieldErrors || {};
        setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0], message: fe.message?.[0] });
      } catch {}
      setErr("No se pudo enviar tu solicitud");
    }
  }

  return (
    <div className="p-6 rounded-2xl border bg-white shadow-sm">
      <h3 className="font-semibold text-lg">Solicita nuestros servicios</h3>
      {sent ? (
        <p className="text-sm text-neutral-700 mt-2">¡Gracias! Te contactaremos pronto.</p>
      ) : (
        <form onSubmit={submit} className="grid gap-3 mt-3">
          <div>
            <input className="border p-2 rounded w-full" placeholder="Nombre" value={name} onChange={(e)=>{ setName(e.target.value); if (fieldErrs.name) validateField("name", e.target.value); }} onBlur={(e)=> validateField("name", e.target.value)} />
            {fieldErrs.name && <p className="text-red-600 text-sm mt-1">{fieldErrs.name}</p>}
          </div>
          <div>
            <input className="border p-2 rounded w-full" placeholder="Email" type="email" value={email} onChange={(e)=>{ setEmail(e.target.value); if (fieldErrs.email) validateField("email", e.target.value); }} onBlur={(e)=> validateField("email", e.target.value)} />
            {fieldErrs.email && <p className="text-red-600 text-sm mt-1">{fieldErrs.email}</p>}
          </div>
          <div>
            <input className="border p-2 rounded w-full" placeholder="Teléfono" value={phone} onChange={(e)=>{ setPhone(e.target.value); if (fieldErrs.phone) validateField("phone", e.target.value); }} onBlur={(e)=> validateField("phone", e.target.value)} />
            {fieldErrs.phone && <p className="text-red-600 text-sm mt-1">{fieldErrs.phone}</p>}
          </div>
          <div>
            <textarea
              className="border p-2 rounded w-full h-28 resize-vertical"
              placeholder="Cuéntanos que necesitas (alcance, plazos, presupuesto, etc.)"
              value={message}
              onChange={(e)=>{ setMessage(e.target.value); if (fieldErrs.message) validateField("message", e.target.value); }}
              onBlur={(e)=> validateField("message", e.target.value)}
            />
            {fieldErrs.message && <p className="text-red-600 text-sm mt-1">{fieldErrs.message}</p>}
          </div>
          <div className="flex items-start gap-2">
            <input
              id="contact-consent"
              type="checkbox"
              checked={acceptedPolicies}
              onChange={(event) => {
                setAcceptedPolicies(event.target.checked);
                if (consentErr && event.target.checked) {
                  setConsentErr(null);
                }
              }}
              className="mt-1"
              required
            />
            <label htmlFor="contact-consent" className="text-sm text-neutral-700">
              Acepto la <Link href="/privacidad" className="underline">Política de Privacidad</Link> y los <Link href="/terminos" className="underline">Términos y Condiciones</Link> de Vytronix.
            </label>
          </div>
          {consentErr && <p className="text-red-600 text-sm">{consentErr}</p>}
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white" type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}
