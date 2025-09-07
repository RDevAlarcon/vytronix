import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = ["/dashboard", "/admin", "/perfil"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (PROTECTED.some((p) => path.startsWith(p))) {
    const token = req.cookies.get("auth")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      if ((path.startsWith("/admin") || path.startsWith("/dashboard")) && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/perfil", req.url));
      }
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("auth");
      return res;
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/perfil/:path*"] };
