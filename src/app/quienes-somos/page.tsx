import Script from "next/script";
import Link from "next/link";
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
          <h2 className="text-xl font-semibold">Lo que entregamos</h2>
          <ul className="grid gap-2 text-sm text-neutral-700">
            <li>• Entregas por etapas, plazos que se cumplen.</li>
            <li>• Comunicación directa y transparente.</li>
            <li>• Seguridad, performance y SEO desde el día uno</li>
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
              Ser el partner tecnológico de referencia en Chile y LATAM, reconocido por impacto medible y tiempos de entrega competitivos.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border bg-white shadow-sm">
          <h2 className="text-xl font-semibold">Valores</h2>
          <ul className="mt-2 grid gap-2 text-neutral-700 text-sm">
            <li>
              <span className="font-medium">Innovación con propósito:</span> prototipos rápidos validados con datos.
            </li>
            <li>
              <span className="font-medium">Colaboración real:</span> sprints con feedback semanal y visibilidad total.
            </li>
            <li>
              <span className="font-medium">Transparencia:</span> presupuestos claros, cero letra chica.
            </li>
            <li>
              <span className="font-medium">Sostenibilidad:</span> infraestructura optimizada y consumo responsable.
            </li>
            <li>
              <span className="font-medium">Calidad técnica:</span> tests automáticos, proteccion de datos y despliegues seguros desde el primer día.
            </li>
          </ul>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="p-6 rounded-2xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Por qué elegirnos</h2>
        <ul className="mt-2 grid gap-2 text-neutral-700 text-sm">
          <li>• Iteraciones con hitos y aprobación en cada fase.</li>
          <li>• Precio cerrado por alcance. Sin sorpresas.</li>
          <li>• Soporte post‑lanzamiento incluido.</li>
          <li>• Accesibilidad, rendimiento y seguridad.</li>
          <li>• Hablamos por tu canal favorito y respondemos rápido.</li>
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
            <h3 className="font-medium">2. Desarrollo</h3>
            <p className="mt-1">Construcción iterativa con QA, seguridad y revisiones de avance.</p>
          </div>
          <div className="p-4 rounded-xl border bg-neutral-50">
            <h3 className="font-medium">3. Entrega</h3>
            <p className="mt-1">Puesta en producción, documentación y soporte post‑lanzamiento.</p>
          </div>
        </div>
      </section>

      {/* Tecnologías y prácticas */}
      <section className="p-6 rounded-2xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Tecnologías y prácticas</h2>
        <p className="mt-2 text-neutral-700 text-sm">
          Usamos herramientas modernas y seguras para construir sitios y aplicaciones confiables y rápidos.
          Trabajamos con pruebas automáticas, revisiones de calidad y despliegues controlados para evitar errores.
          Cuidamos la accesibilidad, el posicionamiento en buscadores (SEO) y la seguridad de tu información.
        </p>
      </section>

      {/* CTA final */}
      <section className="grid md:grid-cols-2 gap-4 items-center">
        <div className="text-neutral-700">
          <h2 className="text-xl font-semibold">¿Conversemos tu proyecto?</h2>
          <p className="mt-1 text-sm">Agenda una llamada o envíanos tu idea para cotizar hoy.</p>
        </div>
        <div className="flex gap-3 md:justify-end">
          <Link href="/#contacto" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Contactar</Link>
          <a href="https://wa.me/56965658099?text=Hola,%20quiero%20hablar%20con%20Vytronix" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">WhatsApp</a>
        </div>
      </section>
    </div>
  );
}
