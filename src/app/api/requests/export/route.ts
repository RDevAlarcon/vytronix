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

  let query = db.select().from(contactRequests).$dynamic();
  if (conds.length) query = query.where(and(...conds));
  const rows: ContactRequest[] = await query.orderBy(desc(contactRequests.createdAt));

  const header = ["id","name","email","phone","status","created_at"].join(",");
  const lines = rows.map((r: ContactRequest) => [
    r.id,
    escapeCsv(r.name ?? ""),
    escapeCsv(r.email ?? ""),
    escapeCsv(r.phone ?? ""),
    (r as unknown as { status?: string }).status ?? "",
    r.createdAt ? new Date(r.createdAt as unknown as Date).toISOString() : ""
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
