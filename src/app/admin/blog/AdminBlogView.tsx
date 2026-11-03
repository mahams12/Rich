"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { subscribeBlogVisits, type BlogVisit } from "@/lib/blogAnalytics";
import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { sortPostsNewestFirst } from "@/data/posts";
import { isStudioAdmin } from "@/lib/admin";

export function AdminBlogView() {
  const { posts, setPostStatus, deletePost, importSeedPosts, firebaseReady, user, ready } = useApp();
  const [syncing, setSyncing] = useState(false);
  const sorted = useMemo(() => sortPostsNewestFirst(posts), [posts]);
  const [visits, setVisits] = useState<BlogVisit[]>([]);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  // blogVisits reads require admin claims — subscribe only after Firebase Auth
  // has confirmed the session (ready), or the listener is denied and dies.
  const analyticsAllowed = firebaseReady && ready && isStudioAdmin(user);
  useEffect(() => {
    if (!analyticsAllowed) return;
    return subscribeBlogVisits(
      (next) => { setVisits(next); setAnalyticsReady(true); setAnalyticsError(""); },
      setAnalyticsError,
    );
  }, [analyticsAllowed]);
  const counts = useMemo(() => {
    const result: Record<string, { total: number; blog_listing: number; internal: number; external: number; direct: number }> = {};
    for (const visit of visits) {
      if (!result[visit.slug]) result[visit.slug] = { total: 0, blog_listing: 0, internal: 0, external: 0, direct: 0 };
      result[visit.slug].total++;
      result[visit.slug][visit.source]++;
    }
    return result;
  }, [visits]);
  const total = visits.length;
  const sourceTotal = (source: BlogVisit["source"]) => visits.filter((visit) => visit.source === source).length;

  return (
    <Section>
      <AdminGate>
        <AdminNav />
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="display text-3xl">Blog</h1>
          <div className="flex items-center gap-2">
            {firebaseReady ? (
              <button
                type="button"
                disabled={syncing}
                onClick={async () => {
                  setSyncing(true);
                  try {
                    await importSeedPosts();
                  } finally {
                    setSyncing(false);
                  }
                }}
                className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold transition hover:bg-black/[0.04] disabled:cursor-wait disabled:opacity-50"
              >
                {syncing ? "Syncing…" : "Sync missing GitHub blogs"}
              </button>
            ) : null}
            <Button href="/admin/blog/new">New post</Button>
          </div>
        </div>
        <section className="mb-7 rounded-3xl border border-black/10 bg-white/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="display text-2xl">Blog analytics</h2>
            <span className="text-xs text-muted">{analyticsReady ? "Live · Firestore" : "Connecting…"}</span>
          </div>
          <p className="mt-2 text-sm text-muted">Article opens since tracking started. Not unique visitors; admin views excluded.</p>
          {analyticsError ? <p className="mt-2 text-sm text-rose-700">Analytics unavailable: {analyticsError}. Deploy updated Firestore rules.</p> : null}
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            {([["Article opens", total], ["From blog page", sourceTotal("blog_listing")], ["Other site pages", sourceTotal("internal")], ["External sites", sourceTotal("external")], ["Direct / unknown", sourceTotal("direct")]] as const).map(([label, count]) => (
              <div key={label} className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums">{analyticsReady ? count.toLocaleString() : "—"}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="overflow-x-auto rounded-[1.5rem] border border-black/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Analytics</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => (
                <tr key={post.id} className="border-t border-black/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-xs text-muted">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {[post.featured ? "Featured" : null, post.trending ? "Trending" : null].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{post.status}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    <strong>{analyticsReady ? counts[post.slug]?.total || 0 : "—"} opens</strong>
                    <p className="mt-1 text-muted">Blog: {counts[post.slug]?.blog_listing || 0} · Site: {counts[post.slug]?.internal || 0}</p>
                    <p className="text-muted">External: {counts[post.slug]?.external || 0} · Direct: {counts[post.slug]?.direct || 0}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/blog/${post.id}`} className="font-semibold text-[#a14b30]">
                        Edit
                      </Link>
                      <Link href={`/blog/${post.slug}`} className="text-muted">
                        View
                      </Link>
                      <button
                        type="button"
                        className="text-muted"
                        onClick={() => setPostStatus(post.id, post.status === "published" ? "draft" : "published")}
                      >
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button type="button" className="text-muted" onClick={() => setPostStatus(post.id, "archived")}>
                        Archive
                      </button>
                      <button
                        type="button"
                        className="text-rose-700"
                        onClick={() => {
                          if (window.confirm(`Delete “${post.title}”?`)) deletePost(post.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminGate>
    </Section>
  );
}
