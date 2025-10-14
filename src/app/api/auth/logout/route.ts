import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FALLBACK_BASE =
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://vytronix.cl";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");

  let redirectUrl: URL;
  try {
    const base =
      origin && origin.startsWith("http")
        ? origin
        : host
          ? `${proto}://${host}`
          : FALLBACK_BASE;
    redirectUrl = new URL("/", base);
  } catch {
    redirectUrl = new URL("/", FALLBACK_BASE);
  }

  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set({ name: "auth", value: "", maxAge: 0, path: "/" });
  return res;
}
