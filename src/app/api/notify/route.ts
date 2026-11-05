import { NextResponse } from "next/server";
import { site } from "@/data/site";

const ALERT_TO = "mehihamza1@gmail.com";

// nodemailer can't run on Workers (raw SMTP sockets are unavailable) —
// send through the Brevo HTTP API instead. Set BREVO_API_KEY as a worker secret.
export async function POST(req: Request) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, reason: "BREVO_API_KEY not set" }, { status: 200 });
  try {
    const body = (await req.json()) as { type?: string; title?: string; by?: string };
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: "NovexaHub Alerts", email: site.email },
        to: [{ email: ALERT_TO }],
        subject: body.type === "customization" ? "New customization request" : "New blog submission",
        textContent: [
          `Type: ${body.type || "submission"}`,
          `Title: ${body.title || "-"}`,
          `From: ${body.by || "-"}`,
          `Time: ${new Date().toISOString()}`,
          "",
          "Review it in the admin panel.",
        ].join("\n"),
      }),
    });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
