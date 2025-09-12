import { cookies } from "next/headers";
import { verifyJwt } from "@/server/auth/jwt";
import { db } from "@/server/db/client";
import { contactRequests, type ContactRequest } from "@/server/db/schema";
import { and, desc, gte, ilike, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import StatusSelect from "@/components/StatusSelect";

export default async function Dashboard({
  searchParams
}: {
  searchParams: Promise<{ q?: string; from?: string; to?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<{ email: string; name?: string }>(token);

  const sp = await searchParams;
  const q = (sp?.q || "").trim();
  const from = (sp?.from || "").trim();
  const to = (sp?.to || "").trim();

  const conds: SQL[] = [];
  if (q) conds.push(ilike(contactRequests.email, `%${q}%`));
  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  if (fromDate && !isNaN(fromDate.getTime())) conds.push(gte(contactRequests.createdAt, fromDate));
  if (toDate && !isNaN(toDate.getTime())) conds.push(lte(contactRequests.createdAt, toDate));

  let query = db.select().from(contactRequests).$dynamic();
  if (conds.length) {
    query = query.where(and(...conds));
  }
  let items: ContactRequest[];
  try {
    items = await query.orderBy(desc(contactRequests.createdAt)).limit(50);
  } catch (e: unknown) {
    // Fallback si columnas nuevas (status/message) aún no existen
    const res = await db.execute(
      sql`select "id", "name", "email", "phone", "created_at" from "contact_requests" order by "created_at" desc limit ${50}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; name: string; email: string; phone: string; created_at: Date }> }).rows;
    items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      createdAt: r.created_at,
      // defaults mientras no existan las columnas en DB
      status: "nuevo",
      message: "",
    })) as ContactRequest[];
  }

  const fmt = (d?: unknown) => {
    try {
      const date = d instanceof Date ? d : new Date(d as any);
      if (isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    } catch {
      return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">Bienvenido {user?.name || user?.email}</p>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Solicitudes de contacto</h2>
          <a href="/admin/solicitudes" className="text-sm underline">Ver todo</a>
        </div>

        <form method="GET" className="mt-4 grid gap-3 md:grid-cols-[1fr_repeat(2,minmax(0,200px))_auto] items-end">
          <label className="text-sm">
            <div className="text-neutral-600">Buscar por email</div>
            <input name="q" defaultValue={q} className="mt-1 border p-2 rounded w-full" placeholder="cliente@correo.com" />
          </label>
          <label className="text-sm">
            <div className="text-neutral-600">Desde</div>
            <input name="from" defaultValue={from} type="date" className="mt-1 border p-2 rounded w-full" />
          </label>
          <label className="text-sm">
            <div className="text-neutral-600">Hasta</div>
            <input name="to" defaultValue={to} type="date" className="mt-1 border p-2 rounded w-full" />
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded" type="submit">Filtrar</button>
            <a className="px-4 py-2 border rounded" href="/dashboard">Limpiar</a>
          </div>
        </form>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left p-2 border">Nombre</th>
                <th className="text-left p-2 border">Email</th>
                <th className="text-left p-2 border">Teléfono</th>
                <th className="text-left p-2 border">Mensaje</th>
                <th className="text-left p-2 border">Estado</th>
                <th className="text-left p-2 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-neutral-50">
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.email}</td>
                  <td className="p-2 border">{r.phone}</td>
                  <td className="p-2 border max-w-[280px]">
                    <span title={(r as any).message} className="line-clamp-2 block">{(r as any).message}</span>
                  </td>
                  <td className="p-2 border"><StatusSelect id={r.id} value={r.status} /></td>
                  <td className="p-2 border">{fmt(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
