import { cookies } from "next/headers";
import { verifyJwt } from "@/server/auth/jwt";
import { db } from "@/server/db/client";
import { contactRequests, type ContactRequest, landingPayments, users } from "@/server/db/schema";
import { desc, sql, eq } from "drizzle-orm";
import Link from "next/link";
import CompleteButton from "@/components/CompleteButton";

type UserJwt = { email: string; name?: string; role?: string };

type PaidLanding = {
  id: string;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  status: string;
  statusDetail: string | null;
  mpCreatedAt: Date | null;
  createdAt: Date | null;
  transactionAmount: number;
  currencyId: string;
};

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
  } catch {
    const res = await db.execute(
      sql`select "id","name","email","phone","status","created_at" from "contact_requests" order by "created_at" desc limit ${10}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; name: string; email: string; phone: string; status?: string; created_at: Date }> }).rows;
    latest = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: (r.status as string | undefined) ?? "nuevo",
      createdAt: r.created_at,
      message: "",
    })) as unknown as ContactRequest[];
  }

  let paidLandings: PaidLanding[];
  try {
    paidLandings = await db
      .select({
        id: landingPayments.id,
        status: landingPayments.status,
        statusDetail: landingPayments.statusDetail,
        transactionAmount: landingPayments.transactionAmount,
        currencyId: landingPayments.currencyId,
        mpCreatedAt: landingPayments.mpCreatedAt,
        createdAt: landingPayments.createdAt,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
      })
      .from(landingPayments)
      .innerJoin(users, eq(users.id, landingPayments.userId))
      .where(eq(landingPayments.status, "approved"))
      .orderBy(desc(landingPayments.mpCreatedAt), desc(landingPayments.createdAt))
      .limit(20);
  } catch {
    const res = await db.execute(
      sql`select lp."id", lp."status", lp."status_detail", lp."transaction_amount", lp."currency_id", lp."mp_created_at", lp."created_at", u."name" as user_name, u."email" as user_email, u."phone" as user_phone from "landing_payments" lp join "users" u on u."id" = lp."user_id" where lp."status" = 'approved' order by coalesce(lp."mp_created_at", lp."created_at") desc limit ${20}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; status: string; status_detail: string | null; transaction_amount: number; currency_id: string; mp_created_at: Date | null; created_at: Date | null; user_name: string | null; user_email: string | null; user_phone: string | null }> }).rows;
    paidLandings = rows.map((row) => ({
      id: row.id,
      status: row.status,
      statusDetail: row.status_detail,
      transactionAmount: row.transaction_amount,
      currencyId: row.currency_id,
      mpCreatedAt: row.mp_created_at,
      createdAt: row.created_at,
      userName: row.user_name,
      userEmail: row.user_email,
      userPhone: row.user_phone,
    }));
  }

  let completed: ContactRequest[];
  try {
    completed = await db
      .select()
      .from(contactRequests)
      .where(eq(contactRequests.status, "ganado"))
      .orderBy(desc(contactRequests.createdAt))
      .limit(20);
  } catch {
    const res = await db.execute(
      sql`select "id","name","email","phone","status","created_at" from "contact_requests" where "status" = 'ganado' order by "created_at" desc limit ${20}`
    );
    const rows = (res as unknown as { rows: Array<{ id: string; name: string; email: string; phone: string; status?: string; created_at: Date }> }).rows;
    completed = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: (r.status as string | undefined) ?? "ganado",
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

  const fmt = (d?: unknown) => {
    try {
      let date: Date | null = null;
      if (d instanceof Date) date = d;
      else if (typeof d === "string" || typeof d === "number") date = new Date(d);
      else return "";
      if (isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    } catch {
      return "";
    }
  };

  const fmtYmd = (value?: unknown) => {
    try {
      let date: Date | null = null;
      if (value instanceof Date) date = value;
      else if (typeof value === "string" || typeof value === "number") date = new Date(value);
      else return "";
      if (!date || isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const formatAmount = (value: unknown, currency = "CLP") => {
    if (typeof value !== "number") {
      return "";
    }
    try {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${value} ${currency}`;
    }
  };

  const paymentStatusLabel = (status?: string | null) => {
    if (!status) return "";
    switch (status) {
      case "approved":
        return "Aprobado";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazado";
      case "in_process":
        return "En proceso";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <p className="mt-2 text-sm text-neutral-600">Hola {user?.name || user?.email} - Rol: {user?.role}</p>

      <div className="mt-4 p-4 border rounded-lg bg-white flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Acceso rápido a VyAudit</h2>
          <p className="text-sm text-neutral-600">Abre la plataforma de auditoría para ejecutar análisis como administrador.</p>
        </div>
        <a
          href="/api/vyaudit/admin-link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ir a VyAudit
        </a>
      </div>

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
            <h2 className="font-semibold">Últimas 10 Solicitudes</h2>
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
                      <td className="p-2 border">{fmt(r.createdAt)}</td>
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
            <h2 className="font-semibold">Solicitudes Completadas</h2>
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
                      <td className="p-2 border">{fmt(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mt-2">Aún no hay completados.</p>
          )}
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Landings pagadas</h2>
          </div>
          {paidLandings.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="text-left p-2 border">Nombre</th>
                    <th className="text-left p-2 border">Email</th>
                    <th className="text-left p-2 border">Teléfono</th>
                    <th className="text-left p-2 border">Estado</th>
                    <th className="text-left p-2 border">Fecha de pago</th>
                    <th className="text-left p-2 border">Monto pagado</th>
                  </tr>
                </thead>
                <tbody>
                  {paidLandings.map((payment) => (
                    <tr key={payment.id} className="odd:bg-white even:bg-neutral-50">
                      <td className="p-2 border">{payment.userName ?? "Sin nombre"}</td>
                      <td className="p-2 border">{payment.userEmail ?? "Sin email"}</td>
                      <td className="p-2 border">{payment.userPhone ?? "Sin teléfono"}</td>
                      <td className="p-2 border">
                        <div className="font-medium">{paymentStatusLabel(payment.status)}</div>
                        {payment.statusDetail ? (
                          <div className="text-xs text-neutral-500">{payment.statusDetail}</div>
                        ) : null}
                      </td>
                      <td className="p-2 border">{fmtYmd(payment.mpCreatedAt ?? payment.createdAt)}</td>
                      <td className="p-2 border">{formatAmount(payment.transactionAmount, payment.currencyId ?? "CLP")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mt-2">Aún no hay pagos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };








