import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { db } from "@/server/db/client";
import { verifyCheckoutState } from "@/server/vyaudit/checkoutState";

type SearchParams = {
  state?: string;
  payment_id?: string;
  status?: string;
};

type PurchaseRow = { run_url: string };

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const VYAUDIT_BASE_URL = process.env.VYAUDIT_BASE_URL;
const VYAUDIT_ADMIN_ACCESS_KEY = process.env.VYAUDIT_ADMIN_ACCESS_KEY;
const PRICE_CLP = Number(process.env.VYAUDIT_PRICE_CLP ?? 29990);

function toAbsoluteRunUrl(runUrl: string): string {
  const raw = runUrl.trim();
  const base = (VYAUDIT_BASE_URL || "").trim();

  if (/^https?:\/\//i.test(raw)) {
    if (!base) {
      return raw;
    }

    try {
      const current = new URL(raw);
      const baseUrl = new URL(base.endsWith("/") ? base : `${base}/`);

      // If VyAudit returns /run on the wrong host (e.g. localhost:3000), force the configured host.
      if (current.pathname.startsWith("/run/") && current.host !== baseUrl.host) {
        return new URL(`${current.pathname}${current.search}${current.hash}`, baseUrl).toString();
      }

      return raw;
    } catch {
      return raw;
    }
  }

  if (!base) {
    return raw;
  }

  try {
    const normalizedBase = base.endsWith("/") ? base : `${base}/`;
    return new URL(raw, normalizedBase).toString();
  } catch {
    return raw;
  }
}

function buildAutoAuditUrl(runUrl: string, domain: string | null, email: string): string {
  const absoluteRun = toAbsoluteRunUrl(runUrl);

  if (!domain) {
    return absoluteRun;
  }

  try {
    const parsedRun = new URL(absoluteRun);
    const match = parsedRun.pathname.match(/\/run\/([^/?#]+)/);
    if (!match?.[1]) {
      return absoluteRun;
    }

    const token = match[1];
    const normalizedUrl = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;

    const resultsUrl = new URL("/results", parsedRun.origin);
    resultsUrl.searchParams.set("url", normalizedUrl);
    resultsUrl.searchParams.set("email", email);
    resultsUrl.searchParams.set("token", token);
    return resultsUrl.toString();
  } catch {
    return absoluteRun;
  }
}
async function ensurePurchaseTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS vyaudit_purchases (
      id SERIAL PRIMARY KEY,
      payment_id TEXT NOT NULL UNIQUE,
      external_reference TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      domain TEXT NOT NULL,
      run_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function renderError(title: string, detail: string) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-16 md:px-8">
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm md:p-12">
        <h1 className="text-2xl font-black text-red-900">{title}</h1>
        <p className="mt-3 text-red-800">{detail}</p>
        <Link href="/vyaudit" className="mt-6 inline-flex rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100">
          Volver a intentar pago
        </Link>
      </section>
    </main>
  );
}

export default async function VyAuditReturnPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const stateRaw = params.state ?? "";
  const paymentId = params.payment_id ?? "";
  const status = (params.status ?? "").toLowerCase();

  if (!stateRaw) {
    return renderError("No se recibio estado de compra", "Falta informacion para validar el pago.");
  }

  const stateCheck = verifyCheckoutState(stateRaw);
  if (!stateCheck.ok) {
    return renderError("Estado de compra invalido", `Detalle: ${stateCheck.reason}`);
  }

  if (status !== "approved") {
    return renderError("Pago no aprobado", "El pago no fue aprobado. Puedes reintentar el proceso.");
  }

  if (!paymentId) {
    return renderError("Pago sin identificador", "No recibimos payment_id desde Mercado Pago.");
  }

  if (!MP_ACCESS_TOKEN) {
    return renderError("Integracion MP no configurada", "Falta MP_ACCESS_TOKEN en el servidor.");
  }

  if (!VYAUDIT_BASE_URL || !VYAUDIT_ADMIN_ACCESS_KEY) {
    return renderError("Integracion VyAudit incompleta", "Faltan VYAUDIT_BASE_URL o VYAUDIT_ADMIN_ACCESS_KEY.");
  }

  const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    cache: "no-store",
  });

  if (!paymentResponse.ok) {
    return renderError("No se pudo validar el pago", "Mercado Pago no devolvio una respuesta valida.");
  }

  const payment = (await paymentResponse.json()) as {
    id?: string | number;
    status?: string;
    external_reference?: string;
    transaction_amount?: number;
    payer?: { email?: string };
  };

  if ((payment.status ?? "").toLowerCase() !== "approved") {
    return renderError("Pago aun no aprobado", "El estado final del pago no es aprobado.");
  }

  const expectedExternalRef = `vyaudit_${stateCheck.payload.nonce}`;
  if (payment.external_reference !== expectedExternalRef) {
    return renderError("Referencia de pago invalida", "La referencia del pago no coincide con la compra iniciada.");
  }

  if (typeof payment.transaction_amount === "number" && payment.transaction_amount < PRICE_CLP) {
    return renderError("Monto insuficiente", "El monto pagado no corresponde al valor de VyAudit.");
  }

  const payerEmail = (stateCheck.payload.email || payment.payer?.email || "").trim().toLowerCase();
  if (!payerEmail) {
    return renderError("Correo no disponible", "Mercado Pago no devolvio correo del comprador.");
  }

  const allowedDomain = stateCheck.payload.domain?.trim().toLowerCase() || null;
  const storedDomain = allowedDomain || "sin-dominio";

  await ensurePurchaseTable();

  const existing = await db.execute(sql`
    SELECT run_url
    FROM vyaudit_purchases
    WHERE payment_id = ${String(payment.id ?? paymentId)}
    LIMIT 1
  `);

  const existingRows = (existing as unknown as { rows: PurchaseRow[] }).rows;
  if (existingRows?.[0]?.run_url) {
    const existingAbsolute = toAbsoluteRunUrl(existingRows[0].run_url);
    if (!/^https?:\/\//i.test(existingAbsolute)) {
      return renderError("URL de acceso invalida", `No se pudo construir URL absoluta: ${existingAbsolute}`);
    }

    const existingAuto = buildAutoAuditUrl(existingAbsolute, allowedDomain, payerEmail);
    redirect(existingAuto);
  }

  const tokenResponse = await fetch(`${VYAUDIT_BASE_URL.replace(/\/$/, "")}/api/tokens/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": VYAUDIT_ADMIN_ACCESS_KEY,
    },
    body: JSON.stringify({
      customerEmail: payerEmail,
      allowedDomain: allowedDomain || undefined,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    const tokenErr = await tokenResponse.text();
    return renderError("No se pudo emitir acceso", `VyAudit respondio: ${tokenErr.slice(0, 220)}`);
  }

  const tokenData = (await tokenResponse.json()) as { runUrl?: string };
  if (!tokenData.runUrl) {
    return renderError("Respuesta invalida de VyAudit", "No se recibio runUrl.");
  }

  const absoluteRunUrl = toAbsoluteRunUrl(tokenData.runUrl);
  if (!/^https?:\/\//i.test(absoluteRunUrl)) {
    return renderError("URL de acceso invalida", `No se pudo construir URL absoluta: ${absoluteRunUrl}`);
  }

  await db.execute(sql`
    INSERT INTO vyaudit_purchases (payment_id, external_reference, customer_email, domain, run_url)
    VALUES (${String(payment.id ?? paymentId)}, ${expectedExternalRef}, ${payerEmail}, ${storedDomain}, ${absoluteRunUrl})
    ON CONFLICT (payment_id)
    DO UPDATE SET run_url = EXCLUDED.run_url
  `);

  const autoRunUrl = buildAutoAuditUrl(absoluteRunUrl, allowedDomain, payerEmail);
  redirect(autoRunUrl);
}