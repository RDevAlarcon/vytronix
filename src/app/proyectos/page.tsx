import Script from "next/script";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";
import Image from "next/image";

const projects = [
  {
    id: "green-recycle",
    name: "Green Recycle",
    summary: "Aplicación móvil para reciclaje inteligente con seguimiento de puntos de recolección y rutas.",
    outcome: "Aceleración de nuestras ventas en un 35%.",
    services: ["Discovery UX/UI", "Desarrollo full-stack", "Integraciones", "Aplicaciones móviles"],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Flutter", "Azure"],
    category: "Mobile",
    tags: ["Mobile", "Firebase", "Maps"],
    image: "/greenrecycle.jpg",
    accent: "from-emerald-50 to-emerald-100",
  },
  {
    id: "sweet-delights",
    name: "Candys Cream",
    summary: "Tienda en línea para heladeria & pastelería artesanal con catálogo, pedidos y pago en línea.",
    outcome: "Visibilidad en el mercado gracias al SEO avanzado.",
    services: ["Product Design", "Discovery UX/UI", "Web Design"],
    stack: ["Html", "Css", "Js", "Bootstrap"],
    category: "E-commerce",
    tags: ["E-commerce", "Next.js"],
    image: "/candyscream.jpg",
    accent: "from-amber-50 to-orange-100",
  },
  {
    id: "sistema-pedidos",
    name: "Sistema de Pedidos",
    summary: "Aplicación web para gestionar pedidos con panel administrativo y métricas en tiempo real.",
    outcome: "Conectamos con usuarios en tiempo real para poder recolectar material reciclado 24/7",
    services: ["Arquitectura en la nube", "Aplicaciones móviles", "Desarrollo full-stack", "Soporte gestionado"],
    stack: ["React", "Next.js", "Supabase", "AWS"],
    category: "Web App",
    tags: ["Web App", "React"],
    image: "/sistemapedido.jpg",
    accent: "from-neutral-900 to-neutral-700",
  },
  {
    id: "tech-conference",
    name: "Tech Conference",
    summary: "Sitio web para conferencia de tecnología con agenda, registro y versiones responsive.",
    outcome: "Conectamos con usuarios en tiempo real para poder recolectar material reciclado 24/7",
    services: ["Product Design", "Discovery UX/UI", "Web Design"],
    stack: ["Next.js", "Tailwind CSS"],
    category: "Website",
    tags: ["Website", "Tailwind CSS"],
    image: "/techconference.jpg",
    accent: "from-indigo-100 to-purple-200",
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
  const WHATSAPP_URL = "https://wa.me/56921657978?text=Hola,%20vengo%20del%20sitio%20de%20Vytronix.%20Me%20gustaría%20recibir%20asesoría.%20Mi%20nombre%20es%20___.";

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid gap-12">
      {/* JSON-LD Projects Page */}
      <Script id="ld-json-projects" type="application/ld+json" strategy="afterInteractive"
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

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Proyectos que impulsan crecimiento</h1>
          <p className="mt-4 text-neutral-800">
            Diseñamos y construimos plataformas digitales listas para operar. Con foco en negocio, seguridad y desempeño, entregamos software que acelera ventas, operaciones y soporte.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#contacto" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Agenda una cita</Link>
            <Link href="/#servicios" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Conoce nuestros servicios</Link>
          </div>
        </Reveal>
      </section>

      {/* Projects grid */}
      <section className="grid gap-6">
        <h2 className="text-2xl font-semibold">Casos recientes</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <Reveal key={project.id} className="rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col">
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${project.accent}`}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`object-cover ${project.id === "sistema-pedidos" ? "opacity-90" : ""}`}
                    priority={project.id === "green-recycle"}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm">Visual en preparación</div>
                )}
              </div>
              <div className="p-1.5 flex flex-col gap-1.5 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="grid gap-1.5">
                    <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">{project.category}</div>
                    <h3 className="text-base font-semibold leading-tight">{project.name}</h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">{project.summary}</p>
                  </div>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] font-semibold whitespace-nowrap hover:underline"
                  >
                    Lo quiero
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] text-neutral-700 border border-neutral-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonios / confianza */}
      <section className="p-6 rounded-2xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Lo que dicen nuestros clientes</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm text-neutral-700">
          <blockquote className="p-4 rounded-xl border bg-neutral-50">
            &ldquo;Entregaron nuestro marketplace en tiempo récord con todos nuestros requerimientos.&rdquo;
            <div className="mt-2 text-neutral-500 text-xs">— CEO, Nitrocar</div>
          </blockquote>
          <blockquote className="p-4 rounded-xl border bg-neutral-50">
            &ldquo;Entrega super rapida de nuestra página web ahora tenemos visibilidad minuto a minuto.&rdquo;
            <div className="mt-2 text-neutral-500 text-xs">— Gerente Comercial, CandysCream </div>
          </blockquote>
          <blockquote className="p-4 rounded-xl border bg-neutral-50">
            &ldquo;El equipo de operaciones redujo tiempos de recoleccción gracias al tracking en vivo.&rdquo;
            <div className="mt-2 text-neutral-500 text-xs">— Jefe de Recoleccion.</div>
          </blockquote>
        </div>
      </section>

      {/* CTA final */}
      <section className="rounded-2xl border bg-white shadow-sm p-6 grid md:grid-cols-2 gap-4 items-center">
        <div className="text-neutral-800">
          <h2 className="text-xl font-semibold">¿Listo para tu próximo proyecto?</h2>
          <p className="mt-1 text-sm">Contáctanos y pongamos tu producto digital en producción.</p>
        </div>
        <div className="flex gap-3 md:justify-end">
          <Link href="/#contacto" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Contáctanos</Link>
          <a href="https://wa.me/56921657978?text=Hola,%20quiero%20conocer%20el%20portafolio%20de%20Vytronix" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">WhatsApp</a>
        </div>
      </section>
    </div>
  );
}
