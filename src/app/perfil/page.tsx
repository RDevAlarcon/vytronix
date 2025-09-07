import { cookies } from "next/headers";
import { verifyJwt } from "@/server/auth/jwt";
import ProfileNameForm from "./ProfileNameForm";

type UserJwt = { email: string; name?: string; role?: string };

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value || "";
  const user = await verifyJwt<UserJwt>(token);
  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>
      {user?.role === "admin" && (
        <p className="mt-2 text-sm text-neutral-600">Rol: admin</p>
      )}

      <div className="mt-6 p-6 rounded-2xl border bg-white shadow-sm grid md:grid-cols-[120px_1fr] gap-6 items-center">
        <div className="w-24 h-24 rounded-full bg-neutral-200 border flex items-center justify-center text-neutral-700 font-semibold">
          {initials}
        </div>
        <div className="grid gap-2">
          <ProfileNameForm initialName={user?.name} email={user?.email || ""} />
          <p className="text-xs text-neutral-500 mt-2">Próximamente podrás subir tu foto.</p>
        </div>
      </div>
    </div>
  );
}
