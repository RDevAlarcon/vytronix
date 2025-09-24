"use client";

import { useCallback, useState } from "react";

type LandingDiscountButtonProps = {
  fallbackUrl?: string;
};

export default function LandingDiscountButton({ fallbackUrl }: LandingDiscountButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo generar el checkout.");
      }

      const data = await res.json();
      const useSandbox = typeof window !== "undefined" && window.location.hostname === "localhost";
      const target: string | undefined = useSandbox
        ? data.sandbox_init_point || data.init_point || fallbackUrl
        : data.init_point || data.sandbox_init_point || fallbackUrl;

      if (!target) {
        throw new Error("No hay un enlace de pago disponible por el momento.");
      }

      if (useSandbox) {
        window.open(target, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = target;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(message);
      if (!fallbackUrl) {
        return;
      }
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }, [fallbackUrl]);

  return (
    <div className="grid gap-2 justify-items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60"
      >
        {loading ? "Generando checkout..." : "Canjear descuento"}
      </button>
      {error && <span className="text-xs text-red-600 text-right">{error}</span>}
    </div>
  );
}

