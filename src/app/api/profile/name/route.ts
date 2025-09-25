import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jwtVerify } from "jose";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { signJwt } from "@/server/auth/jwt";

export const runtime = "nodejs";

const phoneRegex = /^[0-9+\-\s()]+$/;

const schema = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().min(8).max(20).regex(phoneRegex)
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos. Revisa el nombre y telefono." }, { status: 400 });
  }

  const { name, phone } = parsed.data;
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedName) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }

  if (trimmedPhone.length < 8 || trimmedPhone.length > 20 || !phoneRegex.test(trimmedPhone)) {
    return NextResponse.json({ error: "Ingresa un telefono valido." }, { status: 400 });
  }

  const token = req.cookies.get("auth")?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    const v = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    payload = v.payload as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = payload.sub as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await db.update(users).set({ name: trimmedName, phone: trimmedPhone }).where(eq(users.id, userId));

  const newToken = await signJwt({
    sub: userId,
    email: payload.email,
    name: trimmedName,
    phone: trimmedPhone,
    role: payload.role
  });

  const res = NextResponse.json({ ok: true, name: trimmedName, phone: trimmedPhone });
  res.cookies.set({
    name: "auth",
    value: newToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

  return res;
}
