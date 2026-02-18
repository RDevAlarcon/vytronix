import Link from "next/link";

export default function VyauditDemoPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12 md:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">Muestra de informe</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">VyAudit | Extracto ejecutivo</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Este es un ejemplo real del formato final que recibe el cliente luego de pagar una auditoria.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Score total</p>
            <p className="mt-2 text-3xl font-black text-slate-900">83/100</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Performance</p>
            <p className="mt-2 text-3xl font-black text-emerald-600">98</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">SEO tecnico</p>
            <p className="mt-2 text-3xl font-black text-blue-700">85</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Seguridad</p>
            <p className="mt-2 text-3xl font-black text-amber-600">64</p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900">Resumen ejecutivo (extracto)</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Problema critico: faltan headers de seguridad recomendados.</li>
            <li>Oportunidad: configurar CSP, HSTS, X-Frame-Options y Referrer-Policy.</li>
            <li>Impacto: mejora de confianza, conversion y visibilidad organica.</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900">Quick wins</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="px-3 py-2">Accion</th>
                  <th className="px-3 py-2">Impacto</th>
                  <th className="px-3 py-2">Esfuerzo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="px-3 py-2">Implementar headers de seguridad base</td>
                  <td className="px-3 py-2">Alto</td>
                  <td className="px-3 py-2">Medio</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-3 py-2">Corregir canonical y robots</td>
                  <td className="px-3 py-2">Medio</td>
                  <td className="px-3 py-2">Bajo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/vyaudit"
            className="rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            Solicitar VyAudit
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[var(--color-primary)] px-5 py-3 font-semibold text-[var(--color-primary)] hover:bg-slate-50"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}