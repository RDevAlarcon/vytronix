"use client";
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

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrs, setFieldErrs] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  function validateField(key: keyof typeof fieldErrs, value: string) {
    let r;
    if (key === "name") r = schema.shape.name.safeParse(value);
    if (key === "email") r = schema.shape.email.safeParse(value);
    if (key === "phone") r = schema.shape.phone.safeParse(value);
    const msg = r && !r.success ? r.error.issues[0]?.message : undefined;
    setFieldErrs((p) => ({ ...p, [key]: msg }));
    return msg;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const parsed = schema.safeParse({ name, email, phone });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0] });
      return;
    }
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone })
    });
    if (res.ok) {
      setSent(true);
      setName(""); setEmail(""); setPhone(""); setFieldErrs({});
    } else if (res.status === 429) {
      setErr("Demasiadas solicitudes. Intenta más tarde.");
    } else {
      try {
        const data = await res.json();
        const fe = data?.details?.fieldErrors || {};
        setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0] });
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
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white" type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}
