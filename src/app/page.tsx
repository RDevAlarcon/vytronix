import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soluciones web y móviles a tu medida",
  description: "Desarrollo de sitios web, apps móviles e integraciones a la medida. Rendimiento, SEO y seguridad para tu negocio.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Soluciones web y móviles a tu medida",
    description: "Sitios rápidos, seguros y escalables con tecnologías modernas.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Tecnología que transforma, soluciones que conectan.
          </h1>
          <p className="mt-4 text-neutral-600">
            Impulsamos tu crecimiento con tecnología a medida.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Crear cuenta</Link>
            <a href="#servicios" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Ver servicios</a>
          </div>
        </div>
        <div className="h-64 md:h-80 rounded-xl border overflow-hidden bg-black/5">
          <video
            className="w-full h-full object-cover"
            src="/LogoVideo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section id="servicios" className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Soluciones web y móviles a tu medida</h2>
          <p className="mt-1 text-neutral-600">Desarrollamos productos rápidos, seguros y escalables para tu negocio.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Apps móviles",
            src: "/apps.png",
            alt: "Apps móviles",
            desc:
              "Diseño y desarrollo de apps móviles nativas o multiplataforma, listas para escalar. Arquitectura escalable, alto rendimiento, calidad de código y QA automatizado. Integraciones seguras, para llevar tu idea a producción.",
          },
          {
            title: "Sitios web",
            src: "/sitiosweb.jpg",
            alt: "Sitios web",
            desc: "Landing pages, sitios web rápidos, E-commerce y Corporativos, accesibles y listos para convertir. Diseño responsivo, rendimiento de primera y arquitectura moderna lista para crecer.",
          },
          {
            title: "Integraciones & APIs",
            src: "/integracionesapi.jpg",
            alt: "Integraciones y APIs",
            desc: "Conectamos tu producto con pagos, CRM y terceros. Integraciones seguras y escalables para tu operación.",
          },
        ].map((card) => (
          <div key={card.title} className="group p-6 rounded-2xl border bg-white shadow-sm transition hover:shadow-md hover:border-neutral-300">
            <div className="mb-3 h-40 w-full overflow-hidden rounded-xl border bg-neutral-100">
              <Image
                src={card.src}
                alt={card.alt}
                width={800}
                height={400}
                className="h-40 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                priority={false}
              />
            </div>
            <h3 className="font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-neutral-600">{card.desc}</p>
          </div>
        ))}
        </div>
      </section>

      {/* Teaser: Quiénes somos */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="p-6 rounded-2xl border bg-white shadow-sm grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <h2 className="text-xl font-semibold">Quiénes somos</h2>
            <p className="mt-1 text-neutral-700 text-sm">
              Impulsamos a pymes y startups con software a medida rápido, seguro y escalable, alineado a los objetivos del negocio.
            </p>
          </div>
          <div className="flex gap-3 md:justify-end">
            <Link href="/quienes-somos" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Conoce más</Link>
            <Link href="/#contacto" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Contáctanos</Link>
          </div>
        </div>
      </section>

      {/* Teaser: Proyectos */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="p-6 rounded-2xl border bg-white shadow-sm grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <h2 className="text-xl font-semibold">Proyectos</h2>
            <p className="mt-1 text-neutral-700 text-sm">
              Revisa casos con resultados medibles en e-commerce, logística, seguros y más industrias.
            </p>
          </div>
          <div className="flex gap-3 md:justify-end">
            <Link href="/proyectos" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Ver portafolio</Link>
            <Link href="/#servicios" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Nuestros servicios</Link>
          </div>
        </div>
      </section>

      <section id="contacto" className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-6 items-start">
        <div>
          {/* Formulario de solicitudes de clientes */}
          <ContactForm />
        </div>
        <aside className="p-6 rounded-2xl border bg-white shadow-sm grid gap-4">
          <div>
            <h3 className="font-semibold text-lg">Contáctanos</h3>
            <p className="mt-1 text-sm text-neutral-600">Av. Lo Errazuriz 1701, Cerrillos, Región Metropolitana</p>
            <p className="mt-1 text-sm text-neutral-600">Teléfono: +56 9 21657978</p>
            <p className="mt-1 text-sm text-neutral-600">Email: <a className="underline" href="mailto:contacto@vytronix.cl">contacto@vytronix.cl</a></p>
          </div>
          <div>
            <h4 className="font-medium">Horarios de atención</h4>
            <ul className="mt-1 text-sm text-neutral-700">
              <li>Lunes–Jueves: 9:00–18:00</li>
              <li>Viernes: 9:00–14:00</li>
              <li>Sáb/Dom y festivos: Cerrado</li>
            </ul>
          </div>
          <div className="grid">
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.011746923971!2d-70.71161892436947!3d-33.50107150010632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662dbb0731e770b%3A0x227f08eb5a170159!2sLo%20Errazuriz%201701%2C%20Cerrillos%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1757882737853!5m2!1ses-419!2scl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64 md:h-72 rounded-xl border"
              allowFullScreen
            />
          </div>
        </aside>
      </section>
    </>
  );
}

