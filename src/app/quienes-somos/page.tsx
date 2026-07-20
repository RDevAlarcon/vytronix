import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Quiénes somos | Vytronix",
  description:
    "Conoce la misión, visión y forma de trabajo de Vytronix para impulsar pymes y startups con tecnología a medida.",
  alternates: { canonical: "/quienes-somos" },
  openGraph: {
    title: "Quiénes somos | Vytronix",
    description: "Misión, visión, valores y metodología de trabajo.",
    url: "/quienes-somos",
  },
};

const principles = [
  { title: "Entrega clara", copy: "Alcance definido, hitos visibles y decisiones documentadas desde el inicio." },
  { title: "Producto operable", copy: "Construimos pensando en rendimiento, seguridad, soporte y crecimiento real." },
  { title: "Comunicación directa", copy: "Avances frecuentes, feedback accionable y cero dependencia de procesos confusos." },
];

const values = [
  ["Innovación con propósito", "Prototipos rápidos, decisiones validadas y foco en utilidad real."],
  ["Transparencia comercial", "Alcance, costos y prioridades siempre claros para ambas partes."],
  ["Calidad técnica", "Código mantenible, revisiones y despliegues preparados para crecer."],
  ["Seguridad desde el diseño", "Buenas prácticas aplicadas desde arquitectura hasta producción."],
  ["Soporte posterior", "Acompañamiento para resolver ajustes, dudas y nuevas prioridades."],
  ["Mejora continua", "Medición, aprendizaje y evolución del producto después del lanzamiento."],
];

const commitments = [
  ["Presupuesto claro", "Precio por alcance y entregables, sin sorpresas."],
  ["Demo temprana", "Avances navegables antes de comprometer nuevas fases."],
  ["Seguridad y rendimiento", "Buenas prácticas desde el primer día."],
  ["Soporte", "Acompañamiento post-lanzamiento incluido."],
];

const workflow = [
  ["01", "Descubrimiento", "Objetivos, alcance, prioridades y restricciones para partir con foco."],
  ["02", "Diseño funcional", "Flujos, interfaz y experiencia responsive antes de construir."],
  ["03", "Desarrollo", "Implementación iterativa con QA, seguridad y revisiones de avance."],
  ["04", "Entrega", "Producción, documentación y soporte para que el equipo pueda operar."],
];

const faqs = [
  ["¿Cuánto se demora un proyecto?", "Depende del alcance. Trabajamos por etapas y definimos plazos realistas al inicio."],
  ["¿Cómo se estructura el pago?", "Por hitos acordados y entregables claros. Sin sorpresas."],
  ["¿El código es mío?", "Sí. Entregamos repositorio y documentación al finalizar."],
];

export default function QuienesSomosPage() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

  return (
    <div className="shell-section grid gap-12 pt-12 pb-20">
      <Script
        id="ld-json-about"
        type="application/ld+json"
        strategy="afterInteractive"
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

      <section className="surface-card section-dashboard overflow-hidden rounded-[2rem] p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">Quiénes somos</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] text-slate-950 md:text-6xl">
              Tecnología clara para empresas que necesitan avanzar.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
              Somos un equipo de desarrollo que convierte ideas, procesos y necesidades comerciales en software útil,
              medible y preparado para crecer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#contacto" className="btn-primary btn-hero">
                Cotizar proyecto
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/proyectos"
                className="rounded-full border border-slate-200 bg-white/72 px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                Ver proyectos
              </Link>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-[1.75rem] border border-cyan-200/70 bg-slate-950 p-5 text-white shadow-[0_28px_80px_rgba(9,26,52,0.22)]">
              <div className="grid gap-4">
                {principles.map((item, index) => (
                  <div key={item.title} className="rounded-3xl border border-white/12 bg-white/8 p-5 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-xl font-black">{item.title}</h2>
                      <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Reveal className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
          <p className="eyebrow">Misión</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">Crear tecnología útil, clara y sostenible.</h2>
          <p className="mt-5 text-sm leading-7 text-slate-700">
            Impulsar la transformación digital con soluciones tecnológicas personalizadas, eficientes y sostenibles,
            alineadas a los objetivos reales de cada negocio.
          </p>
        </Reveal>

        <Reveal delayMs={100} className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
          <p className="eyebrow">Visión</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">Ser un partner tecnológico de referencia.</h2>
          <p className="mt-5 text-sm leading-7 text-slate-700">
            Consolidarnos en Chile y LATAM por impacto medible, tiempos de entrega competitivos y productos digitales
            que las empresas puedan operar, escalar y mejorar.
          </p>
        </Reveal>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
          <p className="eyebrow">Enfoque</p>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Priorizamos velocidad, estabilidad y claridad. Cada entrega debe poder probarse, medirse y evolucionar sin depender de trucos frágiles.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Iteraciones con hitos y aprobación en cada fase.",
              "Precio cerrado por alcance. Sin sorpresas.",
              "Soporte post-lanzamiento incluido.",
              "Accesibilidad, rendimiento y seguridad.",
              "Hablamos por tu canal favorito y respondemos rápido.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/74 p-4 text-sm font-bold leading-6 text-slate-700 shadow-sm">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)] shadow-[0_0_16px_rgba(0,118,255,0.65)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={100} className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
          <p className="eyebrow">Valores</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {values.map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/80 bg-white/72 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_18px_rgba(0,118,255,0.65)]" />
                  <span className="text-sm font-black text-slate-900">{title}</span>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-cyan-200/70 bg-cyan-50/70 p-5">
            <p className="text-sm font-black leading-6 text-slate-800">
              Estos principios guían cada decisión técnica, comercial y de soporte para que el producto sea útil desde el primer día.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">Cómo trabajamos</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">De la idea a producción con hitos claros.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Avanzas con entregables visibles, control de alcance y próximos pasos definidos en cada fase.
            </p>
          </Reveal>
          <div className="grid gap-4">
            {workflow.map(([step, title, copy]) => (
              <Reveal key={step} className="rounded-3xl border border-white/80 bg-white/74 p-5 shadow-sm">
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-black text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
          <p className="eyebrow">Garantías</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">Compromisos concretos.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {commitments.map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/80 bg-white/72 p-5 shadow-sm">
                <h3 className="font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={100} className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_28px_70px_rgba(9,26,52,0.20)] md:p-8">
          <p className="eyebrow text-cyan-200">Tecnologías y prácticas</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">Stack moderno, operación simple.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Usamos herramientas modernas, pruebas automáticas, revisiones de calidad, SEO técnico, accesibilidad y despliegues controlados para reducir riesgo.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Next.js", "APIs", "QA", "SEO", "Seguridad", "Analytics"].map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
        <p className="eyebrow">Preguntas frecuentes</p>
        <div className="mt-5 grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-3xl border border-white/80 bg-white/74 p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-black text-slate-950">
                {question}
                <span className="float-right text-[var(--color-primary)] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-700">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_28px_80px_rgba(9,26,52,0.22)] md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow text-cyan-200">Nuevo proyecto</p>
            <h2 className="mt-3 text-3xl font-black">¿Conversemos tu proyecto?</h2>
            <p className="mt-2 text-sm text-slate-300">Agenda una llamada o envíanos tu idea para cotizar hoy.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#contacto" className="btn-primary">
              Contactar
            </Link>
            <a
              href="https://wa.me/56921657978?text=Hola,%20quiero%20hablar%20con%20Vytronix"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/18"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
