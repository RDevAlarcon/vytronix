import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { users, passwordResetTokens } from "@/server/db/schema";
import { and, eq, isNull, gt } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

const schema = z.object({ token: z.string().min(10), password: z.string().min(8).max(128) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { token, password } = parsed.data;

  const tokenHash = await sha256Hex(token);
  const now = new Date();
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, now)));

  if (!row) return NextResponse.json({ error: "invalid_or_expired" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 12);
  await db.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, row.id));

  return NextResponse.json({ ok: true });
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

