"use client";
import { useState, useTransition } from "react";

export default function CompleteButton({ id, status }: { id: string; status?: string }) {
  const [pending, start] = useTransition();
  const [local, setLocal] = useState(status);
  const disabled = pending || local === "ganado";

  async function complete() {
    start(async () => {
      try {
        const res = await fetch(`/api/requests/${id}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ganado" })
        });
        if (res.ok) {
          setLocal("ganado");
          location.reload();
        }
      } catch {}
    });
  }

  return (
    <button
      type="button"
      onClick={complete}
      disabled={disabled}
      className="px-3 py-1 rounded border bg-white hover:bg-neutral-50 disabled:opacity-60 text-sm"
    >
      {pending ? "Guardando..." : local === "ganado" ? "Completado" : "Completar"}
    </button>
  );
}

