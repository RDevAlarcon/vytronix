"use client";

import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128, "Máximo 128 caracteres"),
});

export default function AdminAccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError("Revisa email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        setError("Credenciales inválidas.");
        return;
      }

      const data = (await response.json()) as { role?: string };
      if (data.role !== "admin") {
        setError("Esta cuenta no tiene permisos de administración.");
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        return;
      }

      location.href = "/admin";
    } catch {
      setError("No se pudo iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell-section flex min-h-[calc(100vh-160px)] items-center justify-center py-16">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[var(--shadow-panel)] backdrop-blur-2xl md:grid-cols-[0.95fr_1.05fr]">
        <div className="dark-panel p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Acceso privado</p>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">Panel de administración Vytronix</h1>
          <p className="mt-4 text-sm leading-6 text-white/72">
            Ruta dedicada para gestionar solicitudes, pagos y acceso rápido a VyAudit.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/78">
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4">Solicitudes de contacto</div>
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4">Estados comerciales</div>
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4">Pagos y VyAudit</div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <p className="eyebrow">Autenticación</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Ingresa con una cuenta admin</h2>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">
              Email
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">
              Contraseña
              <span className="relative">
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 pr-12 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={128}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </span>
            </label>
            {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Validando..." : "Entrar al panel"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
