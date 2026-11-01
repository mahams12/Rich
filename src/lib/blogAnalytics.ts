"use client";
import { addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
export type BlogSource = "blog_listing" | "internal" | "external" | "direct";
export interface BlogVisit { slug: string; source: BlogSource; at?: unknown }
const KEY = "novexahub-blog-navigation";
export function rememberBlogNavigation(slug: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify({ slug, path: window.location.pathname, time: Date.now() }));
}
function sourceFor(slug: string): BlogSource {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (raw) {
      const nav = JSON.parse(raw) as { slug: string; path: string; time: number };
      if (nav.slug === slug && Date.now() - nav.time < 30000) return nav.path === "/blog" ? "blog_listing" : "internal";
    }
    if (!document.referrer) return "direct";
    const ref = new URL(document.referrer);
    if (ref.origin !== location.origin) return "external";
    return ref.pathname === "/blog" ? "blog_listing" : "internal";
  } catch { return "direct"; }
}
export async function recordBlogVisit(slug: string) {
  const db = getFirebaseDb();
  if (!db || !/^[a-z0-9-]{1,160}$/.test(slug)) return;
  const key = "novexahub-blog-view:" + slug;
  if (Date.now() - Number(sessionStorage.getItem(key) || 0) < 2500) return;
  sessionStorage.setItem(key, String(Date.now()));
  await addDoc(collection(db, "blogVisits"), { slug, source: sourceFor(slug), at: serverTimestamp() });
}
export function subscribeBlogVisits(onData: (visits: BlogVisit[]) => void, onError: (message: string) => void) {
  const db = getFirebaseDb();
  if (!db) return () => undefined;
  return onSnapshot(collection(db, "blogVisits"), (snap) => {
    onData(snap.docs.map((item) => item.data() as BlogVisit));
  }, (error) => onError(error.message));
}
