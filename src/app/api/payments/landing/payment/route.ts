import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { verifyJwt } from "@/server/auth/jwt";
import { db } from "@/server/db/client";
import { landingPayments, users } from "@/server/db/schema";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL;
const MP_INTEGRATOR_ID = process.env.MP_INTEGRATOR_ID;

const BASE_PRICE = 200000; // Precio lista sin IVA (modo prueba)
const DISCOUNT_RATE = 0.1;
const IVA_RATE = 0.19;

type AuthJwt = { sub?: string };

export async function POST(request: Request) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: "missing_access_token" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value ?? "";
  const jwtUser = token ? await verifyJwt<AuthJwt>(token) : null;
  const userId = jwtUser?.sub;

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const tokenizedCard = typeof payload.token === "string" ? payload.token : null;
  const paymentMethodId = typeof payload.payment_method_id === "string" ? payload.payment_method_id : null;
  const installmentsValue = typeof payload.installments === "number" ? payload.installments : Number(payload.installments);
  const installments = Number.isFinite(installmentsValue) && installmentsValue > 0 ? Math.trunc(installmentsValue) : 1;

  const payer = typeof payload.payer === "object" && payload.payer !== null ? (payload.payer as Record<string, unknown>) : null;
  const payerEmail = typeof payer?.email === "string" ? payer.email : null;
  const payerFirstName = typeof payer?.first_name === "string" ? payer.first_name : undefined;
  const payerLastName = typeof payer?.last_name === "string" ? payer.last_name : undefined;
  const identification = typeof payer?.identification === "object" && payer.identification !== null ? (payer.identification as Record<string, unknown>) : null;
  const identificationType = typeof identification?.type === "string" ? identification.type : undefined;
  const identificationNumber = typeof identification?.number === "string" ? identification.number : undefined;

  if (!tokenizedCard || !paymentMethodId || !payerEmail) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const discountedPrice = Math.round(BASE_PRICE * (1 - DISCOUNT_RATE));
  const ivaAmount = Math.round(discountedPrice * IVA_RATE);
  const totalAmount = discountedPrice + ivaAmount;

  const payerPayload: Record<string, unknown> = { email: payerEmail };
  if (payerFirstName) {
    payerPayload.first_name = payerFirstName;
  }
  if (payerLastName) {
    payerPayload.last_name = payerLastName;
  }
  if (identificationType && identificationNumber) {
    payerPayload.identification = { type: identificationType, number: identificationNumber };
  }

  const externalReference = `landing_discount_${Date.now()}`;

  const paymentPayload: Record<string, unknown> = {
    transaction_amount: totalAmount,
    description: "Landing page Vytronix (10% OFF)",
    external_reference: externalReference,
    token: tokenizedCard,
    payment_method_id: paymentMethodId,
    installments,
    payer: payerPayload,
    metadata: {
      product: "landing_discount_10",
      base_price: BASE_PRICE,
      discount_rate: DISCOUNT_RATE,
      discounted_price: discountedPrice,
      iva_amount: ivaAmount,
      total_amount: totalAmount,
    },
  };

  if (MP_NOTIFICATION_URL) {
    paymentPayload.notification_url = MP_NOTIFICATION_URL;
  }

  const idempotencyKey = typeof payload.idempotency_key === "string" && payload.idempotency_key.length > 0
    ? payload.idempotency_key
    : `landing_payment_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "X-Idempotency-Key": idempotencyKey,
  };

  if (MP_INTEGRATOR_ID) {
    headers["X-Integrator-Id"] = MP_INTEGRATOR_ID;
  }

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers,
    body: JSON.stringify(paymentPayload),
  });

  if (!response.ok) {
    let details: unknown = null;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }
    console.error("Mercado Pago payment error", details);
    return NextResponse.json({ error: "mercado_pago_payment_error", details }, { status: 502 });
  }

  const data: Record<string, unknown> = await response.json();
  const paymentId = data.id != null ? String(data.id) : externalReference;
  const status = typeof data.status === "string" ? data.status : "unknown";
  const statusDetail = typeof data.status_detail === "string" ? data.status_detail : null;
  const transactionAmount = typeof data.transaction_amount === "number"
    ? Math.round(data.transaction_amount)
    : totalAmount;
  const currencyId = typeof data.currency_id === "string" ? data.currency_id : "CLP";
  const paymentTypeId = typeof data.payment_type_id === "string" ? data.payment_type_id : null;

  const paymentMethodFromResponse = (data.payment_method as Record<string, unknown> | undefined)?.id;
  const paymentMethod = typeof paymentMethodFromResponse === "string" ? paymentMethodFromResponse : paymentMethodId;
  const payerEmailFromResponse = (data.payer as Record<string, unknown> | undefined)?.email;

  const mpCreatedAt = typeof data.date_created === "string" ? new Date(data.date_created) : null;
  const mpApprovedAt = typeof data.date_approved === "string" ? new Date(data.date_approved) : null;

  try {
    await db.insert(landingPayments)
      .values({
        id: paymentId,
        userId,
        externalReference: typeof data.external_reference === "string" ? data.external_reference : externalReference,
        status,
        statusDetail,
        transactionAmount,
        currencyId,
        paymentMethodId: paymentMethod,
        paymentTypeId,
        payerEmail: typeof payerEmailFromResponse === "string" ? payerEmailFromResponse : payerEmail,
        mpCreatedAt,
        rawPayload: data,
      })
      .onConflictDoUpdate({
        target: landingPayments.id,
        set: {
          status,
          statusDetail,
          transactionAmount,
          currencyId,
          paymentMethodId: paymentMethod,
          paymentTypeId,
          payerEmail: typeof payerEmailFromResponse === "string" ? payerEmailFromResponse : payerEmail,
          mpCreatedAt,
          rawPayload: data,
          externalReference: typeof data.external_reference === "string" ? data.external_reference : externalReference,
        },
      });
  } catch (err) {
    console.error("landing_payments insert error", err);
  }

  if (status === "approved") {
    try {
      await db.update(users)
        .set({
          landingDiscountConsumedAt: mpApprovedAt ?? new Date(),
          landingDiscountPaymentId: paymentId,
        })
        .where(eq(users.id, userId));
    } catch (err) {
      console.error("landing discount update error", err);
    }
  }

  return NextResponse.json({
    id: paymentId,
    status,
    status_detail: statusDetail ?? undefined,
    total: transactionAmount,
  });
}


