import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes somos | Vytronix",
  description: "Conoce la misión, visión y valores de Vytronix y nuestra forma de trabajar para impulsar a pymes y startups con tecnología a medida.",
  alternates: { canonical: "/quienes-somos" },
  openGraph: {
    title: "Quiénes somos | Vytronix",
    description: "Misión, visión, valores y metodología de trabajo.",
    url: "/quienes-somos",
  },
};

export default function QuienesSomosPage() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid gap-12">
      {/* JSON-LD AboutPage */}
      <Script id="ld-json-about" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Quiénes somos | Vytronix",
            url: new URL("/quienes-somos", SITE_URL).toString(),
            description: "Misión, visión y valores de Vytronix.",
            isPartOf: { "@type": "WebSite", url: SITE_URL },
          }),
        }}
      />

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Quiénes somos</h1>
          <p className="mt-4 text-neutral-700">
            Impulsamos a pymes y startups con software a medida rápido, seguro y escalable, alineado a objetivos del negocio.
          </p>
        </div>
        <div className="p-6 rounded-2xl border bg-white shadow-sm">
          <ul className="grid gap-2 text-sm text-neutral-700">
            <li>• Entregas por etapas y plazos realistas</li>
            <li>• Comunicación directa y transparente</li>
            <li>• Seguridad, rendimiento y SEO desde el día uno</li>
          </ul>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="grid gap-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <h2 className="text-xl font-semibold">Misión</h2>
            <p className="mt-2 text-neutral-700">
              Impulsar la transformación digital con soluciones tecnológicas personalizadas, eficientes y sostenibles.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <h2 className="text-xl font-semibold">Visión</h2>
            <p className="mt-2 text-neutral-700">
              Ser el partner tecnológico de referencia en Chile y LATAM, reconocido por impacto medible y tiempos de entrega cortos.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border bg-white shadow-sm">
          <h2 className="text-xl font-semibold">Valores</h2>
          <ul className="mt-2 grid gap-2 text-neutral-700 text-sm">
            <li>
              <span className="font-medium">Innovación con propósito:</span> prototipamos en días y validamos con datos.
            </li>
            <li>
              <span className="font-medium">Colaboración:</span> sprints con feedback semanal y visibilidad total.
            </li>
            <li>
              <span className="font-medium">Ética y transparencia:</span> presupuestos claros, sin letra chica.
            </li>
            <li>
              <span className="font-medium">Sostenibilidad:</span> infraestructura optimizada y consumo responsable.
            </li>
            <li>
              <span className="font-medium">Excelencia técnica:</span> tests, seguridad y CI/CD desde el día uno.
            </li>
          </ul>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="p-6 rounded-2xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Por qué elegirnos</h2>
        <ul className="mt-2 grid gap-2 text-neutral-700 text-sm">
          <li>• Entregas iterativas con hitos y aceptación.</li>
          <li>• Precios por alcance, sin sorpresas.</li>
          <li>• Soporte post‑lanzamiento incluido.</li>
          <li>• Foco en accesibilidad, rendimiento y seguridad.</li>
          <li>• Comunicación directa por canal que prefieras.</li>
        </ul>
      </section>

      {/* Cómo trabajamos */}
      <section className="p-6 rounded-2xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Cómo trabajamos</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm text-neutral-700">
          <div className="p-4 rounded-xl border bg-neutral-50">
            <h3 className="font-medium">1. Descubrimiento</h3>
            <p className="mt-1">Objetivos, alcance y priorización. Definimos éxito y restricciones.</p>
          </div>
          <div className="p-4 rounded-xl border bg-neutral-50">
            <h3 className="font-medium">2. Prototipo</h3>
            <p className="mt-1">Demo navegable para validar dirección en días/semanas.</p>
          </div>
          <div className="p-4 rounded-xl border bg-neutral-50">
            <h3 className="font-medium">3. Desarrollo y entrega</h3>
            <p className="mt-1">Sprints con QA, seguridad y monitoreo. Soporte post‑lanzamiento.</p>
          </div>
        </div>
      </section>

      {/* Tecnologías y prácticas */}
      <section className="p-6 rounded-2xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Tecnologías y prácticas</h2>
        <p className="mt-2 text-neutral-700 text-sm">
          TypeScript, Next.js, React, Node.js, PostgreSQL, CI/CD, pruebas automatizadas, accesibilidad, SEO técnico y buenas prácticas de seguridad.
        </p>
      </section>

      {/* CTA final */}
      <section className="grid md:grid-cols-2 gap-4 items-center">
        <div className="text-neutral-700">
          <h2 className="text-xl font-semibold">¿Conversamos tu proyecto?</h2>
          <p className="mt-1 text-sm">Agenda una llamada o envíanos tu idea para una propuesta.</p>
        </div>
        <div className="flex gap-3 md:justify-end">
          <a href="/\#contacto" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Contactar</a>
          <a href="https://wa.me/56965658099?text=Hola,%20quiero%20hablar%20con%20Vytronix" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">WhatsApp</a>
        </div>
      </section>
    </div>
  );
}
