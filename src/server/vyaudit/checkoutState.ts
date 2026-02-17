import { createHmac, timingSafeEqual } from "node:crypto";

type CheckoutPayload = {
  email?: string;
  domain?: string;
  nonce: string;
  exp: number;
  mode?: "direct" | "manual";
};

function encodeBase64Url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64").toString("utf8");
}

function getSecret(): string {
  return process.env.VYAUDIT_CHECKOUT_SECRET || process.env.JWT_SECRET || "";
}

export function signCheckoutState(payload: CheckoutPayload): string {
  const secret = getSecret();
  if (!secret) {
    throw new Error("missing_checkout_secret");
  }

  const header = { alg: "HS256", typ: "JWT" };
  const headerPart = encodeBase64Url(Buffer.from(JSON.stringify(header), "utf8"));
  const payloadPart = encodeBase64Url(Buffer.from(JSON.stringify(payload), "utf8"));
  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = createHmac("sha256", secret).update(signingInput).digest();
  const signaturePart = encodeBase64Url(signature);
  return `${signingInput}.${signaturePart}`;
}

export function verifyCheckoutState(token: string):
  | { ok: true; payload: CheckoutPayload }
  | { ok: false; reason: string } {
  const secret = getSecret();
  if (!secret) {
    return { ok: false, reason: "missing_checkout_secret" };
  }

  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { ok: false, reason: "invalid_format" };
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const signingInput = `${headerPart}.${payloadPart}`;
  const expected = createHmac("sha256", secret).update(signingInput).digest();
  const received = Buffer.from(signaturePart.replace(/-/g, "+").replace(/_/g, "/"), "base64");

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return { ok: false, reason: "bad_signature" };
  }

  try {
    const payload = JSON.parse(decodeBase64Url(payloadPart)) as CheckoutPayload;

    if (!payload.nonce || typeof payload.exp !== "number") {
      return { ok: false, reason: "invalid_payload" };
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { ok: false, reason: "expired" };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }
}
