"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { site } from "@/data/site";
import type { BlogSubmission } from "@/types";

const STATUS_LABEL: Record<string, string> = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

function EditResubmitForm({ item, onDone }: { item: BlogSubmission; onDone: () => void }) {
  const { resubmitBlogSubmission } = useApp();
  const [error, setError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = {
      title: String(data.get("title") || "").trim(),
      excerpt: String(data.get("excerpt") || "").trim(),
      content: String(data.get("content") || "").trim(),
      tags: String(data.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
      resubmitNote: String(data.get("note") || "").trim(),
    };
    const unchanged =
      next.title === item.title && next.excerpt === item.excerpt && next.content === item.content;
    if (unchanged) {
      setError("Edit the article before resubmitting — unchanged submissions can't be resent.");
      return;
    }
    if (next.title.length < 10 || next.excerpt.length < 30 || next.content.length < 200) {
      setError("Title needs 10+ characters, summary 30+, article body 200+.");
      return;
    }
    if (resubmitBlogSubmission(item.id, { ...next, cover: item.cover, phone: item.phone })) onDone();
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-black/10 pt-4">
      <Field label="Title">
        <input name="title" defaultValue={item.title} required minLength={10} className={inputClass} />
      </Field>
      <Field label="Summary">
        <textarea name="excerpt" defaultValue={item.excerpt} required minLength={30} className={`${inputClass} min-h-20`} />
      </Field>
      <Field label="Article body">
        <textarea name="content" defaultValue={item.content} required minLength={200} className={`${inputClass} min-h-40`} />
      </Field>
      <Field label="Tags">
        <input name="tags" defaultValue={item.tags.join(", ")} className={inputClass} />
      </Field>
      <Field label="Message for the reviewer (optional)">
        <input name="note" className={inputClass} placeholder="e.g. Rewrote the intro and added sources" />
      </Field>
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}
      <div className="flex gap-3">
        <Button type="submit">Resubmit for review</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}

export function SubmissionsView() {
  const { user, ready, submissions, deleteBlogSubmission } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const mine = useMemo(
    () => (user ? submissions.filter((item) => item.email === user.email) : []),
    [submissions, user],
  );
  const groups: { status: "pending" | "approved" | "rejected"; items: BlogSubmission[] }[] = [
    { status: "pending", items: mine.filter((i) => i.status === "pending") },
    { status: "approved", items: mine.filter((i) => i.status === "approved") },
    { status: "rejected", items: mine.filter((i) => i.status === "rejected") },
  ];

  if (!ready) {
    return (
      <Section className="max-w-3xl">
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-[#a14b30]" />
          <p className="text-sm text-muted">Loading your submissions…</p>
        </div>
      </Section>
    );
  }

  if (!user) {
    return (
      <Section className="max-w-3xl">
        <Badge>My submissions</Badge>
        <h1 className="display mt-4 text-4xl">Track your articles</h1>
        <div className="mt-8 rounded-3xl border border-black/10 bg-card p-6">
          <p className="text-sm text-[#6d655d]">
            <Link href="/login?next=/blog/submissions" className="font-semibold text-[#16110e]">Login</Link> to see
            the status of your submitted articles.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="max-w-3xl">
      <Badge>My submissions</Badge>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl">Your articles</h1>
        <Button href="/blog/submit" variant="light">New submission</Button>
      </div>
      <p className="mt-3 text-sm text-[#6d655d]">
        Track pending, approved and rejected articles. Questions?{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-[#a14b30] underline-offset-4 hover:underline">
          Email the studio
        </a>
        .
      </p>

      {!mine.length ? (
        <p className="mt-8 rounded-3xl border border-black/10 bg-card p-6 text-sm text-[#6d655d]">
          No submissions yet — <Link href="/blog/submit" className="font-semibold text-[#16110e]">write your first article</Link>.
        </p>
      ) : (
        groups.map((group) => (
          <div key={group.status} className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              {STATUS_LABEL[group.status]} ({group.items.length})
            </h2>
            <div className="mt-3 space-y-3">
              {group.items.map((item) => (
                <article key={item.id} className="rounded-3xl border border-black/10 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                        {item.resubmitted ? " · resubmitted" : ""}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${STATUS_CLASS[group.status]}`}>
                      {item.resubmitted && group.status === "pending" ? "Resubmitted" : STATUS_LABEL[group.status]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
                  {item.status === "rejected" && item.rejectReason ? (
                    <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">Reason: {item.rejectReason}</p>
                  ) : null}
                  {item.status === "rejected" ? (
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setEditing(editing === item.id ? null : item.id)}
                        className="text-xs font-semibold text-[#a14b30] underline-offset-4 hover:underline"
                      >
                        {editing === item.id ? "Close editor" : "Edit & resubmit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (window.confirm("Delete this rejected submission permanently?")) deleteBlogSubmission(item.id); }}
                        className="text-xs font-semibold text-rose-700 underline-offset-4 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                  {editing === item.id ? <EditResubmitForm item={item} onDone={() => setEditing(null)} /> : null}
                </article>
              ))}
              {!group.items.length ? <p className="text-xs text-muted">None.</p> : null}
            </div>
          </div>
        ))
      )}
    </Section>
  );
}
