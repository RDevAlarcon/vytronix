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
});

export default function DigitalCardLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+56 ");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [fieldErrs, setFieldErrs] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErr("");
    setFieldErrs({});

    const parsed = schema.safeParse({ name, email, phone });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0] });
      return;
    }

    if (!acceptedPolicies) {
      setErr("Debes aceptar la Política de Privacidad y los Términos y Condiciones.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          acceptedPolicies,
          message: "Lead generado desde QR de tarjeta de presentación de Ricardo Alarcón.",
        }),
      });

      if (response.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setPhone("+56 ");
        setAcceptedPolicies(false);
      } else if (response.status === 429) {
        setErr("Demasiadas solicitudes. Intenta nuevamente más tarde.");
      } else {
        setErr("No se pudo enviar tu solicitud. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100";

  if (sent) {
    return (
      <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm font-black leading-6 text-emerald-800">
        Gracias. Tu solicitud quedó registrada y pronto te contactaré.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">Solicitud rápida</p>
      <div>
        <input className={inputClass} placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
        {fieldErrs.name && <p className="mt-1 text-xs font-bold text-red-600">{fieldErrs.name}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input className={inputClass} placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          {fieldErrs.email && <p className="mt-1 text-xs font-bold text-red-600">{fieldErrs.email}</p>}
        </div>
        <div>
          <input
            className={inputClass}
            placeholder="+56 9 1234 5678"
            value={phone}
            onChange={(event) => {
              const value = event.target.value;
              setPhone(value.startsWith("+56") ? value : `+56 ${value.replace(/^\+?56\s*/, "")}`);
            }}
          />
          {fieldErrs.phone && <p className="mt-1 text-xs font-bold text-red-600">{fieldErrs.phone}</p>}
        </div>
      </div>
      <label className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
        <input
          type="checkbox"
          checked={acceptedPolicies}
          onChange={(event) => setAcceptedPolicies(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
        />
        <span>
          Acepto la <Link href="/privacidad" className="font-black underline">Política de Privacidad</Link> y los{" "}
          <Link href="/terminos" className="font-black underline">Términos y Condiciones</Link>.
        </span>
      </label>
      {err && <p className="text-xs font-bold text-red-600">{err}</p>}
      <button type="submit" className="btn-primary min-h-12 justify-center" disabled={loading}>
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
