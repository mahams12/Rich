"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Section } from "@/components/ui/Button";
import { AdminGate, AdminNav } from "../AdminBits";
import { formatDate } from "@/lib/format";
import type { BlogSubmissionStatus } from "@/types";

const TABS: { key: BlogSubmissionStatus; label: string; hint: string }[] = [
  { key: "pending", label: "Pending", hint: "Needs review" },
  { key: "approved", label: "Approved", hint: "Published" },
  { key: "rejected", label: "Rejected", hint: "Declined" },
];

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export function AdminSubmissionsView() {
  const { submissions, approveBlogSubmission, rejectBlogSubmission, deleteBlogSubmission } = useApp();
  const [active, setActive] = useState<BlogSubmissionStatus>("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const counts = {
    pending: submissions.filter((i) => i.status === "pending").length,
    approved: submissions.filter((i) => i.status === "approved").length,
    rejected: submissions.filter((i) => i.status === "rejected").length,
  };
  const items = submissions.filter((i) => i.status === active);

  return (
    <Section className="max-w-5xl">
      <AdminGate>
        <AdminNav />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a14b30]">Admin · Blog submissions</p>
            <h1 className="display mt-3 text-4xl">Contributor review queue</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={`flex min-w-36 items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition lg:min-w-0 ${
                  active === tab.key ? "bg-[#16110e] font-semibold text-white" : "bg-card text-[#4a423c] hover:bg-black/[0.04]"
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
          </nav>

          <div className="min-w-0">
            {!items.length ? (
              <div className="rounded-3xl border border-dashed border-black/15 bg-card p-10 text-center">
                <p className="text-sm font-semibold text-[#4a423c]">No {active} submissions</p>
                <p className="mt-1 text-xs text-muted">The queue is clear.</p>
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
                        <p className="truncate text-sm font-semibold text-[#16110e]">
                          {item.title}
                          {item.resubmitted ? <span className="ml-2 text-[11px] font-bold uppercase tracking-widest text-amber-700">resubmitted</span> : null}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {item.author} · {item.email}{item.phone ? ` · ${item.phone}` : ""} · {formatDate(item.createdAt)}
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
                          <img src={item.cover} alt="" className="mb-3 h-32 w-full rounded-2xl border border-black/10 object-cover" />
                        ) : null}
                        <p className="text-sm text-muted">{item.excerpt}</p>
                        <p className="mt-2 whitespace-pre-line text-sm text-muted">{item.content}</p>
                        <p className="mt-2 text-xs text-muted">Tags: {item.tags.join(", ") || "—"}</p>
                        {item.resubmitNote ? (
                          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">Contributor note: {item.resubmitNote}</p>
                        ) : null}
                        {item.rejectReason ? (
                          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">Rejection reason: {item.rejectReason}</p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-4">
                          {item.status === "pending" ? (
                            <>
                              <button
                                type="button"
                                className="text-xs font-semibold text-[#a14b30] underline-offset-4 hover:underline"
                                onClick={() => {
                                  if (window.confirm(`Publish “${item.title}” under ${item.author}?`)) approveBlogSubmission(item);
                                }}
                              >
                                Approve & publish
                              </button>
                              <button
                                type="button"
                                className="text-xs font-semibold text-rose-700 underline-offset-4 hover:underline"
                                onClick={() => {
                                  const reason = window.prompt("Reason for rejection (required — shown to the contributor):");
                                  if (reason === null) return;
                                  if (!reason.trim()) { window.alert("A rejection reason is required."); return; }
                                  rejectBlogSubmission(item.id, reason.trim());
                                }}
                              >
                                Reject
                              </button>
                            </>
                          ) : null}
                          {item.status === "rejected" ? (
                            <button
                              type="button"
                              className="text-xs font-semibold text-rose-700 underline-offset-4 hover:underline"
                              onClick={() => { if (window.confirm("Delete this rejected submission permanently?")) deleteBlogSubmission(item.id); }}
                            >
                              Delete permanently
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminGate>
    </Section>
  );
}
