import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { contactRequests } from "@/server/db/schema";
import { and, desc, gte, ilike, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import type { ContactRequest } from "@/server/db/schema";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const status = (searchParams.get("status") || "").trim();
  const from = (searchParams.get("from") || "").trim();
  const to = (searchParams.get("to") || "").trim();

  const conds: SQL[] = [];
  if (q) conds.push(ilike(contactRequests.email, `%${q}%`));
  if (status) conds.push(sql`${contactRequests.status} = ${status}`);
  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  if (fromDate && !isNaN(fromDate.getTime())) conds.push(gte(contactRequests.createdAt, fromDate));
  if (toDate && !isNaN(toDate.getTime())) conds.push(lte(contactRequests.createdAt, toDate));

  let rows: ContactRequest[];
  try {
    let query = db.select().from(contactRequests).$dynamic();
    if (conds.length) query = query.where(and(...conds));
    rows = await query.orderBy(desc(contactRequests.createdAt));
  } catch (e) {
    // Fallback si falta la columna message
    const base = sql`select "id","name","email","phone","status","created_at" from "contact_requests"`;
    const whereParts: SQL[] = [];
    if (q) whereParts.push(sql`"email" ilike ${"%" + q + "%"}`);
    if (status) whereParts.push(sql`"status" = ${status}`);
    if (fromDate && !isNaN(fromDate.getTime())) whereParts.push(sql`"created_at" >= ${fromDate}`);
    if (toDate && !isNaN(toDate.getTime())) whereParts.push(sql`"created_at" <= ${toDate}`);
    const whereSql = whereParts.length ? sql` where ${sql.join(whereParts, sql` and `)}` : sql``;
    const res = await db.execute(sql`${base}${whereSql} order by "created_at" desc`);
    const raw = (res as unknown as { rows: Array<{ id:string; name:string; email:string; phone:string; status?: string; created_at: Date }> }).rows;
    rows = raw.map((r) => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, status: (r.status as any) ?? "nuevo", createdAt: r.created_at, message: "" })) as unknown as ContactRequest[];
  }

  const header = ["id","name","email","phone","message","status","created_at"].join(",");
  const lines = rows.map((r: ContactRequest) => [
    r.id,
    escapeCsv(r.name ?? ""),
    escapeCsv(r.email ?? ""),
    escapeCsv(r.phone ?? ""),
    escapeCsv((r as unknown as { message?: string }).message ?? ""),
    (r as unknown as { status?: string }).status ?? "",
    r.createdAt ? formatDate(new Date(r.createdAt as unknown as Date)) : ""
  ].join(","));
  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=solicitudes.csv"
    }
  });
}

function escapeCsv(v: string) {
  if (v.includes(",") || v.includes("\n") || v.includes('"')) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
