import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";
import Image from "next/image";

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
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Soluciones web y móviles a tu medida
          </h1>
          <p className="mt-4 text-neutral-600">
            Desarrollamos productos rápidos, seguros y escalables para tu negocio.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/register" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Crear cuenta</a>
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

      <section id="servicios" className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
        {[
          { title: "Apps móviles", src: "/apps.png", alt: "Apps móviles" },
          { title: "Sitios web", src: "/sitiosweb.jpg", alt: "Sitios web" },
          { title: "Integraciones & APIs", src: "/integracionesapi.jpg", alt: "Integraciones y APIs" },
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
            <p className="text-sm text-neutral-600">Entrega ágil, calidad de código y soporte.</p>
          </div>
        ))}
      </section>

      <section id="contacto" className="max-w-3xl mx-auto px-4 py-14">
        {/* Formulario de solicitudes de clientes */}
        <ContactForm />
      </section>
    </>
  );
}

