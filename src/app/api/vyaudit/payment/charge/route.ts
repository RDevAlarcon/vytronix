import { NextResponse } from "next/server";

import { verifyCheckoutState } from "@/server/vyaudit/checkoutState";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL;
const MP_INTEGRATOR_ID = process.env.MP_INTEGRATOR_ID;
const PRICE_CLP = Number(process.env.VYAUDIT_PRICE_CLP ?? 29990);

function normalizeDomain(value: string): string {
  const raw = value.trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(withProtocol);
  return parsed.hostname.replace(/^www\./i, "").toLowerCase();
}

export async function POST(request: Request) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: "missing_access_token" }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const state = typeof payload.state === "string" ? payload.state : "";
  const stateCheck = verifyCheckoutState(state);
  if (!stateCheck.ok) {
    return NextResponse.json({ error: "invalid_state", detail: stateCheck.reason }, { status: 400 });
  }

  const tokenizedCard = typeof payload.token === "string" ? payload.token : null;
  const paymentMethodId = typeof payload.payment_method_id === "string" ? payload.payment_method_id : null;
  const installmentsValue = typeof payload.installments === "number" ? payload.installments : Number(payload.installments);
  const installments = Number.isFinite(installmentsValue) && installmentsValue > 0 ? Math.trunc(installmentsValue) : 1;

  const payer = typeof payload.payer === "object" && payload.payer !== null ? (payload.payer as Record<string, unknown>) : null;
  const payerEmail = typeof payer?.email === "string" ? payer.email.trim().toLowerCase() : "";

  if (!tokenizedCard || !paymentMethodId || !payerEmail) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const stateEmail = (stateCheck.payload.email || "").trim().toLowerCase();
  if (stateEmail && stateEmail !== payerEmail) {
    return NextResponse.json({ error: "payer_email_mismatch" }, { status: 400 });
  }

  const stateDomain = (stateCheck.payload.domain || "").trim().toLowerCase();
  if (!stateDomain) {
    return NextResponse.json({ error: "state_domain_missing" }, { status: 400 });
  }

  const bodyDomain = typeof payload.domain === "string" ? payload.domain : "";
  if (bodyDomain) {
    try {
      const normalizedBodyDomain = normalizeDomain(bodyDomain);
      if (normalizedBodyDomain !== stateDomain) {
        return NextResponse.json({ error: "domain_mismatch" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "invalid_domain" }, { status: 400 });
    }
  }

  const payerPayload: Record<string, unknown> = { email: payerEmail };
  const firstName = typeof payer?.first_name === "string" ? payer.first_name : undefined;
  const lastName = typeof payer?.last_name === "string" ? payer.last_name : undefined;
  const identification = typeof payer?.identification === "object" && payer.identification !== null
    ? (payer.identification as Record<string, unknown>)
    : null;
  const identificationType = typeof identification?.type === "string" ? identification.type : undefined;
  const identificationNumber = typeof identification?.number === "string" ? identification.number : undefined;

  if (firstName) payerPayload.first_name = firstName;
  if (lastName) payerPayload.last_name = lastName;
  if (identificationType && identificationNumber) {
    payerPayload.identification = { type: identificationType, number: identificationNumber };
  }

  const externalReference = `vyaudit_${stateCheck.payload.nonce}`;

  const paymentPayload: Record<string, unknown> = {
    transaction_amount: PRICE_CLP,
    description: `VyAudit - Auditoria web (${stateDomain})`,
    external_reference: externalReference,
    token: tokenizedCard,
    payment_method_id: paymentMethodId,
    installments,
    payer: payerPayload,
    metadata: {
      product: "vyaudit_single_report",
      domain: stateDomain,
      email: payerEmail,
      nonce: stateCheck.payload.nonce,
    },
  };

  if (MP_NOTIFICATION_URL) {
    paymentPayload.notification_url = MP_NOTIFICATION_URL;
  }

  const idempotencyKey =
    typeof payload.idempotency_key === "string" && payload.idempotency_key.length > 0
      ? payload.idempotency_key
      : `vya_${Date.now()}_${Math.random().toString(36).slice(2)}`;

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
    return NextResponse.json({ error: "mercado_pago_payment_error", details }, { status: 502 });
  }

  const data = (await response.json()) as Record<string, unknown>;

  return NextResponse.json({
    id: data.id,
    status: data.status,
    status_detail: data.status_detail,
    external_reference: data.external_reference,
    amount: data.transaction_amount,
    currency_id: data.currency_id,
  });
}