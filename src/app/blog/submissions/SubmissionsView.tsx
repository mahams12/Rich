"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { site } from "@/data/site";
import type { BlogSubmission, BlogSubmissionStatus } from "@/types";

const TABS: { key: BlogSubmissionStatus; label: string; hint: string }[] = [
  { key: "pending", label: "Pending", hint: "Awaiting editorial review" },
  { key: "approved", label: "Approved", hint: "Published to the journal" },
  { key: "rejected", label: "Rejected", hint: "Edit and resubmit" },
];

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
    if (next.title === item.title && next.excerpt === item.excerpt && next.content === item.content) {
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
  const [active, setActive] = useState<BlogSubmissionStatus>("pending");
  const [editing, setEditing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const mine = useMemo(
    () => (user ? submissions.filter((item) => item.email === user.email) : []),
    [submissions, user],
  );
  const counts = useMemo(
    () => ({
      pending: mine.filter((i) => i.status === "pending").length,
      approved: mine.filter((i) => i.status === "approved").length,
      rejected: mine.filter((i) => i.status === "rejected").length,
    }),
    [mine],
  );
  const items = mine.filter((i) => i.status === active);

  if (!ready) {
    return (
      <Section className="max-w-5xl">
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
    <Section className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge>My submissions</Badge>
          <h1 className="display mt-4 text-4xl">Your articles</h1>
        </div>
        <Button href="/blog/submit" variant="light">New submission</Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => { setActive(tab.key); setEditing(null); }}
              className={`flex min-w-36 items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition lg:min-w-0 ${
                active === tab.key
                  ? "bg-[#16110e] font-semibold text-white"
                  : "bg-card text-[#4a423c] hover:bg-black/[0.04]"
              }`}
            >
              <span>
                <span className="block font-semibold">{tab.label}</span>
                <span className={`block text-[11px] ${active === tab.key ? "text-white/60" : "text-muted"}`}>{tab.hint}</span>
              </span>
              <span className={`ml-3 rounded-full px-2 py-0.5 text-[11px] font-bold ${active === tab.key ? "bg-white/15" : "bg-black/[0.06]"}`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
          <div className="mt-2 hidden rounded-2xl border border-black/10 bg-card p-4 lg:block">
            <p className="text-xs leading-5 text-muted">
              Questions about a submission?{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-[#a14b30] underline-offset-4 hover:underline">
                Email the studio
              </a>
            </p>
          </div>
        </nav>

        <div className="min-w-0">
          {!items.length ? (
            <div className="rounded-3xl border border-dashed border-black/15 bg-card p-10 text-center">
              <p className="text-sm font-semibold text-[#4a423c]">No {active} submissions</p>
              <p className="mt-1 text-xs text-muted">
                {active === "pending" ? "Approved and rejected articles appear in their own tabs." : "Your articles will appear here as they move through review."}
              </p>
              {active === "pending" && !mine.length ? (
                <Button href="/blog/submit" variant="ghost" className="mt-4">Write your first article</Button>
              ) : null}
            </div>
          ) : (
            <div className="divide-y divide-black/5 rounded-3xl border border-black/10 bg-white">
              {items.map((item) => (
                <article key={item.id} className="px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#16110e]">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                        {item.resubmitted ? " · resubmitted" : ""} · {item.excerpt.slice(0, 70)}{item.excerpt.length > 70 ? "…" : ""}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${STATUS_CLASS[item.status]}`}>
                      {item.resubmitted && item.status === "pending" ? "Resubmitted" : item.status}
                    </span>
                    <span className={`text-[#a14b30] transition ${expanded === item.id ? "rotate-180" : ""}`}>▾</span>
                  </button>
                  {expanded === item.id ? (
                    <div className="mt-3 border-t border-black/5 pt-3">
                      {item.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.cover} alt="" className="mb-3 h-28 w-full rounded-2xl border border-black/10 object-cover" />
                      ) : null}
                      <p className="text-sm text-muted">{item.excerpt}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs font-semibold text-[#a14b30]">Read full article</summary>
                        <p className="mt-2 whitespace-pre-line text-sm text-muted">{item.content}</p>
                      </details>
                      {item.status === "approved" && item.publishedSlug ? (
                        <Link href={`/blog/${item.publishedSlug}`} className="mt-3 inline-block text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline">
                          View live article →
                        </Link>
                      ) : null}
                      {item.status === "rejected" && item.rejectReason ? (
                        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">Reason: {item.rejectReason}</p>
                      ) : null}
                      {item.status === "rejected" ? (
                        <div className="mt-3 flex flex-wrap gap-4">
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
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
