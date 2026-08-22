import { site } from "@/data/site";

export function whatsappUrl(text?: string) {
  const message = text ?? `Hi ${site.name}, I want to talk about a project.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject?: string, body?: string) {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  const query = parts.length ? `?${parts.join("&")}` : "";
  return `mailto:${site.email}${query}`;
}

/** Gmail web compose — works even when no desktop mail app is installed. */
export function gmailComposeUrl(subject?: string, body?: string) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: site.email });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Opens Gmail compose to novexahub.net@gmail.com (reliable in the browser). */
export function openMailClient(subject?: string, body?: string) {
  if (typeof window === "undefined") return;
  window.open(gmailComposeUrl(subject, body), "_blank", "noopener,noreferrer");
}

export function enquireMessage(title: string, extra?: string) {
  const lines = [`Hi ${site.name}, I want to purchase or customize: ${title}.`];
  if (extra?.trim()) lines.push("", extra.trim());
  return lines.join("\n");
}
