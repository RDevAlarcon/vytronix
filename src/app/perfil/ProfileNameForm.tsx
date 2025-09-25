"use client";
import { useState, useTransition } from "react";

type ProfileNameFormProps = {
  initialName?: string;
  initialPhone?: string;
  email: string;
};

const phoneRegex = /^[0-9+\-\s()]+$/;

export default function ProfileNameForm({ initialName, initialPhone, email }: ProfileNameFormProps) {
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [err, setErr] = useState("");
  const [saving, start] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const trimmedPhone = phone.trim();
    if (!phoneRegex.test(trimmedPhone) || trimmedPhone.length < 8 || trimmedPhone.length > 20) {
      setErr("Ingresa un teléfono válido (8 a 20 caracteres, solo números, +, -, espacios o paréntesis).");
      return;
    }

    start(async () => {
      const res = await fetch("/api/profile/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: trimmedPhone })
      });

      if (res.ok) {
        location.reload();
        return;
      }

      try {
        const data = (await res.json()) as { error?: string };
        setErr(data.error || "No se pudo guardar. Intenta nuevamente.");
      } catch {
        setErr("No se pudo guardar. Intenta nuevamente.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-sm">
          <div className="text-neutral-500">Nombre</div>
          <input
            className="mt-1 p-2 border rounded w-full"
            value={name}
            onChange={(e) => { setName(e.target.value); setErr(""); }}
            placeholder="Tu nombre"
            maxLength={80}
            required
            autoComplete="name"
          />
        </label>
        <label className="text-sm">
          <div className="text-neutral-500">Teléfono</div>
          <input
            className="mt-1 p-2 border rounded w-full"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErr(""); }}
            placeholder="+56 9 1234 5678"
            maxLength={20}
            required
            type="tel"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
        <label className="text-sm">
          <div className="text-neutral-500">Email</div>
          <input className="mt-1 p-2 border rounded w-full bg-neutral-50" value={email} readOnly />
        </label>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div>
        <button
          disabled={saving}
          className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-60"
          type="submit"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
