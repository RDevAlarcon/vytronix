import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = ["/dashboard", "/admin", "/perfil"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (PROTECTED.some((p) => path.startsWith(p))) {
    const token = req.cookies.get("auth")?.value;
    if (!token) {
      const loginPath = path.startsWith("/admin") || path.startsWith("/dashboard") ? "/acceso-admin" : "/login";
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      if ((path.startsWith("/admin") || path.startsWith("/dashboard")) && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/perfil", req.url));
      }
      return NextResponse.next();
    } catch {
      const loginPath = path.startsWith("/admin") || path.startsWith("/dashboard") ? "/acceso-admin" : "/login";
      const res = NextResponse.redirect(new URL(loginPath, req.url));
      res.cookies.delete("auth");
      return res;
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/perfil/:path*"] };
