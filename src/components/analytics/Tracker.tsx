"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { hasAnalyticsConsent } from "@/lib/consent";
import { useApp } from "@/components/providers/AppProvider";
import { isAdminEmail } from "@/lib/firebase/config";

const SKIP_PREFIXES = ["/admin", "/auth", "/login", "/register", "/dashboard", "/favourites", "/notifications", "/checkout"];
function skipPath(path: string) {
  return SKIP_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

function vid() {
  let v = localStorage.getItem("nx_vid");
  if (!v) { v = crypto.randomUUID(); localStorage.setItem("nx_vid", v); }
  return v;
}
function sid() {
  const now = Date.now();
  const last = Number(sessionStorage.getItem("nx_sid_ts") || 0);
  let s = sessionStorage.getItem("nx_sid");
  if (!s || now - last > 30 * 60 * 1000) { s = crypto.randomUUID(); sessionStorage.setItem("nx_sid", s); }
  sessionStorage.setItem("nx_sid_ts", String(now));
  return s;
}
function utm() {
  try {
    const u = new URL(window.location.href);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const has = keys.some((k) => u.searchParams.get(k)) || u.searchParams.get("fbclid") || u.searchParams.get("gclid");
    if (has) {
      const data = {
        source: u.searchParams.get("utm_source") || undefined,
        medium: u.searchParams.get("utm_medium") || undefined,
        campaign: u.searchParams.get("utm_campaign") || undefined,
        term: u.searchParams.get("utm_term") || undefined,
        content: u.searchParams.get("utm_content") || undefined,
        fbclid: !!u.searchParams.get("fbclid"),
        gclid: !!u.searchParams.get("gclid"),
      };
      sessionStorage.setItem("nx_utm", JSON.stringify(data));
      return data;
    }
    return JSON.parse(sessionStorage.getItem("nx_utm") || "{}");
  } catch { return {}; }
}

let isAdmin = false;
function send(payload: Record<string, unknown>) {
  if (!hasAnalyticsConsent() || isAdmin) return;
  const body = JSON.stringify({ vid: vid(), sid: sid(), ...payload });
  if (navigator.sendBeacon) { navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" })); return; }
  fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
}

export function Tracker() {
  const pathname = usePathname();
  const { user } = useApp();
  const startRef = useRef(0);

  useEffect(() => {
    isAdmin = !!(user && isAdminEmail(user.email));
    if (typeof window === "undefined") return;
    (window as unknown as { __nxTrack?: typeof send }).__nxTrack = send;
  }, [user]);

  useEffect(() => {
    if (skipPath(pathname)) return;
    startRef.current = Date.now();
    const t = setTimeout(() => send({
      kind: "pageview", path: pathname, title: document.title,
      referrer: document.referrer || undefined, ...utm(),
    }), 600);

    const beat = setInterval(() => {
      if (document.visibilityState === "visible") send({ kind: "heartbeat", path: pathname, seconds: startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : 0 });
    }, 30000);
    const onHide = () => {
      if (document.visibilityState === "hidden") send({ kind: "heartbeat", path: pathname, seconds: startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : 0 });
    };
    document.addEventListener("visibilitychange", onHide);
    return () => { clearTimeout(t); clearInterval(beat); document.removeEventListener("visibilitychange", onHide); };
  }, [pathname]);

  return null;
}

export function trackConversion(cType: string) {
  (window as unknown as { __nxTrack?: (p: Record<string, unknown>) => void }).__nxTrack?.({
    kind: "conversion", cType, path: window.location.pathname,
  });
}
