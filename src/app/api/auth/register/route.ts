import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(80),
  password: z.string().min(8).max(128),
  acceptedPolicies: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return NextResponse.json(
      { error: "invalid", details: { fieldErrors: flattened.fieldErrors, formErrors: flattened.formErrors } },
      { status: 400 }
    );
  }
  const { email, name, password } = parsed.data;

  const [exists] = await db.select().from(users).where(eq(users.email, email));
  if (exists) {
    return NextResponse.json(
      { error: "email_in_use", details: { fieldErrors: { email: ["El email ya está en uso"] } } },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();
  await db.insert(users).values({ id, email, name, passwordHash, acceptedPolicies: true });

  return NextResponse.json({ ok: true });
}
