import { db } from "@/server/db/client";
import { contactRequests, type ContactRequest } from "@/server/db/schema";
import { and, desc, gte, ilike, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import StatusSelect from "@/components/StatusSelect";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SolicitudesAdminPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; from?: string; to?: string; page?: string; size?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();
  const status = (sp?.status || "").trim();
  const from = (sp?.from || "").trim();
  const to = (sp?.to || "").trim();
  const page = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
  const size = Math.min(100, Math.max(10, parseInt(sp?.size || "25", 10) || 25));
  const offset = (page - 1) * size;

  const conds: SQL[] = [];
  if (q) conds.push(ilike(contactRequests.email, `%${q}%`));
  if (status) conds.push(sql`${contactRequests.status} = ${status}`);
  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  if (fromDate && !isNaN(fromDate.getTime())) conds.push(gte(contactRequests.createdAt, fromDate));
  if (toDate && !isNaN(toDate.getTime())) conds.push(lte(contactRequests.createdAt, toDate));

  let base = db.select().from(contactRequests).$dynamic();
  const whereExpr = conds.length ? and(...conds) : undefined;
  if (whereExpr) base = base.where(whereExpr);

  const countQuery = db.select({ count: sql<number>`count(*)` }).from(contactRequests).$dynamic();
  const totalRes = whereExpr ? await countQuery.where(whereExpr) : await countQuery;
  const total = Number((totalRes[0] as unknown as { count: number }).count || 0);
  const totalPages = Math.max(1, Math.ceil(total / size));

  let items: ContactRequest[];
  try {
    items = await base
      .orderBy(desc(contactRequests.createdAt))
      .limit(size)
      .offset(offset);
  } catch (e) {
    const res = await db.execute(
      sql`select "id","name","email","phone","status","created_at" from "contact_requests" order by "created_at" desc limit ${size} offset ${offset}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; name: string; email: string; phone: string; status?: string; created_at: Date }> }).rows;
    items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: (r.status as any) ?? "nuevo",
      createdAt: r.created_at,
      message: "",
    })) as unknown as ContactRequest[];
  }

  const qs = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams({ q, status, from, to, page: String(page), size: String(size) });
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined || v === "") params.delete(k); else params.set(k, String(v));
    });
    return `?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold">Solicitudes de clientes</h1>
      <p className="text-sm text-neutral-600 mt-2">Nombre, email y telÃ©fono de personas interesadas.</p>

      <form method="GET" className="mt-6 grid gap-3 md:grid-cols-[1fr_minmax(0,180px)_repeat(2,minmax(0,180px))_auto_auto] items-end">
        <label className="text-sm">
          <div className="text-neutral-600">Buscar por email</div>
          <input name="q" defaultValue={q} className="mt-1 border p-2 rounded w-full" placeholder="cliente@correo.com" />
        </label>
        <label className="text-sm">
          <div className="text-neutral-600">Estado</div>
          <select name="status" defaultValue={status} className="mt-1 border p-2 rounded w-full">
            <option value="">Todos</option>
            <option value="nuevo">Nuevo</option>
            <option value="en_proceso">En proceso</option>
            <option value="ganado">Ganado</option>
            <option value="perdido">Perdido</option>
          </select>
        </label>
        <label className="text-sm">
          <div className="text-neutral-600">Desde</div>
          <input name="from" type="date" defaultValue={from} className="mt-1 border p-2 rounded w-full" />
        </label>
        <label className="text-sm">
          <div className="text-neutral-600">Hasta</div>
          <input name="to" type="date" defaultValue={to} className="mt-1 border p-2 rounded w-full" />
        </label>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded" type="submit">Filtrar</button>
          <Link className="px-4 py-2 border rounded" href="/admin/solicitudes">Limpiar</Link>
        </div>
        <div>
          <a className="px-4 py-2 rounded border" href={`/api/requests/export${qs({})}`}>Exportar CSV</a>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left p-2 border">Nombre</th>
              <th className="text-left p-2 border">Email</th>
              <th className="text-left p-2 border">TelÃ©fono</th>
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
                <td className="p-2 border">{r.createdAt?.toISOString?.() ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-neutral-600">PÃ¡gina {page} de {totalPages} â€¢ {total} resultados</div>
        <div className="flex gap-2">
          <Link className="px-3 py-1 border rounded" href={qs({ page: Math.max(1, page - 1) })}>Anterior</Link>
          <Link className="px-3 py-1 border rounded" href={qs({ page: Math.min(totalPages, page + 1) })}>Siguiente</Link>
        </div>
      </div>
    </div>
  );
}
