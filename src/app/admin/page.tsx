import { cookies } from "next/headers";
import { verifyJwt } from "@/server/auth/jwt";
import { db } from "@/server/db/client";
import { contactRequests, type ContactRequest } from "@/server/db/schema";
import { desc, sql, eq } from "drizzle-orm";
import Link from "next/link";
import CompleteButton from "@/components/CompleteButton";

type UserJwt = { email: string; name?: string; role?: string };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<UserJwt>(token);

  const stats = await db
    .select({ status: contactRequests.status, count: sql<number>`count(*)` })
    .from(contactRequests)
    .groupBy(contactRequests.status);

  let latest: ContactRequest[];
  try {
    latest = await db
      .select()
      .from(contactRequests)
      .orderBy(desc(contactRequests.createdAt))
      .limit(10);
  } catch (e) {
    const res = await db.execute(
      sql`select "id","name","email","phone","status","created_at" from "contact_requests" order by "created_at" desc limit ${10}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; name: string; email: string; phone: string; status?: string; created_at: Date }> }).rows;
    latest = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: (r.status as any) ?? "nuevo",
      createdAt: r.created_at,
      message: "",
    })) as unknown as ContactRequest[];
  }

  let completed: ContactRequest[];
  try {
    completed = await db
      .select()
      .from(contactRequests)
      .where(eq(contactRequests.status, "ganado"))
      .orderBy(desc(contactRequests.createdAt))
      .limit(20);
  } catch (e) {
    const res = await db.execute(
      sql`select "id","name","email","phone","status","created_at" from "contact_requests" where "status" = 'ganado' order by "created_at" desc limit ${20}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; name: string; email: string; phone: string; status?: string; created_at: Date }> }).rows;
    completed = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: (r.status as any) ?? "ganado",
      createdAt: r.created_at,
      message: "",
    })) as unknown as ContactRequest[];
  }

  const label = (s?: string) =>
    s === "en_proceso" ? "En proceso" : s === "ganado" ? "Ganado" : s === "perdido" ? "Perdido" : "Nuevo";

  const dotClass = (s?: string) =>
    s === "en_proceso" ? "bg-amber-500" : s === "ganado" ? "bg-emerald-500" : s === "perdido" ? "bg-rose-500" : "bg-neutral-400";

  const badgeClasses = (s?: string) => {
    switch (s) {
      case "en_proceso":
        return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
      case "ganado":
        return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
      case "perdido":
        return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200";
      default:
        return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-50 text-neutral-700 ring-1 ring-inset ring-neutral-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <p className="mt-2 text-sm text-neutral-600">Hola {user?.name || user?.email} — Rol: {user?.role}</p>

      <div className="mt-6 grid gap-6">
        <div className="p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Resumen de solicitudes</h2>
            <Link href="/admin/solicitudes" className="text-sm underline">Ver todas</Link>
          </div>
          {stats.length ? (
            <div className="mt-3 flex gap-3 flex-wrap">
              {stats.map((s) => (
                <div key={(s.status as string) || "nuevo"} className="px-3 py-2 border rounded text-sm bg-neutral-50">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${dotClass(s.status as string | undefined)}`}></span>
                  <span className="font-medium mr-2">{label(s.status as string | undefined)}</span>
                  <span className="text-neutral-600">{Number((s.count as unknown as number))}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mt-2">Aún no hay solicitudes.</p>
          )}
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Últimas 10</h2>
            <Link href="/admin/solicitudes" className="text-sm underline">Ir a solicitudes</Link>
          </div>
          {latest.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="text-left p-2 border">Nombre</th>
                    <th className="text-left p-2 border">Email</th>
                    <th className="text-left p-2 border">Teléfono</th>
                    <th className="text-left p-2 border">Estado</th>
                    <th className="text-left p-2 border">Fecha</th>
                    <th className="text-left p-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {latest.map((r) => (
                    <tr key={r.id} className="odd:bg-white even:bg-neutral-50">
                      <td className="p-2 border">{r.name}</td>
                      <td className="p-2 border">{r.email}</td>
                      <td className="p-2 border">{r.phone}</td>
                      <td className="p-2 border">
                        <span className={badgeClasses((r.status as unknown as string) ?? undefined)}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass((r.status as unknown as string) ?? undefined)}`}></span>
                          {label((r.status as unknown as string) ?? undefined)}
                        </span>
                      </td>
                      <td className="p-2 border">{r.createdAt?.toISOString?.() ?? ""}</td>
                      <td className="p-2 border"><CompleteButton id={r.id} status={r.status as unknown as string} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mt-2">No hay datos aún. Prueba el formulario de <Link className="underline" href="/#contacto">contacto</Link>.</p>
          )}
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Completados</h2>
            <Link href="/admin/solicitudes" className="text-sm underline">Gestionar</Link>
          </div>
          {completed.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="text-left p-2 border">Nombre</th>
                    <th className="text-left p-2 border">Email</th>
                    <th className="text-left p-2 border">Teléfono</th>
                    <th className="text-left p-2 border">Estado</th>
                    <th className="text-left p-2 border">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map((r) => (
                    <tr key={r.id} className="odd:bg-white even:bg-neutral-50">
                      <td className="p-2 border">{r.name}</td>
                      <td className="p-2 border">{r.email}</td>
                      <td className="p-2 border">{r.phone}</td>
                      <td className="p-2 border">
                        <span className={badgeClasses((r.status as unknown as string) ?? undefined)}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass((r.status as unknown as string) ?? undefined)}`}></span>
                          {label((r.status as unknown as string) ?? undefined)}
                        </span>
                      </td>
                      <td className="p-2 border">{r.createdAt?.toISOString?.() ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mt-2">Aún no hay completados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
