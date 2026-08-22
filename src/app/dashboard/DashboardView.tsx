"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { formatDate } from "@/lib/format";

export function DashboardView() {
  const { user, contacts, customizations, notices, unreadCount, favourites, projects } = useApp();

  if (!user) {
    return (
      <Section>
        <h1 className="display text-4xl">Client dashboard</h1>
        <p className="mt-3 text-[#6d655d]">Sign in to see saved requests. Purchases happen on WhatsApp or email, not here.</p>
        <Button href="/login?next=/dashboard" className="mt-6">Login</Button>
      </Section>
    );
  }

  const mine = contacts.filter((item) => item.email === user.email);
  const notes = customizations.filter((item) => item.email === user.email);

  return (
    <Section>
      <Badge>Client</Badge>
      <h1 className="display mt-3 text-4xl">Hello, {user.name.split(" ")[0]}</h1>
      <p className="mt-2 text-[#6d655d]">Favourites, live reviews, and studio alerts stay on this account.</p>
      <div className="mt-6">
        <ContactActions />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link href="/favourites" className="rounded-3xl border border-black/10 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6d655d]">Saved</p>
          <p className="display mt-2 text-3xl">{favourites.length}</p>
        </Link>
        <Link href="/notifications" className="rounded-3xl border border-black/10 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6d655d]">Unread alerts</p>
          <p className="display mt-2 text-3xl">{unreadCount}</p>
        </Link>
        <Link href="/portfolio" className="rounded-3xl border border-black/10 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6d655d]">Live listings</p>
          <p className="display mt-2 text-3xl">{projects.filter((item) => item.status === "published").length}</p>
        </Link>
      </div>
      {notices[0] ? (
        <article className="mt-8 rounded-3xl border border-black/10 bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c45c3a]">Latest from the studio</p>
          <p className="mt-2 font-semibold">{notices[0].title}</p>
          <p className="mt-1 text-sm text-[#6d655d]">{notices[0].body}</p>
          <Link href="/notifications" className="mt-3 inline-block text-sm font-semibold">All notifications</Link>
        </article>
      ) : null}
      {!mine.length ? (
        <p className="mt-8 rounded-3xl border border-black/10 bg-card p-8">No messages yet. <Link href="/portfolio" className="text-[#c45c3a]">Browse the portfolio</Link>.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {mine.map((item) => (
            <article key={item.id} className="rounded-3xl border border-black/10 bg-card p-5">
              <p className="font-semibold">{item.project || "General enquiry"}</p>
              <p className="mt-1 text-sm text-[#6d655d]">{formatDate(item.createdAt)}</p>
              <p className="mt-3 text-sm text-[#4a433c]">{item.message}</p>
            </article>
          ))}
        </div>
      )}
      {notes.length ? (
        <div className="mt-10">
          <h2 className="display text-2xl">Your customization notes</h2>
          <div className="mt-4 space-y-3">
            {notes.map((item) => (
              <p key={item.id} className="rounded-2xl border border-black/10 p-4 text-sm text-[#6d655d]">{item.projectTitle}: {item.words}</p>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
