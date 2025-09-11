"use client";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Ingresa tu nombre").max(100, "MÃ¡ximo 100 caracteres"),
  email: z.string().email("Email invÃ¡lido"),
  phone: z
    .string()
    .min(7, "TelÃ©fono demasiado corto")
    .max(20, "MÃ¡ximo 20 caracteres")
    .regex(/^[+\d().\-\s]+$/i, "Formato de telÃ©fono invÃ¡lido"),
  message: z
    .string()
    .min(10, "CuÃ©ntanos un poco mÃ¡s (mÃ­n. 10 caracteres)")
    .max(1000, "MÃ¡ximo 1000 caracteres"),
});

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrs, setFieldErrs] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

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
    const parsed = schema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFieldErrs({ name: fe.name?.[0], email: fe.email?.[0], phone: fe.phone?.[0], message: fe.message?.[0] });
      return;
    }
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message })
    });
    if (res.ok) {
      setSent(true);
      setName(""); setEmail(""); setPhone(""); setMessage(""); setFieldErrs({});
    } else if (res.status === 429) {
      setErr("Demasiadas solicitudes. Intenta mÃ¡s tarde.");
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
        <p className="text-sm text-neutral-700 mt-2">Â¡Gracias! Te contactaremos pronto.</p>
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
            <input className="border p-2 rounded w-full" placeholder="TelÃ©fono" value={phone} onChange={(e)=>{ setPhone(e.target.value); if (fieldErrs.phone) validateField("phone", e.target.value); }} onBlur={(e)=> validateField("phone", e.target.value)} />
            {fieldErrs.phone && <p className="text-red-600 text-sm mt-1">{fieldErrs.phone}</p>}
          </div>
          <div>
            <textarea
              className="border p-2 rounded w-full h-28 resize-vertical"
              placeholder="CuÃ©ntanos quÃ© necesitas (alcance, plazos, presupuesto, etc.)"
              value={message}
              onChange={(e)=>{ setMessage(e.target.value); if (fieldErrs.message) validateField("message", e.target.value); }}
              onBlur={(e)=> validateField("message", e.target.value)}
            />
            {fieldErrs.message && <p className="text-red-600 text-sm mt-1">{fieldErrs.message}</p>}
          </div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white" type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}

