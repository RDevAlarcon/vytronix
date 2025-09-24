import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
const MP_NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL;
const MP_INTEGRATOR_ID = process.env.MP_INTEGRATOR_ID;

const DEFAULT_SITE_URL = "http://localhost:3000";
const BASE_PRICE = 200000; // Precio lista sin IVA (modo prueba)
const DISCOUNT_RATE = 0.1;
const IVA_RATE = 0.19;
const IVA_RATE_PERCENT = Math.round(IVA_RATE * 100);

export async function POST() {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: "missing_access_token" }, { status: 500 });
  }

  const discountedPrice = Math.round(BASE_PRICE * (1 - DISCOUNT_RATE));
  const ivaAmount = Math.round(discountedPrice * IVA_RATE);
  const totalAmount = discountedPrice + ivaAmount;

  const siteUrlCandidate = (RAW_SITE_URL ?? "").trim();
  const siteUrl = siteUrlCandidate.length > 0 ? siteUrlCandidate : DEFAULT_SITE_URL;

  let successUrl: string;
  let pendingUrl: string;
  let failureUrl: string;
  try {
    const normalizedBase = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
    successUrl = new URL("perfil?status=success", normalizedBase).toString();
    pendingUrl = new URL("perfil?status=pending", normalizedBase).toString();
    failureUrl = new URL("perfil?status=failure", normalizedBase).toString();
  } catch {
    return NextResponse.json(
      {
        error: "invalid_site_url",
        message: "NEXT_PUBLIC_SITE_URL or SITE_URL must be a valid absolute URL (e.g. https://tusitio.com).",
      },
      { status: 500 },
    );
  }

  const allowAutoReturn = successUrl.startsWith("https://");

  const preferencePayload: Record<string, unknown> = {
    external_reference: `landing_discount_${Date.now()}`,
    back_urls: {
      success: successUrl,
      pending: pendingUrl,
      failure: failureUrl,
    },
    items: [
      {
        id: "landing_discount_10",
        title: "Landing page Vytronix (10% OFF)",
        description: "Precio base $200.000 CLP - 10% descuento + IVA 19%",
        quantity: 1,
        category_id: "services",
        currency_id: "CLP",
        unit_price: discountedPrice,
      },
    ],
    payment_methods: {
      installments: 1,
      default_installments: 1,
      excluded_payment_methods: [],
      excluded_payment_types: [],
    },
    statement_descriptor: "Vytronix",
    taxes: [
      {
        type: "IVA",
        value: IVA_RATE_PERCENT,
      },
    ],
    metadata: {
      product: "landing_discount_10",
      base_price: BASE_PRICE,
      discount_rate: DISCOUNT_RATE,
      discounted_price: discountedPrice,
      iva_rate_percent: IVA_RATE_PERCENT,
      iva_amount: ivaAmount,
      total_amount: totalAmount,
    },
  };

  if (allowAutoReturn) {
    preferencePayload.auto_return = "approved";
  }

  if (MP_NOTIFICATION_URL) {
    preferencePayload.notification_url = MP_NOTIFICATION_URL;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  if (MP_INTEGRATOR_ID) {
    headers["X-Integrator-Id"] = MP_INTEGRATOR_ID;
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers,
    body: JSON.stringify(preferencePayload),
  });

  if (!response.ok) {
    let details: unknown = null;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }
    console.error("Mercado Pago preference error", details);
    return NextResponse.json({ error: "mercado_pago_error", details }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
    total: totalAmount,
    discounted: discountedPrice,
    iva: ivaAmount,
  });
}


