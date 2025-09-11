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
  description: "Desarrollo a medida y soluciones tecnológicas"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<{ email: string; name?: string; role?: string }>(token);

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
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm">© {new Date().getFullYear()} Vytronix</div>
        </footer>
      </body>
    </html>
  );
}
