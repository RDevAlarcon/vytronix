import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { verifyJwt } from "@/server/auth/jwt";
import { db } from "@/server/db/client";
import { contactRequests } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["nuevo", "en_proceso", "ganado", "perdido"])
});

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<{ role?: string }>(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { status } = parsed.data;
  const { id } = await ctx.params;
  await db.update(contactRequests).set({ status }).where(eq(contactRequests.id, id));

  return NextResponse.json({ ok: true, status });
}
