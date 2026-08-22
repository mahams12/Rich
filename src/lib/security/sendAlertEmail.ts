import nodemailer from "nodemailer";
import { primaryAdminEmail } from "@/lib/firebase/config";
import { site } from "@/data/site";

export type AdminLoginFailedAlert = {
  attemptedEmail: string;
  ip?: string;
  userAgent?: string;
};

function alertBody(input: AdminLoginFailedAlert) {
  const when = new Date().toISOString();
  return [
    "NovexaHub admin security alert",
    "",
    "Someone failed to sign in to the admin panel.",
    "",
    `Time: ${when}`,
    `Attempted email: ${input.attemptedEmail}`,
    input.ip ? `IP: ${input.ip}` : null,
    input.userAgent ? `Browser: ${input.userAgent}` : null,
    "",
    "If this was not you, change your admin password in Firebase Authentication.",
    "",
    site.adminUrl,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendViaGmail(input: AdminLoginFailedAlert) {
  const user = process.env.GMAIL_USER || primaryAdminEmail;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return false;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `"NovexaHub Security" <${user}>`,
    to: primaryAdminEmail,
    subject: "Security alert: failed admin login attempt",
    text: alertBody(input),
  });
  return true;
}

async function sendViaResend(input: AdminLoginFailedAlert) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.SECURITY_ALERT_FROM || "NovexaHub Security <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [primaryAdminEmail],
      subject: "Security alert: failed admin login attempt",
      text: alertBody(input),
    }),
  });

  return response.ok;
}

export async function sendAdminLoginFailedAlert(input: AdminLoginFailedAlert) {
  if (await sendViaGmail(input)) return { sent: true, provider: "gmail" as const };
  if (await sendViaResend(input)) return { sent: true, provider: "resend" as const };
  return { sent: false, provider: null };
}
