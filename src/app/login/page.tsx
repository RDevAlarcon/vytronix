"use client";
import { useState } from "react";
import { z } from "zod";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrs, setFieldErrs] = useState<{ email?: string; password?: string }>({});

  const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres").max(128, "Máximo 128 caracteres"),
  });

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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      try {
        const data = await res.json();
        if (data?.role === "admin") location.href = "/dashboard"; else location.href = "/perfil";
      } catch {
        location.href = "/perfil";
      }
    } else {
      setErr("Credenciales inválidas");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold mb-4">Ingresar</h1>
      <form onSubmit={submit} className="grid gap-3">
        <div>
          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e)=>{ setEmail(e.target.value); if (fieldErrs.email) validateField("email", e.target.value); }}
            onBlur={(e)=> validateField("email", e.target.value)}
            required
          />
          {fieldErrs.email && <p className="text-red-600 text-sm mt-1">{fieldErrs.email}</p>}
        </div>
        <div>
          <div className="relative">
            <input
              className="border p-2 pr-10 rounded w-full"
              placeholder="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e)=>{ setPassword(e.target.value); if (fieldErrs.password) validateField("password", e.target.value); }}
              onBlur={(e)=> validateField("password", e.target.value)}
              required
              minLength={8}
              maxLength={128}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              onClick={()=> setShowPassword(s=>!s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-600 hover:text-neutral-800"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a3 3 0 104.24 4.24" />
                  <path d="M9.88 4.24A10.94 10.94 0 0121 12c-.74 1.2-1.69 2.27-2.8 3.14" />
                  <path d="M6.61 6.61A10.94 10.94 0 003 12a10.94 10.94 0 007.12 6.88 11.1 11.1 0 004.09.12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrs.password && <p className="text-red-600 text-sm mt-1">{fieldErrs.password}</p>}
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white" type="submit">Entrar</button>
      </form>
      <div className="text-sm mt-3 flex justify-between">
        <a className="underline" href="/recuperar">¿Olvidaste tu contraseña?</a>
        <span>¿No tienes cuenta? <a className="underline" href="/register">Regístrate</a></span>
      </div>
    </div>
  );
}

