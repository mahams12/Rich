"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { sortPostsNewestFirst } from "@/data/posts";

export function AdminBlogView() {
  const { posts, setPostStatus, deletePost, importSeedPosts, firebaseReady } = useApp();
  const [syncing, setSyncing] = useState(false);
  const sorted = useMemo(() => sortPostsNewestFirst(posts), [posts]);

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
        <div className="overflow-x-auto rounded-[1.5rem] border border-black/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Status</th>
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
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/blog/${post.id}`} className="font-semibold text-[#c45c3a]">
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
