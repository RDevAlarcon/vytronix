import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendPasswordResetEmail } from "@/server/email/mailer";

export const runtime = "nodejs";

const schema = z.object({ to: z.string().email() });

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_available_in_prod" }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { to } = parsed.data;
  const link = new URL("/reset", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").toString();
  const res = await sendPasswordResetEmail(to, link);
  if (!res.ok) return NextResponse.json({ ok: false, error: String(res.error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

