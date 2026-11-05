"use client";

import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Section } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";

export function AdminRequestsView() {
  const { contacts, customizations, submissions, deleteContact, deleteCustomization, approveBlogSubmission, deleteBlogSubmission, rejectBlogSubmission } = useApp();
  return (
    <Section>
      <AdminGate>
        <AdminNav />
        <h1 className="display text-3xl">Inbox</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Contact</h2>
            <div className="mt-3 space-y-3">
              {contacts.map((item) => (
                <article key={item.id} className="glass rounded-3xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.name} · {item.email}</p>
                      <p className="text-xs text-muted">{formatDate(item.createdAt)} · {item.project}</p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-xs font-semibold text-rose-700 hover:underline"
                      onClick={() => {
                        if (window.confirm("Delete this contact request?")) deleteContact(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-muted">{item.message}</p>
                </article>
              ))}
              {!contacts.length ? <p className="text-muted">No contact requests.</p> : null}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Customizations</h2>
            <div className="mt-3 space-y-3">
              {customizations.map((item) => (
                <article key={item.id} className="glass rounded-3xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.projectTitle}</p>
                      <p className="text-xs text-muted">{item.name} · {item.email} · {item.wordCount} words · {formatDate(item.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-xs font-semibold text-rose-700 hover:underline"
                      onClick={() => {
                        if (window.confirm("Delete this customization request?")) deleteCustomization(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-muted">{item.words}</p>
                </article>
              ))}
              {!customizations.length ? <p className="text-muted">No customization requests.</p> : null}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Blog submissions</h2>
            <div className="mt-3 space-y-3">
              {submissions.map((item) => (
                <article key={item.id} className="glass rounded-3xl p-4">
                  {item.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.cover} alt="" className="mb-3 h-28 w-full rounded-2xl border border-black/10 object-cover" />
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted">{item.author} · {item.email} · {formatDate(item.createdAt)}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#6d655d]">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{item.excerpt}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-semibold text-[#a14b30]">Read full article</summary>
                    <p className="mt-2 whitespace-pre-line text-sm text-muted">{item.content}</p>
                  </details>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#a14b30] hover:underline"
                      onClick={() => {
                        if (window.confirm(`Publish “${item.title}” under ${item.author}?`)) approveBlogSubmission(item);
                      }}
                    >
                      Approve & publish
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-rose-700 hover:underline"
                      onClick={() => {
                        const reason = window.prompt("Reason for rejection (required — shown to the contributor):");
                        if (reason === null) return;
                        if (!reason.trim()) { window.alert("A rejection reason is required."); return; }
                        rejectBlogSubmission(item.id, reason.trim());
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#6d655d] hover:underline"
                      onClick={() => {
                        if (window.confirm("Delete this submission?")) deleteBlogSubmission(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!submissions.length ? <p className="text-muted">No blog submissions.</p> : null}
            </div>
          </div>
        </div>
      </AdminGate>
    </Section>
  );
}
