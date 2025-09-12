"use client";
import { useState } from "react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (res.ok) setSent(true);
    else if (res.status === 429) setErr("Demasiadas solicitudes. Intenta más tarde.");
    else setErr("No se pudo enviar el correo");
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
      {sent ? (
        <p className="text-sm text-neutral-700">Si el email existe, te enviamos un enlace de recuperación. Revisa tu bandeja.</p>
      ) : (
        <form onSubmit={submit} className="grid gap-3">
          <input className="border p-2 rounded" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white" type="submit">Enviar enlace</button>
        </form>
      )}
    </div>
  );
}

