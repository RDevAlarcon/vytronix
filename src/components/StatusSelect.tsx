"use client";
import { useState, useTransition } from "react";

export type Status = "nuevo" | "en_proceso" | "ganado" | "perdido";

type Props = {
  id: string;
  value?: string;
};

const LABELS: Record<Status, string> = {
  nuevo: "Nuevo",
  en_proceso: "En proceso",
  ganado: "Ganado",
  perdido: "Perdido",
};

export default function StatusSelect({ id, value }: Props) {
  const toStatus = (s?: string): Status =>
    s === "en_proceso" || s === "ganado" || s === "perdido" || s === "nuevo" ? (s as Status) : "nuevo";

  const [val, setVal] = useState<Status>(toStatus(value));
  const [saving, start] = useTransition();

  const cls = (s: Status) => {
    switch (s) {
      case "en_proceso":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "ganado":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "perdido":
        return "bg-rose-50 text-rose-700 border-rose-300";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-300";
    }
  };

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Status;
    setVal(next);
    start(async () => {
      await fetch(`/api/requests/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      }).catch(() => {});
    });
  }

  return (
    <select
      className={`border p-1 rounded text-sm disabled:opacity-60 ${cls(val)}`}
      value={val}
      onChange={onChange}
      disabled={saving}
    >
      {Object.entries(LABELS).map(([k, label]) => (
        <option key={k} value={k}>{label}</option>
      ))}
    </select>
  );
}
