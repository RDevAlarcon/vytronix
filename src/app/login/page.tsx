"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128, "Máximo 128 caracteres"),
});

const highlights = [
  "Acceso seguro para clientes y equipo.",
  "Seguimiento de solicitudes y estado del proyecto.",
  "Documentación, pagos y avances en un solo lugar.",
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrs, setFieldErrs] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function validateField(key: keyof typeof fieldErrs, value: string) {
    let result: string | undefined;
    if (key === "email") {
      const r = schema.shape.email.safeParse(value);
      result = r.success ? undefined : r.error.issues[0]?.message;
    } else if (key === "password") {
      const r = schema.shape.password.safeParse(value);
      result = r.success ? undefined : r.error.issues[0]?.message;
    }
    setFieldErrs((prev) => ({ ...prev, [key]: result }));
    return result;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setFieldErrs({});

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFieldErrs({ email: fe.email?.[0], password: fe.password?.[0] });
      setErr("Datos inválidos. Verifica email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        try {
          const data = await res.json();
          location.href = data?.role === "admin" ? "/dashboard" : "/perfil";
        } catch {
          location.href = "/perfil";
        }
      } else {
        setErr("Credenciales inválidas.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell-section py-14 md:py-20">
      <section className="surface-card section-dashboard overflow-hidden rounded-[2rem] p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_28px_80px_rgba(9,26,52,0.22)] md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.22),transparent_42%),radial-gradient(circle_at_70%_15%,rgba(96,165,250,0.38),transparent_30%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <p className="eyebrow text-cyan-200">Vytronix Access</p>
                <h1 className="mt-4 max-w-md text-4xl font-black leading-[0.95] md:text-6xl">
                  Ingresa a tu espacio digital.
                </h1>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                  Centraliza avances, solicitudes y próximos pasos con una experiencia pensada para operar sin fricción.
                </p>
              </div>

              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.85)]" />
                    <span className="text-sm font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[1.75rem] border border-white/80 bg-white/72 p-6 shadow-[0_20px_60px_rgba(9,26,52,0.10)] backdrop-blur-xl md:p-8">
              <p className="eyebrow">Acceso</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">Ingresar</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Usa tus credenciales para continuar al panel correspondiente.
              </p>

              <form onSubmit={submit} className="mt-7 grid gap-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className="h-14 w-full rounded-2xl border border-white/80 bg-white/78 px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                    placeholder="tu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrs.email) validateField("email", e.target.value);
                    }}
                    onBlur={(e) => validateField("email", e.target.value)}
                    required
                  />
                  {fieldErrs.email && <p className="mt-2 text-sm font-semibold text-red-600">{fieldErrs.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500" htmlFor="password">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className="h-14 w-full rounded-2xl border border-white/80 bg-white/78 px-4 pr-12 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                      placeholder="Mínimo 8 caracteres"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrs.password) validateField("password", e.target.value);
                      }}
                      onBlur={(e) => validateField("password", e.target.value)}
                      required
                      minLength={8}
                      maxLength={128}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {fieldErrs.password && <p className="mt-2 text-sm font-semibold text-red-600">{fieldErrs.password}</p>}
                </div>

                {err && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {err}
                  </p>
                )}

                <button className="btn-primary btn-hero min-h-14 w-full justify-center" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Entrar"}
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <div className="mt-5 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2">
                <Link className="rounded-2xl border border-white/80 bg-white/64 px-4 py-3 text-center transition hover:bg-white" href="/recuperar">
                  ¿Olvidaste tu contraseña?
                </Link>
                <Link className="rounded-2xl border border-white/80 bg-white/64 px-4 py-3 text-center transition hover:bg-white" href="/register">
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a3 3 0 104.24 4.24" />
      <path d="M9.88 4.24A10.94 10.94 0 0121 12c-.74 1.2-1.69 2.27-2.8 3.14" />
      <path d="M6.61 6.61A10.94 10.94 0 003 12a10.94 10.94 0 007.12 6.88 11.1 11.1 0 004.09.12" />
    </svg>
  );
}
