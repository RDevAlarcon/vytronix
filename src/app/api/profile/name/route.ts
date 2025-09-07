import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jwtVerify } from "jose";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { signJwt } from "@/server/auth/jwt";

export const runtime = "nodejs";

const schema = z.object({ name: z.string().min(1).max(80) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { name } = parsed.data;

  const token = req.cookies.get("auth")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let payload: Record<string, unknown>;
  try {
    const v = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    payload = v.payload as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = payload.sub as string | undefined;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await db.update(users).set({ name }).where(eq(users.id, userId));

  const newToken = await signJwt({
    sub: userId,
    email: payload.email,
    name,
    role: payload.role
  });

  const res = NextResponse.json({ ok: true, name });
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
