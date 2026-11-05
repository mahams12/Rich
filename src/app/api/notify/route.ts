import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { primaryAdminEmail } from "@/lib/firebase/config";

const ALERT_TO = "mehihamza1@gmail.com";

export async function POST(req: Request) {
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return NextResponse.json({ ok: false, reason: "mail not configured" }, { status: 200 });
  try {
    const body = (await req.json()) as { type?: string; title?: string; by?: string };
    const user = process.env.GMAIL_USER || primaryAdminEmail;
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transport.sendMail({
      from: `"NovexaHub Alerts" <${user}>`,
      to: ALERT_TO,
      subject: body.type === "customization" ? "New customization request" : "New blog submission",
      text: [
        `Type: ${body.type || "submission"}`,
        `Title: ${body.title || "-"}`,
        `From: ${body.by || "-"}`,
        `Time: ${new Date().toISOString()}`,
        "",
        "Review it in the admin panel.",
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
