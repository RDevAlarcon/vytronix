import type { Metadata } from "next";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { verifyJwt } from "@/server/auth/jwt";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import ProfileNameForm from "./ProfileNameForm";
import LandingPaymentBrick from "./LandingPaymentBrick";
import DiscountCountdown from "./DiscountCountdown";

type UserJwt = { sub?: string; email?: string; name?: string; role?: string };

type DbUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date | null;
  landingDiscountConsumedAt: Date | null;
  landingDiscountPaymentId: string | null;
};

export const metadata: Metadata = { robots: { index: false, follow: false } };

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const dateFormatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "long" });
const currencyFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const BASE_PRICE = 200000;
const DISCOUNT_RATE = 0.1;
const IVA_RATE = 0.19;

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const jwtUser = await verifyJwt<UserJwt>(token);

  let dbUser: DbUser | null = null;
  if (jwtUser?.sub) {
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        landingDiscountConsumedAt: users.landingDiscountConsumedAt,
        landingDiscountPaymentId: users.landingDiscountPaymentId,
      })
      .from(users)
      .where(eq(users.id, jwtUser.sub))
      .limit(1);
    dbUser = row ?? null;
  }

  const displayEmail = dbUser?.email ?? jwtUser?.email ?? "";
  const displayName = dbUser?.name ?? jwtUser?.name ?? null;
  const displayRole = dbUser?.role ?? jwtUser?.role ?? null;

  const initials = (displayName || displayEmail || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createdAt = dbUser?.createdAt ?? null;
  const discountExpiresAt = createdAt ? new Date(createdAt.getTime() + THIRTY_DAYS_MS) : null;
  const discountExpiresIso = discountExpiresAt?.toISOString();
  const discountExpiresLabel = discountExpiresAt ? dateFormatter.format(discountExpiresAt) : null;

  const discountConsumedAt = dbUser?.landingDiscountConsumedAt ?? null;
  const landingDiscountPaymentId = dbUser?.landingDiscountPaymentId ?? null;
  const discountConsumedLabel = discountConsumedAt ? dateFormatter.format(discountConsumedAt) : null;
  const hasActiveDiscount = !discountConsumedAt;

  const discountUrl = process.env.NEXT_PUBLIC_LANDING_DISCOUNT_URL || process.env.LANDING_DISCOUNT_URL || "";
  const discountedPrice = Math.round(BASE_PRICE * (1 - DISCOUNT_RATE));
  const ivaAmount = Math.round(discountedPrice * IVA_RATE);
  const totalAmount = discountedPrice + ivaAmount;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>
      {displayRole === "admin" && <p className="mt-2 text-sm text-neutral-600">Rol: admin</p>}

      <div className="mt-6 p-6 rounded-2xl border bg-white shadow-sm grid md:grid-cols-[120px_1fr] gap-6 items-center">
        <div className="w-24 h-24 rounded-full bg-neutral-200 border flex items-center justify-center text-neutral-700 font-semibold">
          {initials}
        </div>
        <div className="grid gap-2">
          <ProfileNameForm initialName={displayName ?? undefined} email={displayEmail} />
          <p className="text-xs text-neutral-500 mt-2">Próximamente podrás subir tu foto.</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-white shadow-sm">
        {hasActiveDiscount ? (
          <div className="p-6 grid gap-4 md:flex md:items-center md:justify-between">
            <div className="grid gap-2 text-neutral-800 max-w-xl">
              <div>
                <h2 className="text-2xl font-bold">Felicitaciones</h2>
                <p className="text-lg text-neutral-600">Canjea tu 10% de descuento en tu primera landing page y comencemos hoy mismo.</p>
              </div>
              <p className="text-xs text-neutral-500">
                Válido por 30 días desde que creaste tu cuenta
                {discountExpiresLabel ? ` (caduca el ${discountExpiresLabel}).` : "."}
              </p>
              {discountExpiresIso ? (
                <DiscountCountdown initialExpiresAt={discountExpiresIso} />
              ) : (
                <span className="text-sm text-neutral-500">No pudimos calcular la fecha de expiración. Contáctanos para ayudarte.</span>
              )}
              <div className="mt-3 grid gap-1 text-sm text-neutral-600">
                <div><span className="font-semibold text-neutral-800">Precio base:</span> {currencyFormatter.format(BASE_PRICE)} + IVA</div>
                <div><span className="font-semibold text-neutral-800">Descuento 10%:</span> -{currencyFormatter.format(BASE_PRICE - discountedPrice)} (precio con descuento {currencyFormatter.format(discountedPrice)})</div>
                <div><span className="font-semibold text-neutral-800">IVA 19%:</span> {currencyFormatter.format(ivaAmount)}</div>
                <div><span className="font-semibold text-neutral-800">Total a pagar:</span> {currencyFormatter.format(totalAmount)}</div>
                <div>Incluye 1 sección, header/footer, links a redes sociales, SEO técnico, botón de WhatsApp, hosting y dominio por 1 año.</div>
                <div>Plazo de entrega: 10 días hábiles. Garantía: 10 días por falla técnica.</div>
                <div className="text-xs text-neutral-500">Renovación de hosting y dominio a partir del segundo año se cotiza por separado.</div>
              </div>
            </div>
            <div className="grid gap-3 max-w-xs w-full">
              <LandingPaymentBrick totalAmount={totalAmount} payerEmail={displayEmail || undefined} fallbackUrl={discountUrl || undefined} />
              {discountUrl ? (
                <a
                  href={discountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 hover:text-neutral-700 underline"
                >
                  ¿Prefieres el enlace directo de Mercado Pago? Ábrelo aquí.
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="p-6 grid gap-4 md:flex md:items-start md:justify-between">
            <div className="grid gap-2 text-neutral-800 max-w-xl">
              <div>
                <h2 className="text-2xl font-bold">¡Gracias por tu compra!</h2>
                <p className="text-lg text-neutral-600">
                  Ya canjeaste tu 10% de descuento{discountConsumedLabel ? ` el ${discountConsumedLabel}` : ""}.
                </p>
              </div>
              <div className="grid gap-1 text-sm text-neutral-600">
                <div>Estamos preparando tu landing page y pronto te contactaremos para coordinar los próximos pasos.</div>
                <div>Incluye 1 sección, header/footer, links a redes sociales, SEO técnico, botón de WhatsApp, hosting y dominio por 1 año.</div>
                <div>Plazo de entrega: 10 días hábiles. Garantía: 10 días por falla técnica.</div>
                <div className="text-xs text-neutral-500">Renovación de hosting y dominio a partir del segundo año se cotiza por separado.</div>
              </div>
              {landingDiscountPaymentId && (
                <span className="text-xs text-neutral-500">Referencia Mercado Pago #{landingDiscountPaymentId}.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

