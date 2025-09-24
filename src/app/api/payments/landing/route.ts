import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

const BASE_PRICE = 40000; // Precio lista sin IVA (modo prueba)
const DISCOUNT_RATE = 0.1;
const IVA_RATE = 0.19;

export async function POST() {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: "missing_access_token" }, { status: 500 });
  }

  const discountedPrice = Math.round(BASE_PRICE * (1 - DISCOUNT_RATE));
  const ivaAmount = Math.round(discountedPrice * IVA_RATE);
  const totalAmount = discountedPrice + ivaAmount;

  const preferencePayload = {
    items: [
      {
        title: "Landing page Vytronix (10% OFF)",
        description: "Precio base $200.000 CLP - 10% descuento + IVA 19%",
        quantity: 1,
        currency_id: "CLP",
        unit_price: totalAmount,
      },
    ],
    taxes: [
      {
        type: "IVA",
        value: ivaAmount,
      },
    ],
    back_urls: {
      success: `${SITE_URL}/perfil?status=success`,
      pending: `${SITE_URL}/perfil?status=pending`,
      failure: `${SITE_URL}/perfil?status=failure`,
    },
    payment_methods: {
      installments: 1,
      default_installments: 1,
      excluded_payment_types: [],
      excluded_payment_methods: [],
      default_payment_method_id: null,
      default_payment_type_id: null,
    },
    statement_descriptor: "Vytronix",
    metadata: {
      product: "landing_discount_10",
      base_price: BASE_PRICE,
      discount_rate: DISCOUNT_RATE,
      discounted_price: discountedPrice,
      iva_amount: ivaAmount,
      total_amount: totalAmount,
    },
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferencePayload),
  });

  if (!response.ok) {
    let details: unknown = null;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }
    return NextResponse.json({ error: "mercado_pago_error", details }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point, total: totalAmount, discounted: discountedPrice, iva: ivaAmount });
}


