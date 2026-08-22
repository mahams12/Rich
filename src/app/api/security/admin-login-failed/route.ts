import { NextResponse } from "next/server";
import { primaryAdminEmail } from "@/lib/firebase/config";
import { sendAdminLoginFailedAlert } from "@/lib/security/sendAlertEmail";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_IP) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  let attemptedEmail = "";
  try {
    const body = (await request.json()) as { attemptedEmail?: string };
    attemptedEmail = String(body.attemptedEmail || "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  if (!attemptedEmail || attemptedEmail.length > 320) {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") || undefined;
  const result = await sendAdminLoginFailedAlert({ attemptedEmail, ip, userAgent });

  return NextResponse.json({
    ok: true,
    emailed: result.sent,
    provider: result.provider,
    to: primaryAdminEmail,
  });
}
