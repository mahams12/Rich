import { NextResponse } from "next/server";
import { isBot, isDataCenterAsn, parseUa, type AnalyticsEvent } from "@/lib/analytics";

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "novexa-4876f";
const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/analyticsEvents`;

interface CfLike { city?: string; country?: string; asn?: number; [k: string]: unknown }

async function geo(req: Request): Promise<Partial<CfLike>> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = await mod.getCloudflareContext({ async: true });
    const cf = (ctx as unknown as { cf?: CfLike }).cf || (req as unknown as { cf?: CfLike }).cf || {};
    return { city: cf.city, country: cf.country, asn: cf.asn };
  } catch {
    const country = req.headers.get("cf-ipcountry") || undefined;
    return { country };
  }
}

async function hashIp(ip: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + ":nx-a"));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fsFields(e: AnalyticsEvent) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(e)) {
    if (v === undefined) continue;
    if (typeof v === "string") out[k] = { stringValue: v.slice(0, 500) };
    else if (typeof v === "number") out[k] = { integerValue: v };
    else if (typeof v === "boolean") out[k] = { booleanValue: v };
  }
  return { fields: out };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AnalyticsEvent>;
    if (!body.kind || !body.vid || !body.sid || !body.path || typeof body.path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (!["pageview", "heartbeat", "conversion"].includes(body.kind) || body.path.length > 400) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const ua = req.headers.get("user-agent") || "";
    if (isBot(ua)) return NextResponse.json({ ok: true, skipped: "bot" });

    const { device, os, browser } = parseUa(ua);
    const g = await geo(req);
    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "";
    const event: AnalyticsEvent = {
      kind: body.kind,
      vid: String(body.vid).slice(0, 64),
      sid: String(body.sid).slice(0, 64),
      path: body.path,
      title: body.title?.slice(0, 200),
      referrer: body.referrer?.slice(0, 400),
      source: body.source?.slice(0, 80), medium: body.medium?.slice(0, 80),
      campaign: body.campaign?.slice(0, 120), term: body.term?.slice(0, 120), content: body.content?.slice(0, 120),
      fbclid: !!body.fbclid, gclid: !!body.gclid,
      cType: body.cType?.slice(0, 40), seconds: typeof body.seconds === "number" ? Math.min(body.seconds, 86400) : undefined,
      device, os, browser,
      country: g.country, city: g.city, asn: g.asn,
      dataCenter: isDataCenterAsn(g.asn),
      ipHash: ip ? await hashIp(ip) : undefined,
      createdAt: new Date().toISOString(),
    };
    const res = await fetch(FS, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fsFields(event)) });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
