import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db/client";
import { contactRequests } from "@/server/db/schema";
import { rateLimit } from "@/server/utils/rate-limit";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20).regex(/^[+\d().\-\s]+$/i, "Formato de teléfono inválido"),
  message: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)").max(1000, "Máximo 1000 caracteres"),
  acceptedPolicies: z
    .boolean()
    .refine((value) => value === true, { message: "Debes aceptar la política de privacidad" }),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return NextResponse.json(
      { error: "invalid", details: { fieldErrors: flattened.fieldErrors } },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = parsed.data;

  // Rate limit: 5 por 10 minutos por IP/email
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown";
  const WINDOW = 10 * 60 * 1000;
  const MAX = 5;
  const rl1 = rateLimit(`req:ip:${ip}`, WINDOW, MAX);
  const rl2 = rateLimit(`req:email:${email}`, WINDOW, MAX);
  if (!rl1.ok || !rl2.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const id = crypto.randomUUID();
  try {
    await db.insert(contactRequests).values({ id, name, email, phone, message, acceptedPolicies: true });
  } catch {
    // Fallback si la columna message aún no existe en la base
    await db.execute(sql`insert into "contact_requests" ("id","name","email","phone","accepted_policies") values (${id}, ${name}, ${email}, ${phone}, ${true})`);
  }

  return NextResponse.json({ ok: true });
}
