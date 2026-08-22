"use client";

import { FormEvent, useState } from "react";
import { AdminGate, AdminNav } from "@/app/admin/AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { formatWhen } from "@/lib/format";
import type { NoticeKind } from "@/types";

const kinds: Array<{ id: NoticeKind; label: string }> = [
  { id: "sale", label: "Sale / discount" },
  { id: "project", label: "New project" },
  { id: "feature", label: "New feature" },
  { id: "general", label: "General update" },
];

export function AdminNoticesView() {
  const { notices, pushNotice } = useApp();
  const [kind, setKind] = useState<NoticeKind>("sale");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const body = String(data.get("body") || "").trim();
    const href = String(data.get("href") || "").trim();
    if (!title || !body) return;
    pushNotice({ kind, title, body, href: href || undefined });
    event.currentTarget.reset();
    setKind("sale");
  }

  return (
    <Section className="max-w-3xl">
      <AdminGate>
        <AdminNav />
        <Badge>Live alerts</Badge>
        <h1 className="display mt-3 text-3xl">Push a notification</h1>
        <p className="mt-2 text-[#6d655d]">
          Write the message and send. Every signed-in client sees it in the bell, and a toast appears in real time.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-[2rem] border border-black/10 bg-card p-6">
          <div className="flex flex-wrap gap-2">
            {kinds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setKind(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${kind === item.id ? "bg-[#16110e] text-white" : "border border-black/10 bg-white text-[#16110e]"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Field label="Title">
            <input name="title" required placeholder="Spring discount on studio sites" className={inputClass} />
          </Field>
          <Field label="Message">
            <textarea name="body" required minLength={8} placeholder="Tell logged-in clients what is new." className={`${inputClass} min-h-28`} />
          </Field>
          <Field label="Optional link">
            <input name="href" placeholder="/portfolio or /projects/your-slug" className={inputClass} />
          </Field>
          <Button type="submit">Push to all logged-in users</Button>
        </form>

        <h2 className="display mt-10 text-2xl">Sent</h2>
        <div className="mt-4 space-y-3">
          {notices.length ? notices.map((item) => (
            <article key={item.id} className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c45c3a]">
                {item.kind} · {formatWhen(item.createdAt)}
              </p>
              <p className="mt-1 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-[#6d655d]">{item.body}</p>
            </article>
          )) : <p className="text-sm text-[#6d655d]">Nothing pushed yet.</p>}
        </div>
      </AdminGate>
    </Section>
  );
}
