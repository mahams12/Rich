"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { uid } from "@/lib/format";

export function SubmitBlogView() {
  const { user, ready, submitBlogPost, toast } = useApp();
  const [sent, setSent] = useState(false);
  const [cover, setCover] = useState("");
  const [uploading, setUploading] = useState(false);
  const submissionKey = useMemo(() => uid("sub"), []);

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const { uploadSubmissionCover } = await import("@/lib/firebase/storage");
      const url = await uploadSubmissionCover(file, submissionKey);
      setCover(url);
      toast(url.startsWith("data:") ? "Photo added" : "Photo uploaded");
    } catch (error) {
      const { firebaseErrorMessage } = await import("@/lib/firebase/errors");
      toast("Upload failed", firebaseErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  const [formError, setFormError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!user || uploading) return;
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();
    const title = String(data.get("title") || "").trim();
    const excerpt = String(data.get("excerpt") || "").trim();
    const content = String(data.get("content") || "").trim();
    if (title.length < 10) { setFormError("Title needs at least 10 characters."); return; }
    if (excerpt.length < 30) { setFormError("Summary needs at least 30 characters — 1–2 sentences."); return; }
    if (content.length < 200) { setFormError("Article body needs at least 200 characters."); return; }
    if (!cover) { setFormError("Cover photo is required — upload an image before submitting."); return; }
    if (!phone) { setFormError("Mobile/WhatsApp number is required for reward payouts."); return; }
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
      phone,
      cover,
    });
    if (ok) {
      setSent(true);
      setCover("");
      event.currentTarget.reset();
    }
  }

  return (
    <Section className="max-w-3xl">
      <Badge>Community articles</Badge>
      <h1 className="display mt-4 text-4xl">Write for the NovexaHub journal</h1>
      <p className="mt-3 max-w-xl text-[#6d655d]">
        Share a practical article on websites, software, ecommerce, mobile apps or automation. Every article our team
        approves is published under <strong className="text-ink">your name</strong> — and earns
        <strong className="text-ink"> $1 for every 5–10 approved blogs</strong> (or the equivalent local amount at the applicable exchange rate).
      </p>

      {!ready ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-[#a14b30]" />
          <p className="text-sm text-muted">Restoring your session…</p>
        </div>
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
              <textarea
                name="content"
                required
                minLength={200}
                className={`${inputClass} min-h-56`}
                placeholder="Write clearly, stay factual, and keep it practical — how-tos, checklists and real lessons work best."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const { selectionStart, selectionEnd, value } = el;
                    const insert = value.charAt(selectionStart - 1) === "\n" || selectionStart === 0 ? "- " : "\n- ";
                    el.value = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
                    el.selectionStart = el.selectionEnd = selectionStart + insert.length;
                  }
                }}
              />
              <p className="mt-2 text-xs leading-5 text-muted">
                Formatting: <code className="rounded bg-black/[0.05] px-1"># Heading</code> large bold ·{" "}
                <code className="rounded bg-black/[0.05] px-1">## Heading</code> smaller bold ·{" "}
                <code className="rounded bg-black/[0.05] px-1">- item</code> bullet ·{" "}
                <code className="rounded bg-black/[0.05] px-1">**bold**</code> · Shift+Enter adds a bullet.
              </p>
            </Field>
            <Field label="Tags (comma separated)">
              <input name="tags" className={inputClass} placeholder="ecommerce, web development, startups" />
            </Field>
            <Field label="Mobile / WhatsApp number (required for reward payout)">
              <input name="phone" required className={inputClass} placeholder="+1 555 123 4567" inputMode="tel" />
            </Field>
            <Field label="Cover photo (required — shown on the blog list)">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm"
                disabled={uploading}
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <p className="mt-2 text-xs text-muted">
                {uploading ? "Uploading…" : "Choose a photo from your device (max 5 MB)."}
              </p>
              {cover ? (
                <div className="mt-3 space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="Cover preview" className="h-32 w-full rounded-2xl border border-black/10 object-cover" />
                  <button type="button" className="text-xs text-rose-700" onClick={() => setCover("")}>
                    Remove photo
                  </button>
                </div>
              ) : null}
            </Field>
            {formError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p> : null}
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading…" : "Submit for review"}
            </Button>
            {sent ? <p className="text-sm text-[#a14b30]">Submitted — the studio will review it before publishing.</p> : null}
          </form>

          <p className="mt-6 text-sm text-[#6d655d]">
            <Link href="/blog/submissions" className="font-semibold text-[#a14b30] underline-offset-4 hover:underline">View your submissions</Link> — track pending, approved and rejected articles.
          </p>
        </>
      )}
    </Section>
  );
}
