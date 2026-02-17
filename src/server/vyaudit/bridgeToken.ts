import { createHmac } from "node:crypto";

type BridgePayload = {
  sub?: string;
  email?: string;
  role?: string;
  roles?: string[];
  iss?: string;
  exp?: number;
};

function encodeBase64Url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function signVyAuditAdminBridgeToken(payload: Omit<BridgePayload, "role"> & { role?: string; roles?: string[] }): string {
  const secret = process.env.BRIDGE_SHARED_SECRET;
  if (!secret) {
    throw new Error("bridge_secret_not_configured");
  }

  const header = { alg: "HS256", typ: "JWT" };
  const body: BridgePayload = {
    role: payload.role ?? "admin",
    roles: payload.roles,
    sub: payload.sub,
    email: payload.email,
    iss: payload.iss,
    exp: payload.exp,
  };

  const headerPart = encodeBase64Url(Buffer.from(JSON.stringify(header), "utf8"));
  const payloadPart = encodeBase64Url(Buffer.from(JSON.stringify(body), "utf8"));
  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = createHmac("sha256", secret).update(signingInput).digest();
  const signaturePart = encodeBase64Url(signature);
  return `${signingInput}.${signaturePart}`;
}
