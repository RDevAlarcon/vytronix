import Script from "next/script";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

const projects = [
  {
    id: "Aplicacion móvil Marketplace B2B ",
    name: "Aplicacion móvil con marketplace B2B de suministros mecánicos",
    summary: "Suite móvil para compras de insumos mecánicos, roles de superadmin, usuario, tienda y delivery de compras.",
    outcome: "Aceleración de nuestras ventas en un 35%.",
    services: ["Discovery UX/UI", "Desarrollo full-stack", "Integraciones", "Aplicaciones móviles"],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Flutter", "Azure"],
  },
  {
    id: "Landing Page",
    name: "Landin Page para servicio de Heladeria-Cafeteria",
    summary: "Landin Page para tener mas visibilidad en el mercado con SEO técnico y profesional.",
    outcome: "Visibilidad en el mercado gracias al SEO avanzado.",
    services: ["Product Design", "Discovery UX/UI", "Web Design"],
    stack: ["Html", "Css", "Js", "Bootstrap"],
  },
  {
    id: "logistics-tracking",
    name: "Tracking logístico en tiempo real",
    summary: "Suite web y mobile para recolectores de reciclaje, estados de conexión y alertas.",
    outcome: "Conectamos con usuarios en tiempo real para poder recolectar material reciclado 24/7",
    services: ["Arquitectura en la nube", "Aplicaciones móviles", "Desarrollo full-stack", "Soporte gestionado"],
    stack: ["React", "Next.js", "Supabase", "AWS"],
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
          <p className="mt-4 text-neutral-700">
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
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Reveal key={project.id} className="p-6 rounded-2xl border bg-white shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="mt-2 text-sm text-neutral-700">{project.summary}</p>
              </div>
              <div className="grid gap-1 text-sm">
                <div className="text-neutral-500 uppercase tracking-wide text-xs">Servicios</div>
                <ul className="text-neutral-700">
                  {project.services.map((service) => (
                    <li key={service}>• {service}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-1 text-sm">
                <div className="text-neutral-500 uppercase tracking-wide text-xs">Stack</div>
                <div className="text-neutral-700">{project.stack.join(", ")}</div>
              </div>
              <div className="text-sm text-neutral-700"><span className="font-medium">Impacto:</span> {project.outcome}</div>
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
      <section className="grid md:grid-cols-2 gap-4 items-center">
        <div className="text-neutral-700">
          <h2 className="text-xl font-semibold">¿Listo para tu próximo proyecto?</h2>
          <p className="mt-1 text-sm">Contactanos y pongamos tu producto digital en producción.</p>
        </div>
        <div className="flex gap-3 md:justify-end">
          <Link href="/#contacto" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Contáctanos</Link>
          <a href="https://wa.me/56921657978?text=Hola,%20quiero%20conocer%20el%20portafolio%20de%20Vytronix" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">WhatsApp</a>
        </div>
      </section>
    </div>
  );
}
