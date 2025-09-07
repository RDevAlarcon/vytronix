import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set({ name: "auth", value: "", maxAge: 0, path: "/" });
  return res;
}
