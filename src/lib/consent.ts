"use client";

export interface ConsentPrefs { necessary: true; analytics: boolean; marketing: boolean; ts: string }
const KEY = "nx_consent";

export function getConsent(): ConsentPrefs | null {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(KEY + "="))?.split("=")[1];
    return raw ? (JSON.parse(decodeURIComponent(raw)) as ConsentPrefs) : null;
  } catch { return null; }
}

export function setConsent(prefs: Omit<ConsentPrefs, "necessary" | "ts">) {
  const value: ConsentPrefs = { necessary: true, ...prefs, ts: new Date().toISOString() };
  document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new Event("nx-consent-change"));
}

export function hasAnalyticsConsent() {
  const c = getConsent();
  return !!c && c.analytics === true;
}
export function hasMarketingConsent() {
  const c = getConsent();
  return !!c && c.marketing === true;
}
