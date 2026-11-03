"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";

export function SubmitBlogView() {
  const { user, ready, submitBlogPost, submissions } = useApp();
  const [sent, setSent] = useState(false);
  const mine = user ? submissions.filter((item) => item.email === user.email) : [];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    const ok = submitBlogPost({
      title: String(data.get("title") || "").trim(),
      excerpt: String(data.get("excerpt") || "").trim(),
      content: String(data.get("content") || "").trim(),
      tags: String(data.get("tags") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      author: user.name,
      email: user.email,
    });
    if (ok) {
      setSent(true);
      event.currentTarget.reset();
    }
  }

  return (
    <Section className="max-w-3xl">
      <Badge>Community articles</Badge>
      <h1 className="display mt-4 text-4xl">Write for the NovexaHub journal</h1>
      <p className="mt-3 max-w-xl text-[#6d655d]">
        Share a practical article on websites, software, ecommerce, mobile apps or automation. Every article our team
        approves is published under <strong className="text-ink">your name</strong> — and earns a
        <strong className="text-ink"> 50 PKR reward</strong>.
      </p>

      {!ready ? (
        <p className="mt-8 text-sm text-muted">Restoring your session…</p>
      ) : !user ? (
        <div className="mt-8 rounded-3xl border border-black/10 bg-card p-6">
          <p className="text-sm text-[#6d655d]">
            <Link href="/login?next=/blog/submit" className="font-semibold text-[#16110e]">Login</Link> or{" "}
            <Link href="/register" className="font-semibold text-[#16110e]">create an account</Link> to submit an
            article. It is published under your name once the studio approves it.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-[2rem] p-6">
            <Field label="Title">
              <input name="title" required minLength={10} className={inputClass} placeholder="e.g. How we reduced checkout drop-off for an online store" />
            </Field>
            <Field label="Short summary (shown on the blog list)">
              <textarea name="excerpt" required minLength={30} className={`${inputClass} min-h-20`} placeholder="1–2 sentences that make a reader want the full article." />
            </Field>
            <Field label="Article body (paragraphs separated by a blank line)">
              <textarea name="content" required minLength={200} className={`${inputClass} min-h-56`} placeholder="Write clearly, stay factual, and keep it practical — how-tos, checklists and real lessons work best." />
            </Field>
            <Field label="Tags (comma separated)">
              <input name="tags" className={inputClass} placeholder="ecommerce, web development, pakistan" />
            </Field>
            <Button type="submit">Submit for review</Button>
            {sent ? <p className="text-sm text-[#a14b30]">Submitted — the studio will review it before publishing.</p> : null}
          </form>

          {mine.length ? (
            <div className="mt-8">
              <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Your submissions</h2>
              <div className="mt-3 space-y-3">
                {mine.map((item) => (
                  <article key={item.id} className="rounded-3xl border border-black/10 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted">{new Date(item.createdAt).toLocaleDateString()} · {item.status}</p>
                      </div>
                      <span className="rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#6d655d]">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </Section>
  );
}
