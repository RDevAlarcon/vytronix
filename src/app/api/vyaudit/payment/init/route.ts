import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { signCheckoutState } from "@/server/vyaudit/checkoutState";

const schema = z.object({
  domain: z.string().min(3),
  email: z.string().email(),
});

const PRICE_CLP = Number(process.env.VYAUDIT_PRICE_CLP ?? 29990);

function normalizeDomain(value: string): string {
  const raw = value.trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(withProtocol);
  return parsed.hostname.replace(/^www\./i, "").toLowerCase();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let domain: string;
  try {
    domain = normalizeDomain(parsed.data.domain);
  } catch {
    return NextResponse.json({ error: "invalid_domain" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const nonce = randomUUID();

  const state = signCheckoutState({
    email,
    domain,
    nonce,
    exp: Math.floor(Date.now() / 1000) + 20 * 60,
    mode: "manual",
  });

  return NextResponse.json({
    amount: PRICE_CLP,
    domain,
    email,
    state,
  });
}