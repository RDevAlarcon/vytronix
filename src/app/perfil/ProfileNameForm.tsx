"use client";
import { useState, useTransition } from "react";

export default function ProfileNameForm({ initialName, email }: { initialName?: string; email: string }) {
  const [name, setName] = useState(initialName || "");
  const [err, setErr] = useState("");
  const [saving, start] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    start(async () => {
      const res = await fetch("/api/profile/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        // Cookie JWT se renueva en el backend; recargamos para reflejar cambios del lado del servidor
        location.reload();
      } else {
        setErr("No se pudo guardar. Intenta nuevamente.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm">
          <div className="text-neutral-500">Nombre</div>
          <input
            className="mt-1 p-2 border rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={80}
            required
          />
        </label>
        <label className="text-sm">
          <div className="text-neutral-500">Email</div>
          <input className="mt-1 p-2 border rounded w-full bg-neutral-50" value={email} readOnly />
        </label>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div>
        <button disabled={saving} className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-60" type="submit">
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
