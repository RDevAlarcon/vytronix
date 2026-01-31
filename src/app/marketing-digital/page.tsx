import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketing digital | Vytronix",
  description: "Planes de marketing digital a medida: básico, medio y avanzado. Estrategia, contenidos y Ads para crecer.",
  alternates: { canonical: "/marketing-digital" },
  openGraph: {
    title: "Marketing digital | Vytronix",
    description: "Planes de marketing digital a medida para atraer tráfico, leads y ventas.",
    url: "/marketing-digital",
  },
};

const plans = [
  {
    id: "plan-basico",
    name: "Plan básico",
    summary: "Presencia digital mínima y generación de primeros leads.",
    image: {
      src: "/plan_basico.jpg",
      alt: "Plan básico marketing digital",
    },
    price: "CLP $300.000 + IVA / mes",
    billing: "Contrato mínimo 3 meses · Pago mensual por adelantado",
    sections: [
      {
        title: "Piezas incluidas",
        items: [
          "6 publicaciones feed (imagen o carrusel)",
          "2 stories estáticas",
          "Total: 8 piezas mensuales",
        ],
      },
      {
        title: "Incluye",
        items: [
          "Estrategia básica basada en diagnóstico",
          "Gestión de redes sociales",
          "Diseño gráfico alineado a la marca",
          "1 campaña Ads básica",
          "Reporte mensual",
        ],
      },
      {
        title: "Condiciones",
        items: [
          "Contrato mínimo 3 meses",
          "Pago mensual por adelantado",
          "Inversión publicitaria no incluida (campañas Ads pagadas directamente por el cliente a la plataforma)",
        ],
      },
    ],
  },
  {
    id: "plan-medio",
    name: "Plan medio",
    summary: "Generar tráfico calificado y leads recurrentes con estrategia sostenida.",
    image: {
      src: "/plan_medio.jpg",
      alt: "Plan medio marketing digital",
    },
    price: "CLP $400.000 + IVA / mes",
    billing: "Contrato mínimo 3 meses · Pago mensual por adelantado",
    sections: [
      {
        title: "Piezas incluidas",
        items: [
          "8 publicaciones feed (imagen o carrusel)",
          "4 stories (estáticas o animadas simples)",
          "Total: 12 piezas mensuales",
        ],
      },
      {
        title: "Incluye",
        items: [
          "Estrategia mensual personalizada",
          "Gestión profesional de redes sociales",
          "Diseño gráfico avanzado",
          "Gestión y optimización de campañas Ads",
          "Optimización continua basada en métricas",
          "Reporte mensual con indicadores clave",
        ],
      },
      {
        title: "Indicadores",
        items: ["Alcance, interacción, CTR y leads"],
      },
      {
        title: "Condiciones",
        items: [
          "Contrato mínimo 3 meses",
          "Pago mensual por adelantado",
          "Inversión publicitaria no incluida (campañas Ads pagadas directamente por el cliente a la plataforma)",
        ],
      },
    ],
  },
  {
    id: "plan-avanzado",
    name: "Plan avanzado",
    summary: "Escalar adquisición de clientes con estrategia digital integral.",
    image: {
      src: "/plan_enterprise.jpg",
      alt: "Plan avanzado marketing digital",
    },
    price: "CLP $500.000 + IVA / mes",
    billing: "Contrato mínimo 3 meses · Pago mensual por adelantado",
    sections: [
      {
        title: "Piezas incluidas",
        items: [
          "10 publicaciones feed (imagen o carrusel)",
          "6 stories",
          "Total: 16 piezas mensuales",
        ],
      },
      {
        title: "Incluye",
        items: [
          "Estrategia digital integral",
          "Gestión avanzada de redes sociales",
          "Diseño creativo y branding digital",
          "Gestión y optimización continua de Ads",
          "Análisis de audiencias y contenido",
          "Reporte estratégico con recomendaciones",
        ],
      },
      {
        title: "Indicadores",
        items: ["Leads, CPL y rendimiento de campañas"],
      },
      {
        title: "Condiciones",
        items: [
          "Contrato mínimo 3 meses",
          "Pago mensual por adelantado",
          "Inversión publicitaria no incluida (campañas Ads pagadas directamente por el cliente a la plataforma)",
        ],
      },
    ],
  },
];

export default function MarketingDigitalPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <section className="grid gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Marketing digital</h1>
        <p className="text-neutral-600 max-w-3xl">
          Planes a medida para posicionar tu marca, generar leads calificados y sostener resultados con estrategia y
          optimización continua.
        </p>
      </section>

      <section className="mt-10 grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 rounded-2xl border bg-white shadow-sm">
            <div className="mb-4 h-40 w-full overflow-hidden rounded-xl border bg-neutral-100">
              <Image
                src={plan.image.src}
                alt={plan.image.alt}
                width={800}
                height={400}
                className="h-40 w-full object-cover"
                priority={false}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-1 text-sm text-neutral-600">{plan.summary}</p>
              </div>
              <span className="text-xs rounded-full border px-3 py-1 text-neutral-600 self-start">
                {plan.price}
              </span>
            </div>
            <div className="mt-4 text-sm text-neutral-700">
              <p className="font-medium">Condiciones</p>
              <p className="text-neutral-600">{plan.billing}</p>
            </div>
            <div className="mt-6 flex">
              <a href={`#${plan.id}`} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                Ver detalle completo
              </a>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-8">
        {plans.map((plan) => (
          <article
            key={`${plan.name}-detail`}
            id={plan.id}
            className="rounded-2xl border bg-white p-6 shadow-sm scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <div className="text-sm text-neutral-600 sm:text-right">
                <div className="font-medium whitespace-nowrap">{plan.price}</div>
                <div className="text-neutral-500">{plan.billing}</div>
              </div>
            </div>
            <p className="mt-2 text-neutral-600">{plan.summary}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {plan.sections.map((section) => (
                <div key={`${plan.name}-${section.title}`}>
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5">
                    {section.items.map((item) => (
                      <li key={`${plan.name}-${section.title}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border bg-white p-6 shadow-sm grid gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Diagnóstico digital (servicio independiente)</h2>
            <p className="mt-1 text-sm text-neutral-600">CLP $120.000 + IVA · Pago único (no incluye ejecución)</p>
          </div>
        </div>
        <ul className="text-sm text-neutral-700 list-disc pl-5">
          <li>Análisis de redes sociales actuales</li>
          <li>Revisión de contenido, diseño y coherencia de marca</li>
          <li>Evaluación de presencia digital</li>
          <li>Detección de errores y oportunidades de mejora</li>
          <li>Recomendaciones estratégicas personalizadas</li>
        </ul>
        <p className="text-sm text-neutral-600">
          Este diagnóstico es requisito previo para contratar cualquier plan mensual.
        </p>
        <p className="text-sm text-neutral-600">Contrato mínimo 3 meses · Pago mensual por adelantado</p>
      </section>

      <section className="mt-12 rounded-2xl border bg-white p-6 shadow-sm grid md:grid-cols-[1fr_auto] gap-4 items-center">
        <div>
          <h2 className="text-xl font-semibold">¿Listo para escalar tu marketing?</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Te ayudamos a elegir el plan correcto y definir la estrategia según tu presupuesto.
          </p>
        </div>
        <div className="flex gap-3 md:justify-end">
          <Link
            href="/#contacto"
            className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
          >
            Solicitar propuesta
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
