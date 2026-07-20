import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getClientIp, rateLimit } from "@/server/utils/rate-limit";

const PROTECTED = ["/dashboard", "/admin", "/perfil"];
const PUBLIC_PAGE_RATE_WINDOW = 60 * 1000;
const PUBLIC_PAGE_RATE_MAX = 90;
const BAD_USER_AGENT =
  /(ahrefsbot|semrushbot|mj12bot|dotbot|blexbot|dataforseobot|bytespider|petalbot|scrapy|python-requests|curl|wget|httpclient|libwww-perl)/i;
const STATIC_FILE = /\.(?:avif|css|gif|ico|jpg|jpeg|js|map|png|svg|txt|webp|woff2?)$/i;

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedPath = PROTECTED.some((p) => path.startsWith(p));

  if (!isProtectedPath && isPublicPageRequest(req)) {
    const userAgent = req.headers.get("user-agent") || "";
    if (BAD_USER_AGENT.test(userAgent)) {
      return new NextResponse("Forbidden", {
        status: 403,
        headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
      });
    }

    const ip = getClientIp(req.headers);
    const gate = rateLimit(`public:${ip}`, PUBLIC_PAGE_RATE_WINDOW, PUBLIC_PAGE_RATE_MAX);
    if (!gate.ok) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(gate.retryAfterMs / 1000)),
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      });
    }
  }

  if (isProtectedPath) {
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

function isPublicPageRequest(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  if (path.startsWith("/api/") || path.startsWith("/_next/") || path === "/favicon.ico") return false;
  if (STATIC_FILE.test(path)) return false;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html") || accept === "*/*" || accept === "";
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)"],
};
