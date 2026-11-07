"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { AdminGate, AdminNav } from "../AdminBits";
import { Section } from "@/components/ui/Button";
import type { AnalyticsEvent } from "@/lib/analytics";

const DAY = 86400000;

function Card({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="display mt-1 text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}
function Table({ title, rows, extra }: { title: string; rows: [string, number][]; extra?: (k: string) => number | undefined }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{title}</p>
      <div className="mt-3 space-y-1.5 text-sm">
        {rows.map(([k, n]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <span className="truncate">{k}</span>
            <span className="shrink-0 text-xs font-semibold text-[#a14b30]">
              {n}{extra?.(k) ? ` · ${extra(k)} conv` : ""}
            </span>
          </div>
        ))}
        {!rows.length ? <p className="text-xs text-muted">No data yet.</p> : null}
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => { clearInterval(t); clearTimeout(first); };
  }, []);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    return onSnapshot(query(collection(db, "analyticsEvents"), orderBy("createdAt", "desc"), limit(3000)), (snap) => {
      setEvents(snap.docs.map((d) => d.data() as AnalyticsEvent));
      setLoaded(true);
    });
  }, []);

  const stats = useMemo(() => {
    const at = (e: AnalyticsEvent) => new Date(e.createdAt).getTime();
    const pvs = events.filter((e) => e.kind === "pageview");
    const conv = events.filter((e) => e.kind === "conversion");
    const uniq = (key: (e: AnalyticsEvent) => string) => new Set(events.map(key).filter(Boolean));
    const active = new Set(events.filter((e) => now - at(e) < 5 * 60000).map((e) => e.sid)).size;
    const today = new Set(events.filter((e) => now - at(e) < DAY).map((e) => e.vid)).size;

    const count = (items: AnalyticsEvent[], key: (e: AnalyticsEvent) => string | undefined) => {
      const m = new Map<string, number>();
      items.forEach((e) => { const k = key(e) || "(direct)"; m.set(k, (m.get(k) || 0) + 1); });
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    };
    const sourceOf = (e: AnalyticsEvent) =>
      e.source || (e.fbclid ? "facebook" : e.gclid ? "google" : e.referrer ? new URL(e.referrer).hostname.replace(/^www\./, "") : undefined);
    const convBySource = new Map<string, number>();
    events.forEach((e) => {
      if (e.kind !== "conversion") return;
      const pv = pvs.find((v) => v.sid === e.sid);
      const s = pv ? sourceOf(pv) || "(direct)" : "(unknown)";
      convBySource.set(s, (convBySource.get(s) || 0) + 1);
    });

    const sessionsByVid = new Map<string, Set<string>>();
    const vidPv = new Map<string, number>();
    pvs.forEach((e) => {
      sessionsByVid.set(e.vid, (sessionsByVid.get(e.vid) || new Set()).add(e.sid));
      vidPv.set(e.vid, (vidPv.get(e.vid) || 0) + 1);
    });
    const convVids = new Set(conv.map((e) => e.vid));
    const returning = [...sessionsByVid.entries()]
      .map(([v, s]) => ({ vid: v, sessions: s.size, pageviews: vidPv.get(v) || 0, converted: convVids.has(v) }))
      .filter((r) => r.sessions > 1 || r.pageviews >= 3 || r.converted)
      .sort((a, b) => b.sessions - a.sessions || b.pageviews - a.pageviews)
      .slice(0, 25);

    return {
      active, today, totalVis: uniq((e) => e.vid).size, pvs: pvs.length,
      conv: conv.length, rate: pvs.length ? ((conv.length / pvs.length) * 100).toFixed(1) : "0",
      sources: count(pvs, sourceOf), convBySource,
      campaigns: count(pvs, (e) => e.campaign), devices: count(events, (e) => e.device),
      os: count(events, (e) => e.os), browsers: count(events, (e) => e.browser),
      pages: count(pvs, (e) => e.path), locations: count(events, (e) => (e.city ? `${e.city}, ${e.country || ""}` : e.country)),
      convTypes: count(conv, (e) => e.cType), returning,
      live: events.slice(0, 15),
      dc: events.filter((e) => e.dataCenter).length,
    };
  }, [events, now]);

  return (
    <Section className="max-w-6xl">
      <AdminGate>
        <AdminNav />
        <h1 className="display text-3xl">Website analytics</h1>
        <p className="mt-1 text-sm text-muted">Visitor intelligence · bots filtered · locations approximate</p>

        {!loaded ? (
          <div className="mt-16 flex justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-[#a14b30]" /></div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Card label="Active now" value={stats.active} sub="last 5 min" />
              <Card label="Visitors today" value={stats.today} />
              <Card label="Total visitors" value={stats.totalVis} />
              <Card label="Pageviews" value={stats.pvs} sub={`${stats.dc} datacenter`} />
              <Card label="Conversions" value={stats.conv} sub={`${stats.rate}% of views`} />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Table title="Traffic sources" rows={stats.sources} extra={(k) => stats.convBySource.get(k)} />
              <Table title="Campaigns" rows={stats.campaigns} />
              <Table title="Top pages" rows={stats.pages} />
              <Table title="Devices" rows={stats.devices} />
              <Table title="Operating systems" rows={stats.os} />
              <Table title="Browsers" rows={stats.browsers} />
              <Table title="Locations (approx)" rows={stats.locations} />
              <Table title="Conversions" rows={stats.convTypes} />
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Returning visitors / potential leads</p>
              <div className="mt-3 space-y-1.5 text-sm">
                {stats.returning.map((r) => (
                  <div key={r.vid} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs">{r.vid.slice(0, 8)}…</span>
                    <span className="text-xs text-muted">{r.sessions} sessions · {r.pageviews} views{r.converted ? " · converted" : ""}</span>
                  </div>
                ))}
                {!stats.returning.length ? <p className="text-xs text-muted">No repeat visitors yet.</p> : null}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Live feed</p>
              <div className="mt-3 space-y-1.5 text-sm">
                {stats.live.map((e, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="truncate">
                      <span className={`mr-2 font-semibold ${e.kind === "conversion" ? "text-emerald-700" : "text-[#a14b30]"}`}>{e.kind}</span>
                      {e.path}
                    </span>
                    <span className="shrink-0 text-muted">
                      {[e.device, e.os, e.city || e.country].filter(Boolean).join(" · ")}
                      {" · "}{new Date(e.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {!stats.live.length ? <p className="text-xs text-muted">No events yet.</p> : null}
              </div>
            </div>
          </>
        )}
      </AdminGate>
    </Section>
  );
}
