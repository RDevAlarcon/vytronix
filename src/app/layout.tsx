import "@/app/globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { verifyJwt } from "@/server/auth/jwt";
import Image from "next/image";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Vytronix";

export const metadata: Metadata = {
  title: "Vytronix | Soluciones Web & Móviles",
  description: "Desarrollo a medida y soluciones tecnológicas",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<{ email: string; name?: string; role?: string }>(token);

  const telephone = "+569 65658099";
  const address = {
    streetAddress: "Av. Lo Errazuriz 1701",
    addressLocality: "Cerrillos",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  };

  return (
    <html lang="es">
      <body className="min-h-screen">
        {/* JSON-LD: Organization & WebSite */}
        <Script id="ld-json-org" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: new URL("/logo.png", SITE_URL).toString(),
              telephone,
              address: { "@type": "PostalAddress", ...address },
              openingHoursSpecification: [
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday"], opens: "09:00", closes: "18:00" },
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "09:00", closes: "14:00" }
              ],
              sameAs: [],
            }),
          }}
        />
        <Script id="ld-json-website" type="application/ld+json" strategy="afterInteractive"
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
        <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="Ir al inicio">
              <Image src="/logo.png" alt="Vytronix" width={160} height={40} priority className="h-10 w-auto origin-left scale-125 md:scale-[1.61]" />
            </Link>
            <nav className="flex gap-4 text-sm items-center">
              <a href="/quienes-somos">Quiénes somos</a>
              <a href="#servicios">Servicios</a>
              <a href="#contacto">Contacto</a>
              {user ? (
                <>
                  {user.role === "admin" ? (
                    <>
                      <Link href="/dashboard" className="px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Dashboard</Link>
                      <Link href="/admin" className="px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Admin</Link>
                    </>
                  ) : (
                    <Link href="/perfil" className="px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Mi perfil</Link>
                  )}
                  <form action="/api/auth/logout" method="post">
                    <button className="px-3 py-1 border rounded" type="submit">Cerrar sesión</button>
                  </form>
                </>
              ) : (
                <a href="/login" className="px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Ingresar</a>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-20">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-center grid gap-1">
            <div className="text-neutral-600 italic">Tecnología que transforma, soluciones que conectan.</div>
            <div>© {new Date().getFullYear()} Vytronix</div>
          </div>
        </footer>

        {/* WhatsApp floating button */}
        <a
          href="https://wa.me/56965658099?text=Hola,%20vengo%20del%20sitio%20de%20Vytronix.%20Me%20gustaría%20recibir%20asesoría.%20Mi%20nombre%20es%20___."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="fixed z-50 bottom-5 right-5 md:bottom-6 md:right-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6">
            <path d="M19.11 17.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
            <path d="M27.1 4.9C24.2 2 20.4.5 16.4.5 8.5.5 2 7 2 14.9c0 2.5.7 4.9 2 7L2 30l8.3-2.2c2 1.1 4.3 1.6 6.6 1.6 7.9 0 14.4-6.5 14.4-14.4 0-3.9-1.5-7.7-4.4-10.6zM16.9 27c-2.2 0-4.3-.6-6.1-1.7l-.4-.2-4.9 1.3 1.3-4.8-.3-.5c-1.2-1.9-1.9-4.2-1.9-6.5 0-6.7 5.5-12.2 12.2-12.2 3.3 0 6.4 1.3 8.8 3.7 2.4 2.4 3.7 5.5 3.7 8.8C28.9 21.5 23.6 27 16.9 27z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}

