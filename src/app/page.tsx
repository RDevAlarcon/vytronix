import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";
import Image from "next/image";
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

const services = [
  {
    title: "Apps móviles",
    src: "/apps.png",
    alt: "Apps móviles",
    desc: "Aplicaciones nativas o multiplataforma con arquitectura escalable, QA y despliegue listo para crecer.",
    meta: "Mobile · UX · APIs",
  },
  {
    title: "Sitios web",
    src: "/sitiosweb.jpg",
    alt: "Sitios web",
    desc: "Landing pages, sitios corporativos y e-commerce rápidos, accesibles y pensados para convertir.",
    meta: "SEO · Performance · CMS",
  },
  {
    title: "Integraciones & APIs",
    src: "/integracionesapi.jpg",
    alt: "Integraciones y APIs",
    desc: "Conectamos pagos, CRM, automatizaciones y plataformas externas con seguridad y trazabilidad.",
    meta: "Pagos · CRM · Automatización",
  },
  {
    title: "VyAudit",
    src: "/plan_medio.jpg",
    alt: "VyAudit",
    desc: "Informe técnico-comercial para detectar brechas de performance, SEO, UX, accesibilidad y seguridad.",
    meta: "Auditoría · Score · PDF",
  },
];

const metrics = [
  { value: "10d", label: "Entrega base landing", icon: "M4 12h16M12 4v16" },
  { value: "24/7", label: "Canales digitales activos", icon: "M12 6v6l4 2" },
  { value: "5", label: "Áreas auditadas por VyAudit", icon: "M5 13l4 4L19 7" },
];


export default function Home() {
  return (
    <>
      <section className="shell-section pt-10 md:pt-16">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/64 p-5 shadow-[var(--shadow-panel)] backdrop-blur-2xl md:grid-cols-[1.02fr_0.98fr] md:p-8 lg:p-10">
          <div className="flex flex-col justify-center py-4">
            <p className="eyebrow">Vytronix · Software para crecer</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-slate-950 md:text-6xl">
              Tecnología clara para negocios que necesitan avanzar.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650 text-slate-700">
              Creamos sitios, apps, integraciones y auditorías web con foco en rendimiento, seguridad y resultados comerciales.
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
                <div key={metric.label} className="metric-tile p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-3xl font-black tracking-tight text-slate-950">{metric.value}</div>
                    <span className="metric-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d={metric.icon} />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-3 max-w-[9rem] text-[0.68rem] font-black uppercase leading-4 tracking-[0.12em] text-slate-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-slate-950">
            <video className="absolute inset-0 h-full w-full object-cover opacity-90" src="/LogoVideo.mp4" autoPlay muted loop playsInline preload="auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/18 bg-white/12 p-5 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Stack moderno</p>
                  <p className="mt-1 text-2xl font-black">Web · Mobile · APIs</p>
                </div>
                <div className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">2026-ready</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold text-white/80">
                <span className="rounded-full bg-white/12 px-3 py-2 text-center">SEO</span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-center">UX</span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-center">Seguridad</span>
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((card) => (
            <article key={card.title} className="surface-card group overflow-hidden rounded-3xl">
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <Image src={card.src} alt={card.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute left-3 top-3 rounded-full bg-white/86 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur">
                  {card.meta}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
              </div>
            </article>
          ))}
        </div>
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
          <div className="surface-card rounded-3xl p-6">
            <p className="eyebrow">Proceso</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">De idea a producción con hitos claros.</h2>
            <div className="mt-6 grid gap-4">
              {["Descubrimiento y alcance", "Diseño funcional y prototipo", "Desarrollo, QA y lanzamiento"].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                  <div>
                    <h3 className="font-black text-slate-900">{step}</h3>
                    <p className="mt-1 text-sm text-slate-600">Avances visibles, decisiones documentadas y foco en valor de negocio.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-card rounded-3xl p-6">
            <p className="eyebrow">Confianza</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Construimos para que tu equipo pueda operar.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Priorizamos rendimiento, seguridad, accesibilidad y una arquitectura que no dependa de trucos frágiles. El objetivo es que el producto sea útil desde el primer día.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "PostgreSQL", "APIs", "Mercado Pago", "SEO", "Analytics"].map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="shell-section grid gap-6 pb-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
        <div className="surface-card rounded-3xl p-6 md:p-8">
          <p className="eyebrow">Contacto</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Cuéntanos qué quieres construir.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Envíanos alcance, plazos y presupuesto estimado. Te responderemos con una ruta clara para avanzar.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <p><strong>Dirección:</strong> Av. Lo Errazuriz 1701, Cerrillos, Región Metropolitana</p>
            <p><strong>Teléfono:</strong> +56 9 21657978</p>
            <p><strong>Email:</strong> <a className="font-semibold text-[var(--color-primary)]" href="mailto:contacto@vytronix.cl">contacto@vytronix.cl</a></p>
          </div>
          <iframe
            title="Mapa de ubicación"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.011746923971!2d-70.71161892436947!3d-33.50107150010632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662dbb0731e770b%3A0x227f08eb5a170159!2sLo%20Errazuriz%201701%2C%20Cerrillos%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1757882737853!5m2!1ses-419!2scl"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-6 h-64 w-full rounded-3xl border border-slate-200"
            allowFullScreen
          />
        </div>
        <ContactForm />
      </section>
    </>
  );
}
