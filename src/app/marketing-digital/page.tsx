import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketing digital | Vytronix",
  description: "Planes de marketing digital a medida: básico, medio y enterprise. Estrategia, contenidos y Ads para crecer.",
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
    price: "CLP $300.000 + IVA",
    ads: "CLP $60.000 - $120.000 (pagado directamente por el cliente)",
    sections: [
      {
        title: "Alcance del servicio",
        items: [
          "Estrategia básica inicial",
          "Gestión de perfiles sociales",
          "8 publicaciones mensuales",
          "Diseño gráfico simple alineado a marca Empresa",
          "1 campaña Ads básica",
          "Reporte mensual",
        ],
      },
      {
        title: "Condiciones",
        items: [
          "Contrato mínimo 3 meses",
          "Pago 100% anticipado",
          "Ads no incluidos en el fee",
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
    price: "CLP $550.000 + IVA",
    ads: "CLP $150.000 - $300.000 (pagado directamente por el cliente)",
    sections: [
      {
        title: "Alcance del servicio",
        items: [
          "Estrategia mensual basada en datos",
          "Gestión profesional de redes sociales (12 piezas)",
          "Diseño gráfico avanzado alineado a marca",
          "Gestión y optimización de 2 campañas Ads",
          "Landing page orientada a conversión",
          "Reporte mensual",
        ],
      },
      {
        title: "Indicadores y enfoque",
        items: [
          "CTR, CPC y CPL como métricas de referencia",
          "Optimización continua basada en rendimiento",
        ],
      },
      {
        title: "Forma de pago",
        items: ["Pago 100% por adelantado al inicio de cada mes"],
      },
      {
        title: "Consideraciones importantes",
        items: [
          "El fee no incluye inversión publicitaria",
          "No se garantizan resultados específicos, ventas o métricas exactas",
          "El rendimiento depende del mercado, producto, presupuesto y respuesta del público",
          "Las optimizaciones se realizan en base a datos y mejores prácticas",
        ],
      },
    ],
  },
  {
    id: "plan-enterprise",
    name: "Plan enterprise",
    summary: "Escalar adquisición de clientes con campañas multicanal y automatización avanzada.",
    image: {
      src: "/plan_enterprise.jpg",
      alt: "Plan enterprise marketing digital",
    },
    price: "CLP $1.500.000 + IVA",
    ads: "Desde CLP $500.000 (pagado directamente por el cliente)",
    sections: [
      {
        title: "Alcance del servicio",
        items: [
          "Estrategia multicanal integral",
          "Producción de contenido profesional (16 piezas)",
          "Gestión avanzada y optimización continua de Ads",
          "Diseño e implementación de embudos completos",
          "Integración CRM",
          "A/B testing y mejora continua",
          "Dashboard y reportes quincenales",
        ],
      },
      {
        title: "Indicadores y enfoque",
        items: [
          "CPA, ROAS y tasa de conversión",
          "Optimización por cohortes y audiencias",
        ],
      },
      {
        title: "Forma de pago",
        items: ["Pago 100% por adelantado al inicio de cada mes"],
      },
      {
        title: "Consideraciones importantes",
        items: [
          "El fee no incluye inversión publicitaria",
          "No se garantizan resultados específicos, ventas o métricas exactas",
          "El rendimiento depende del mercado, producto, presupuesto y respuesta del público",
          "Las optimizaciones se realizan en base a datos y mejores prácticas",
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
              <p className="font-medium">Presupuesto Ads</p>
              <p className="text-neutral-600">{plan.ads}</p>
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
                <div className="text-neutral-500">{plan.ads}</div>
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
