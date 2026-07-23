import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import DigitalCardLeadForm from "@/components/DigitalCardLeadForm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.vytronix.cl";
const phoneDisplay = "+56 9 2165 7978";
const phoneHref = "tel:+56921657978";
const email = "contacto@vytronix.cl";
const whatsappUrl =
  "https://wa.me/56921657978?text=Hola%20Ricardo,%20escane%C3%A9%20tu%20tarjeta%20de%20Vytronix%20y%20quiero%20conversar%20sobre%20un%20proyecto.";

export const metadata: Metadata = {
  title: "Contacto | Vytronix",
  description: "Contacto directo con Vytronix para desarrollo web, apps móviles, integraciones, IA y análisis de datos.",
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacto | Vytronix",
    description: "Contacto directo para proyectos digitales con Vytronix.",
    url: "/contacto",
    siteName: "Vytronix",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contacto | Vytronix",
    description: "Contacto directo para proyectos digitales con Vytronix.",
  },
};

const services = ["Desarrollo web", "Apps móviles", "Integraciones & APIs", "Chatbots inteligentes", "VyAudit", "Análisis de datos"];

const quickActions = [
  { label: "WhatsApp", href: whatsappUrl, tone: "primary" },
  { label: "Llamar", href: phoneHref, tone: "light" },
  { label: "Email", href: `mailto:${email}`, tone: "light" },
  { label: "Guardar contacto", href: "/ricardo-alarcon.vcf", tone: "dark", download: true },
];

export default function ContactoPage() {
  return (
    <main className="shell-section py-10 md:py-16">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_30px_90px_rgba(9,26,52,0.24)]">
        <div className="relative grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(34,211,238,0.34),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(37,99,235,0.32),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0),rgba(14,165,233,0.12))]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative z-10 flex flex-col justify-between gap-10 p-6 md:p-10">
            <div>
              <Image src="/logo-transparent.png" alt="Vytronix" width={190} height={58} priority className="h-14 w-auto brightness-125" />
              <div className="mt-8 flex justify-center">
                <div className="w-fit">
                  <p className="text-center text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Founder · Full Stack Developer</p>
                  <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] border border-cyan-200/50 bg-white/10 shadow-[0_20px_55px_rgba(34,211,238,0.18)] backdrop-blur">
                      <Image src="/ricardo-profile.jpg" alt="Ricardo Alarcón" fill sizes="96px" className="object-cover" />
                    </div>
                    <div>
                    <h1 className="text-center text-4xl font-black leading-[0.95] sm:text-left md:text-6xl">Ricardo Alarcón</h1>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mx-auto mt-5 max-w-md text-center text-sm leading-7 text-slate-300 sm:text-left">
                Desarrollo tecnología para que empresas puedan vender, operar y crecer con plataformas claras, seguras y medibles.
              </p>
            </div>

            <div className="grid gap-3">
              <a href={phoneHref} className="rounded-2xl border border-white/12 bg-white/10 p-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15">
                {phoneDisplay}
              </a>
              <a href={`mailto:${email}`} className="rounded-2xl border border-white/12 bg-white/10 p-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15">
                {email}
              </a>
              <a href={siteUrl} className="rounded-2xl border border-white/12 bg-white/10 p-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15">
                www.vytronix.cl
              </a>
            </div>
          </div>

          <div className="relative z-10 bg-white/96 p-6 text-slate-950 md:p-10">
            <div className="rounded-[1.75rem] border border-cyan-100 bg-slate-50 p-5 shadow-[0_20px_60px_rgba(9,26,52,0.10)]">
              <p className="eyebrow">Tarjeta digital</p>
              <h2 className="mt-3 text-3xl font-black leading-tight">Conversemos tu próximo proyecto.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Escríbeme por WhatsApp, guarda mi contacto o déjame tus datos y te responderé lo más pronto posible para avanzar.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    download={action.download}
                    target={action.href.startsWith("http") ? "_blank" : undefined}
                    rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={
                      action.tone === "primary"
                        ? "btn-primary min-h-12 justify-center"
                        : action.tone === "dark"
                          ? "rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                          : "rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                    }
                  >
                    {action.label}
                  </a>
                ))}
              </div>

              <DigitalCardLeadForm />
            </div>

            <div className="mt-6 grid gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">Servicios</p>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <span key={service} className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-xs font-black text-slate-700">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href="/proyectos" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5">
                Ver proyectos
              </Link>
              <Link href="/#contacto" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5">
                Cotizar servicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
