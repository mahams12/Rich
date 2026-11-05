"use client";

import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Section } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";

export function AdminRequestsView() {
  const { contacts, customizations, deleteContact, deleteCustomization } = useApp();
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
            <div className="glass mt-3 rounded-3xl p-4">
              <p className="text-sm font-semibold">Review queue moved</p>
              <p className="mt-1 text-xs text-muted">Pending, approved and rejected articles now live on a dedicated page.</p>
              <a href="/admin/submissions" className="mt-2 inline-block text-xs font-semibold text-[#a14b30] underline-offset-4 hover:underline">Open submissions →</a>
            </div>
          </div>
        </div>
      </AdminGate>
    </Section>
  );
}
