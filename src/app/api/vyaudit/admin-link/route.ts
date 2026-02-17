import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyJwt } from "@/server/auth/jwt";
import { signVyAuditAdminBridgeToken } from "@/server/vyaudit/bridgeToken";

type UserJwt = { sub?: string; email?: string; role?: string; name?: string };

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth")?.value ?? "";
  const user = authToken ? await verifyJwt<UserJwt>(authToken) : null;

  if (!user || user.role?.toLowerCase() !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const baseUrl = process.env.VYAUDIT_BASE_URL || "http://localhost:3001";
  const issuer = process.env.BRIDGE_ISSUER;

  let bridgeToken: string;
  try {
    bridgeToken = signVyAuditAdminBridgeToken({
      sub: user.sub,
      email: user.email,
      role: "admin",
      iss: issuer,
      exp: Math.floor(Date.now() / 1000) + 5 * 60,
    });
  } catch (error) {
    console.error("[VYAUDIT] bridge token error", error);
    return NextResponse.json({ error: "bridge_not_configured" }, { status: 500 });
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const destination = `${normalizedBase}/admin/run?bridge=${encodeURIComponent(bridgeToken)}`;
  return NextResponse.redirect(destination);
}
