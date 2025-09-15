import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_available_in_prod" }, { status: 404 });
  }
  const hasKey = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 5);
  const from = process.env.MAIL_FROM || "";
  return NextResponse.json({ resendApiKeySet: hasKey, mailFrom: from });
}

