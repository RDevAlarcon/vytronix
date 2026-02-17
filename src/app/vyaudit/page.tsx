"use client";

import { useState } from "react";

import VyauditPaymentBrick from "./VyauditPaymentBrick";

function normalizeDomainInput(value: string): string {
  return value.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
}

type InitResponse = {
  amount: number;
  domain: string;
  email: string;
  state: string;
  error?: string;
};

export default function VyAuditCheckoutPage() {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<InitResponse | null>(null);

  async function handlePreparePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanDomain = normalizeDomainInput(domain);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanDomain) {
      setError("Ingresa el dominio a auditar.");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Ingresa un correo valido para recibir el informe.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/vyaudit/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain, email: cleanEmail }),
      });

      const data = (await response.json()) as InitResponse;
      if (!response.ok || !data.state || !data.amount) {
        throw new Error(data.error || "No fue posible preparar el pago.");
      }

      setSession(data);
    } catch (caught) {
      setSession(null);
      setError(caught instanceof Error ? caught.message : "Error al preparar el pago.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-16 md:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">VyAudit</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Auditoria web profesional</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Paga y recibe un enlace unico para ejecutar una auditoria completa de tu sitio.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handlePreparePayment}>
          <div>
            <label htmlFor="domain" className="mb-1 block text-sm font-semibold text-slate-700">Dominio a auditar</label>
            <input
              id="domain"
              type="text"
              placeholder="ejemplo.cl"
              value={domain}
              onChange={(event) => {
                setDomain(event.target.value);
                setSession(null);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-300 transition focus:ring"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">Correo de respaldo</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSession(null);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-300 transition focus:ring"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl px-6 py-3 font-semibold transition bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:hover:bg-slate-300"
          >
            {loading ? "Preparando pago..." : "Continuar al pago"}
          </button>
        </form>

        {session ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm text-slate-600">
              Monto a pagar: <strong>${session.amount.toLocaleString("es-CL")} CLP</strong>
            </p>
            <VyauditPaymentBrick
              amount={session.amount}
              email={session.email}
              domain={session.domain}
              stateToken={session.state}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}