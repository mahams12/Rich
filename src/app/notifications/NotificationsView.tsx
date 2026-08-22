"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section } from "@/components/ui/Button";
import { formatWhen } from "@/lib/format";

export function NotificationsView() {
  const { user, unreadNotices, unreadCount, markNoticeRead, markAllNoticesRead } = useApp();

  if (!user) {
    return (
      <Section>
        <h1 className="display text-4xl">Notifications</h1>
        <p className="mt-3 text-[#6d655d]">Login to receive live alerts when the studio publishes a project, feature, or sale.</p>
        <Button href="/login?next=/notifications" className="mt-6">Login</Button>
      </Section>
    );
  }

  return (
    <Section className="max-w-3xl">
      <Badge>Your alerts</Badge>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="display text-4xl">Notifications</h1>
        {unreadCount ? (
          <button type="button" className="text-sm text-[#c45c3a]" onClick={markAllNoticesRead}>
            Mark all read
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-[#6d655d]">{unreadCount ? `${unreadCount} unread` : "You are up to date."}</p>
      <div className="mt-8 space-y-3">
        {unreadNotices.length ? unreadNotices.map((item) => (
          <article key={item.id} className="rounded-2xl border border-black/10 bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c45c3a]">
              {item.kind} · {formatWhen(item.createdAt)}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-[#6d655d]">{item.body}</p>
            {item.href ? (
              <Link href={item.href} onClick={() => markNoticeRead(item.id)} className="mt-3 inline-block text-sm font-semibold text-[#16110e]">
                Open →
              </Link>
            ) : null}
          </article>
        )) : (
          <p className="rounded-3xl border border-black/10 p-8 text-[#6d655d]">No new notifications. When the studio publishes something new, it will land here.</p>
        )}
      </div>
    </Section>
  );
}
