import ContactForm from "@/components/ContactForm";
import ServicesCarousel from "@/components/ServicesCarousel";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soluciones web y móviles a tu medida",
  description: "Desarrollo de sitios web, apps móviles, integraciones y auditoría web para crecer con tecnología moderna.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Soluciones web y móviles a tu medida",
    description: "Sitios rápidos, seguros y escalables con tecnologías modernas.",
    url: "/",
  },
};

const VYAUDIT_CHECKOUT_URL = "/vyaudit";
const VYAUDIT_DEMO_URL = "/vyaudit/demo";

const metrics = [
  { title: "Entrega rápida", detail: "Primera versión en 10 días hábiles.", icon: "M4 12h16M12 4v16" },
  { title: "Operación activa", detail: "Automatizaciones y canales conectados 24/7.", icon: "M12 6v6l4 2" },
  { title: "Mejora medible", detail: "Auditoría en rendimiento, SEO, UX y seguridad.", icon: "M5 13l4 4L19 7" },
];

const stackGroups = [
  { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "UI responsive"] },
  { label: "Backend", items: ["Node.js", "PostgreSQL", "Drizzle ORM", "APIs REST", "Automatizaciones"] },
  { label: "Integraciones", items: ["Pagos digitales", "JWT Auth", "Resend", "Nodemailer", "CRM"] },
  { label: "Infra & growth", items: ["Vercel", "AWS", "Docker", "SEO técnico", "Analytics", "Monitoreo"] },
  { label: "Mobile", items: ["Flutter", "Firebase", "Supabase", "Push notifications"] },
];

const processSteps = [
  {
    title: "Descubrimiento y alcance",
    desc: "Objetivos, restricciones, prioridades y propuesta técnica para evitar ambigüedades.",
    tag: "Brief técnico",
  },
  {
    title: "Diseño funcional y prototipo",
    desc: "Flujo principal, estructura visual y experiencia responsive antes de construir.",
    tag: "Vista navegable",
  },
  {
    title: "Desarrollo, QA y lanzamiento",
    desc: "Implementación, pruebas, seguridad y puesta en producción con checklist claro.",
    tag: "Deploy controlado",
  },
  {
    title: "Evolución",
    desc: "Medición, mejoras, soporte posterior y nuevas prioridades según resultados.",
    tag: "Mejora continua",
  },
];


export default function Home() {
  return (
    <>
      <section className="shell-section pt-10 md:pt-16">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/64 p-5 shadow-[var(--shadow-panel)] backdrop-blur-2xl md:grid-cols-[1.02fr_0.98fr] md:p-8 lg:p-10">
          <div className="flex flex-col justify-center py-4">
            <p className="eyebrow">Vytronix · Software para crecer</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-slate-950 md:text-5xl lg:text-6xl">
              Desarrollamos tecnología para hacer crecer tu empresa.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650 text-slate-700">
              Desarrollamos aplicaciones web, móviles e integraciones que ayudan a las empresas a crecer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#contacto" className="btn-primary btn-hero">
                Cotizar proyecto
              </Link>
              <Link href={VYAUDIT_CHECKOUT_URL} className="btn-secondary">
                Solicitar VyAudit
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.title} className="metric-tile p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="max-w-[8rem] text-base font-black leading-5 tracking-tight text-slate-950">{metric.title}</div>
                    <span className="metric-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d={metric.icon} />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-3 text-xs font-bold leading-5 text-slate-600">{metric.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[1.65rem] bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(20,120,255,0.46),transparent_18rem),radial-gradient(circle_at_76%_30%,rgba(34,211,238,0.30),transparent_20rem),linear-gradient(135deg,#07111f_0%,#0a2344_52%,#020817_100%)]" />
            <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="hero-scan absolute left-0 right-0 top-0 h-28 bg-gradient-to-b from-cyan-300/0 via-cyan-200/18 to-cyan-300/0" />
            <div className="absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/16 bg-cyan-300/5 shadow-[0_0_90px_rgba(34,211,238,0.24)]" />
            <div className="hero-orbit left-[18%] top-[12%] h-72 w-72">
              <span className="hero-pulse absolute left-8 top-2 h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(103,232,249,0.9)]" />
              <span className="absolute bottom-10 right-4 h-2 w-2 rounded-full bg-blue-300" />
            </div>
            <div className="hero-orbit right-[8%] top-[4%] h-80 w-80">
              <span className="hero-pulse absolute right-12 top-8 h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_28px_rgba(96,165,250,0.95)]" />
            </div>
            <div className="absolute left-[16%] top-[34%] hidden h-px w-[68%] rotate-[-12deg] bg-gradient-to-r from-transparent via-cyan-200/42 to-transparent sm:block" />
            <div className="absolute left-[20%] top-[49%] hidden h-px w-[58%] rotate-[17deg] bg-gradient-to-r from-transparent via-blue-200/34 to-transparent sm:block" />
            <div className="absolute left-1/2 top-[37%] w-[78%] -translate-x-1/2 rounded-[2rem] border border-white/12 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-md sm:w-[72%]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-cyan-100/70">Vytronix OS</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">Digital Core</p>
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.38)]">
                  AI
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Web", "Mobile", "APIs"].map((item) => (
                  <span key={item} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center text-xs font-black text-white/82">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/16 bg-white/12 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-md">
                Live stack
              </span>
              <span className="rounded-full bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 shadow-lg shadow-cyan-950/20">
                2026-ready
              </span>
            </div>

            <div className="absolute left-5 top-20 w-[11rem] rounded-3xl border border-white/16 bg-slate-950/42 p-4 text-white shadow-2xl backdrop-blur-xl">
              <p className="text-[0.64rem] font-black uppercase tracking-[0.18em] text-white/54">Deploy health</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-4xl font-black">98</span>
                <span className="mb-1 rounded-full bg-emerald-300 px-2 py-1 text-[0.62rem] font-black text-slate-950">stable</span>
              </div>
              <div className="mt-4 grid gap-2">
                {[88, 96, 78].map((score, index) => (
                  <div key={score} className="h-1.5 overflow-hidden rounded-full bg-white/12">
                    <div className={index === 2 ? "h-full rounded-full bg-cyan-300" : "h-full rounded-full bg-white"} style={{ width: `${score}%` }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-[1.55rem] border border-white/18 bg-white/12 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-5">
              <div className="grid gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Stack moderno</p>
                  <p className="mt-1 text-2xl font-black md:text-3xl">Web · Mobile · APIs</p>
                  <p className="mt-2 max-w-md text-xs leading-5 text-white/62">Arquitectura, interfaz y automatización conectadas para operar sin fricción.</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[0.6rem] font-black uppercase tracking-[0.04em] text-white/82 sm:text-[0.65rem]">
                  {["SEO", "UX", "Seguridad"].map((item) => (
                    <span key={item} className="min-w-0 rounded-2xl border border-white/12 bg-white/12 px-2 py-3 leading-none">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="shell-section py-16">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Servicios</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Productos digitales con base técnica sólida.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Diseñamos cada entrega para que sea operable, medible y fácil de escalar cuando el negocio lo pida.
          </p>
        </div>
        <ServicesCarousel />
      </section>

      <section id="vyaudit" className="shell-section pb-16">
        <div className="dark-panel grid gap-8 rounded-[2rem] p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">VyAudit</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Auditoría web ejecutiva, lista para decidir.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">
              Recibe un diagnóstico de performance, SEO técnico, accesibilidad, UX y seguridad, con prioridades claras para mejorar conversión y confianza.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={VYAUDIT_CHECKOUT_URL} className="btn-primary">
                Solicitar auditoría
              </Link>
              <Link href={VYAUDIT_DEMO_URL} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/22 px-5 py-3 font-bold text-white transition hover:bg-white/10">
                Ver muestra
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/14 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-end justify-between border-b border-white/12 pb-4">
              <div>
                <p className="text-sm text-white/60">Score demo</p>
                <p className="text-5xl font-black">83</p>
              </div>
              <p className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950">accionable</p>
            </div>
            <div className="mt-5 grid gap-3">
              {["Performance", "SEO técnico", "Accesibilidad", "UX", "Seguridad"].map((item, index) => (
                <div key={item} className="grid gap-1">
                  <div className="flex justify-between text-sm font-semibold text-white/82">
                    <span>{item}</span>
                    <span>{[98, 85, 78, 91, 64][index]}/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/12">
                    <div className="h-full rounded-full bg-cyan-300" style={{ width: `${[98, 85, 78, 91, 64][index]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="shell-section pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="surface-card section-dashboard rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Proceso</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">De idea a producción con hitos claros.</h2>
              </div>
              <span className="hidden rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-blue-800 shadow-sm sm:inline-flex">
                4 fases
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Avanzas con entregables visibles, decisiones documentadas y control sobre alcance, tiempos y próximos pasos.
            </p>
            <div className="mt-6 grid gap-3">
              {processSteps.map((step, index) => (
                <div key={step.title} className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/76 p-4 shadow-[0_10px_28px_rgba(9,26,52,0.06)] backdrop-blur">
                  <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-300" aria-hidden="true" />
                  {index < processSteps.length - 1 ? (
                    <span className="absolute left-[2.1rem] top-[3.25rem] h-[calc(100%-1.35rem)] w-px bg-gradient-to-b from-blue-300 to-transparent" aria-hidden="true" />
                  ) : null}
                  <div className="flex gap-4">
                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-950/16">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">{step.title}</h3>
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-blue-700 shadow-sm">
                          {step.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 text-sm font-black text-slate-850 shadow-inner">
              Avance visible desde la primera semana.
            </div>
          </div>
          <div className="surface-card section-dashboard rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Confianza</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Construimos para que tu equipo pueda operar.</h2>
              </div>
              <span className="hidden rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-blue-800 shadow-sm sm:inline-flex">
                Stack modular
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Priorizamos rendimiento, seguridad, accesibilidad y una arquitectura que no dependa de trucos frágiles. El objetivo es que el producto sea útil desde el primer día.
            </p>
            <div className="mt-6 grid gap-3">
              {stackGroups.map((group) => (
                <div key={group.label} className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/76 p-3 pl-4 shadow-[0_10px_28px_rgba(9,26,52,0.055)] backdrop-blur">
                  <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-300" aria-hidden="true" />
                  <div className="flex items-center gap-2 text-[0.66rem] font-black uppercase tracking-[0.14em] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                    {group.label}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((tag) => (
                      <span key={tag} className="stack-chip rounded-full px-3 py-1.5 text-xs font-bold text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="shell-section grid gap-6 pb-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
        <div className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Contacto</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Cuéntanos qué quieres construir.</h2>
            </div>
            <span className="mt-1 hidden rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-blue-800 shadow-sm sm:inline-flex">
              24h respuesta
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Envíanos alcance, plazos y presupuesto estimado. Te responderemos con una ruta clara para avanzar.
          </p>
          <div className="mt-6 grid gap-2.5 text-sm text-slate-700">
            {[
              ["Dirección", "Av. Lo Errazuriz 1701, Cerrillos"],
              ["Teléfono", "+56 9 21657978"],
              ["Email", "contacto@vytronix.cl"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/80 bg-white/72 px-4 py-3.5 shadow-[0_10px_24px_rgba(9,26,52,0.05)] backdrop-blur">
                <div className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-slate-500">{label}</div>
                {label === "Email" ? (
                  <a className="mt-0.5 inline-flex text-[0.82rem] font-black text-[var(--color-primary)]" href="mailto:contacto@vytronix.cl">{value}</a>
                ) : (
                  <div className="mt-0.5 text-[0.82rem] font-black text-slate-900">{value}</div>
                )}
              </div>
            ))}
          </div>
          <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 p-2 shadow-[0_18px_42px_rgba(9,26,52,0.08)]">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-white/88 px-3 py-2 text-xs font-black text-slate-800 shadow-sm backdrop-blur">
              Ubicación Vytronix
            </div>
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.011746923971!2d-70.71161892436947!3d-33.50107150010632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662dbb0731e770b%3A0x227f08eb5a170159!2sLo%20Errazuriz%201701%2C%20Cerrillos%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1757882737853!5m2!1ses-419!2scl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-48 w-full rounded-[1.15rem] md:h-52"
              allowFullScreen
            />
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}


