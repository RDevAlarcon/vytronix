import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const projects = [
  {
    id: "green-recycle",
    name: "Green Recycle",
    summary: "Aplicación móvil para reciclaje inteligente con seguimiento de puntos de recolección y rutas.",
    outcome: "+35% aceleración comercial",
    category: "Mobile",
    tags: ["Mobile", "Firebase", "Maps"],
    image: "/greenrecycle.jpg",
    accent: "from-emerald-400 to-cyan-300",
  },
  {
    id: "sweet-delights",
    name: "Candys Cream",
    summary: "Tienda en línea para heladería y pastelería artesanal con catálogo, pedidos y pago en línea.",
    outcome: "SEO y visibilidad local",
    category: "E-commerce",
    tags: ["E-commerce", "Web", "Catálogo"],
    image: "/candyscream.jpg",
    accent: "from-amber-300 to-rose-300",
  },
  {
    id: "sistema-pedidos",
    name: "Sistema de Pedidos",
    summary: "Aplicación web para gestionar pedidos con panel administrativo y métricas en tiempo real.",
    outcome: "Operación en tiempo real",
    category: "Web App",
    tags: ["Dashboard", "React", "Métricas"],
    image: "/sistemapedido.jpg",
    accent: "from-cyan-300 to-blue-500",
  },
  {
    id: "tech-conference",
    name: "Tech Conference",
    summary: "Sitio web para conferencia de tecnología con agenda, registro y versiones responsive.",
    outcome: "Experiencia responsive",
    category: "Website",
    tags: ["Website", "Eventos", "Tailwind"],
    image: "/techconference.jpg",
    accent: "from-indigo-300 to-cyan-300",
  },
];

const stats = [
  { value: "4", label: "Casos destacados" },
  { value: "3", label: "Tipos de producto" },
  { value: "24/7", label: "Operación digital" },
];

const testimonials = [
  {
    quote: "Entregaron nuestro marketplace en tiempo récord con todos nuestros requerimientos.",
    author: "CEO, Nitrocar",
  },
  {
    quote: "Entrega muy rápida de nuestra página web. Ahora tenemos visibilidad minuto a minuto.",
    author: "Gerente Comercial, Candys Cream",
  },
  {
    quote: "El equipo de operaciones redujo tiempos de recolección gracias al tracking en vivo.",
    author: "Jefe de Recolección",
  },
];

export const metadata: Metadata = {
  title: "Proyectos | Vytronix",
  description: "Casos reales de software y plataformas digitales que construimos para pymes y startups en Chile y LATAM.",
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: "Proyectos | Vytronix",
    description: "Resultados medibles con plataformas web, mobile y automatizaciones.",
    url: "/proyectos",
  },
};

export default function ProyectosPage() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  const WHATSAPP_URL = "https://wa.me/56921657978?text=Hola,%20quiero%20conocer%20el%20portafolio%20de%20Vytronix";

  return (
    <main className="shell-section grid gap-14 pt-10 pb-20 md:pt-16">
      <Script
        id="ld-json-projects"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Proyectos | Vytronix",
            url: new URL("/proyectos", SITE_URL).toString(),
            description: "Casos de software, automatización y productos digitales construidos por Vytronix.",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: projects.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: project.name,
                description: project.summary,
              })),
            },
          }),
        }}
      />

      <section className="surface-card section-dashboard overflow-hidden rounded-[2rem] p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-end">
          <div>
            <p className="eyebrow">Proyectos</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.03] text-slate-950 md:text-6xl">
              Casos digitales que convierten ideas en operación.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
              Diseñamos y construimos plataformas web, móviles y sistemas conectados para mejorar ventas, procesos y experiencia de usuario.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#contacto" className="btn-primary btn-hero">
                Cotizar proyecto
              </Link>
              <Link href="/#servicios" className="btn-secondary">
                Ver servicios
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((item) => (
              <div key={item.label} className="metric-tile min-h-[6.5rem] p-4">
                <div className="text-3xl font-black text-slate-950">{item.value}</div>
                <div className="mt-2 text-[0.68rem] font-black uppercase leading-4 tracking-[0.12em] text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Casos recientes</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Soluciones construidas para operar.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Cada proyecto combina diseño, desarrollo e integración para resolver un objetivo concreto del negocio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="surface-card section-dashboard group overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(9,26,52,0.14)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/8 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/86 px-3 py-1 text-xs font-black text-slate-700 shadow-sm backdrop-blur">
                  {project.category}
                </div>
                <div className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/18 bg-white/14 text-sm font-black text-white shadow-xl backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className={`absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r ${project.accent}`} />
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-4 inline-flex w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.1em] text-blue-700">
                  {project.outcome}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{project.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                  </div>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden shrink-0 rounded-full border border-white/80 bg-white/74 px-4 py-2 text-sm font-black text-[var(--color-primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex"
                  >
                    Lo quiero
                  </a>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="stack-chip rounded-full px-3 py-1.5 text-xs font-bold text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Confianza</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Lo que dicen nuestros clientes</h2>
          </div>
          <span className="w-fit rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-blue-800 shadow-sm">
            Entregas reales
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="rounded-2xl border border-white/80 bg-white/76 p-4 shadow-[0_10px_28px_rgba(9,26,52,0.055)] backdrop-blur">
              <p className="text-sm font-semibold leading-6 text-slate-700">“{item.quote}”</p>
              <div className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{item.author}</div>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="dark-panel grid gap-5 rounded-[1.75rem] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Próximo paso</p>
          <h2 className="mt-2 text-3xl font-black text-white">¿Listo para tu próximo proyecto?</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">Conversemos el alcance y armemos una ruta clara para ponerlo en producción.</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/#contacto" className="btn-primary">
            Contáctanos
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/22 px-5 py-3 font-bold text-white transition hover:bg-white/10"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
