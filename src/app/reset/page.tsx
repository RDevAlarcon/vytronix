"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPage() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (password !== confirm) {
      setErr("Las contraseñas no coinciden");
      return;
    }
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    if (res.ok) setDone(true); else setErr("Enlace inválido o expirado");
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
      {done ? (
        <div className="grid gap-2">
          <p className="text-sm text-neutral-700">Contraseña actualizada correctamente.</p>
          <a href="/login" className="underline">Ir a iniciar sesión</a>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-3">
          <div className="relative">
            <input
              className="border p-2 pr-10 rounded w-full"
              placeholder="Nueva contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              minLength={8}
              maxLength={128}
              required
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

          <div className="relative">
            <input
              className="border p-2 pr-10 rounded w-full"
              placeholder="Confirmar contraseña"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={e=>setConfirm(e.target.value)}
              minLength={8}
              maxLength={128}
              required
            />
            <button
              type="button"
              aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showConfirm}
              onClick={()=> setShowConfirm(s=>!s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-600 hover:text-neutral-800"
            >
              {showConfirm ? (
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

          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white" type="submit">Restablecer</button>
        </form>
      )}
    </div>
  );
}
