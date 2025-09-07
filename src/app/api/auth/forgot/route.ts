import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { users, passwordResetTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { rateLimit } from "@/server/utils/rate-limit";
import { sendPasswordResetEmail } from "@/server/email/mailer";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: true }); // no revelar detalles
  }

  const { email } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Rate limiting por IP y por email: 5 reqs / 15 min
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown";
  const keyIp = `forgot:ip:${ip}`;
  const keyEmail = `forgot:email:${email}`;
  const WINDOW = 15 * 60 * 1000;
  const MAX = 5;
  const rl1 = rateLimit(keyIp, WINDOW, MAX);
  const rl2 = rateLimit(keyEmail, WINDOW, MAX);
  if (!rl1.ok || !rl2.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // Siempre responder OK por razones de seguridad
  const res = NextResponse.json({ ok: true });

  if (!user) return res;

  // Generar token y guardar hash
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const tokenHash = await sha256Hex(token);
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
  await db.insert(passwordResetTokens).values({ id, userId: user.id, tokenHash, expiresAt });

  const url = new URL("/reset", req.url);
  url.searchParams.set("token", token);
  await sendPasswordResetEmail(email, url.toString());

  return res;
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}
