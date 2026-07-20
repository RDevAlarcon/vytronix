import "@/app/globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import HeaderNav from "@/components/HeaderNav";
import { verifyJwt } from "@/server/auth/jwt";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Vytronix";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vytronix | Soluciones web y móviles",
  description: "Desarrollo a medida, auditoría web y soluciones tecnológicas para negocios digitales.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo-transparent.png",
    apple: "/logo-transparent.png",
    shortcut: "/logo-transparent.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<{ email: string; name?: string; role?: string }>(token);

  const telephone = "+569 21657978";
  const address = {
    streetAddress: "Av. Lo Errazuriz 1701",
    addressLocality: "Cerrillos",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  };

  return (
    <html lang="es">
      <body className="min-h-screen">
        <Script
          id="ld-json-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: new URL("/logo-transparent.png", SITE_URL).toString(),
              telephone,
              address: { "@type": "PostalAddress", ...address },
              openingHoursSpecification: [
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "18:00" },
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "09:00", closes: "14:00" },
              ],
              sameAs: [],
            }),
          }}
        />
        <Script
          id="ld-json-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <header className="sticky top-0 z-50 py-3">
          <div className="shell-section">
            <div className="flex items-center justify-between rounded-full border border-white/70 bg-white/62 px-4 py-2 shadow-[0_16px_45px_rgba(9,26,52,0.10)] backdrop-blur-2xl">
              <Link href="/" className="flex items-center rounded-full" aria-label="Ir al inicio">
                <Image src="/logo-transparent.png" alt="Vytronix" width={148} height={40} priority className="h-10 w-auto" />
              </Link>
              <HeaderNav user={user ?? null} />
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20">
          <div className="shell-section">
            <div className="surface-card section-dashboard rounded-[1.75rem] p-6 md:p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_1.2fr_1fr] md:items-center">
                <div className="flex flex-col gap-3 text-sm">
                  <Link href="/privacidad" className="font-black text-slate-700 transition hover:text-[var(--color-primary)]">Política de Privacidad</Link>
                  <Link href="/terminos" className="font-black text-slate-700 transition hover:text-[var(--color-primary)]">Términos y Condiciones</Link>
                </div>

                <div className="text-center">
                  <p className="eyebrow">Vytronix</p>
                  <p className="mt-2 text-lg font-black text-slate-950">Tecnología que transforma, soluciones que conectan.</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">© 2026 Vytronix</p>
                </div>

                <div className="flex items-center justify-start gap-3 md:justify-end">
                  {[
                    { label: "TikTok", color: "text-slate-950", path: "M16.5 6.2c-1-.7-1.6-1.8-1.7-3V3h-3.2v10.1a2.7 2.7 0 1 1-1.8-2.6V7.2A5.9 5.9 0 0 0 5 12.9a5.9 5.9 0 1 0 11.8 0V8.4c1.1.8 2.4 1.2 3.7 1.2V6.4c-1.5 0-2.9-.4-4-1.2Z" },
                    { label: "Instagram", color: "text-[#E1306C]", path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm6.1-1.7a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" },
                    { label: "Facebook", color: "text-[#1877F2]", path: "M13.5 9H16V6h-2.5C10.8 6 10 7.8 10 9.6V12H8v3h2v6h3v-6h2.4l.6-3H13V9.9c0-.6.3-.9.9-.9Z" },
                    { label: "LinkedIn", color: "text-[#0A66C2]", path: "M6.5 9H4v11h2.5V9ZM5.2 4a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 5.2 4ZM20 14.1V20h-2.5v-5.2c0-1.3-.5-2.2-1.6-2.2-.9 0-1.5.6-1.7 1.2-.1.2-.1.6-.1.9V20H11.6V9h2.5v1.5c.3-.7 1.2-1.7 2.9-1.7 2.1 0 3.6 1.4 3.6 4.3Z" },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className={`grid h-11 w-11 place-items-center rounded-2xl border border-white/80 bg-white/72 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white ${item.color}`}
                      aria-label={item.label}
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d={item.path} />
                      </svg>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>

        <a
          href="https://wa.me/56921657978?text=Hola,%20vengo%20del%20sitio%20de%20Vytronix.%20Me%20gustaria%20recibir%20asesoria.%20Mi%20nombre%20es%20___."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="wa-fixed inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_18px_42px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-6 w-6">
            <path d="M19.11 17.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
            <path d="M27.1 4.9C24.2 2 20.4.5 16.4.5 8.5.5 2 7 2 14.9c0 2.5.7 4.9 2 7L2 30l8.3-2.2c2 1.1 4.3 1.6 6.6 1.6 7.9 0 14.4-6.5 14.4-14.4 0-3.9-1.5-7.7-4.4-10.6zM16.9 27c-2.2 0-4.3-.6-6.1-1.7l-.4-.2-4.9 1.3 1.3-4.8-.3-.5c-1.2-1.9-1.9-4.2-1.9-6.5 0-6.7 5.5-12.2 12.2-12.2 3.3 0 6.4 1.3 8.8 3.7 2.4 2.4 3.7 5.5 3.7 8.8C28.9 21.5 23.6 27 16.9 27z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
