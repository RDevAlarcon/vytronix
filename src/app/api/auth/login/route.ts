import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signJwt } from "@/server/auth/jwt";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { email, password } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return NextResponse.json({ error: "bad_credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "bad_credentials" }, { status: 401 });

  const token = await signJwt({ sub: user.id, email: user.email, name: user.name, role: user.role });
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set({
    name: "auth",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
  return res;
}
