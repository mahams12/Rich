"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section } from "@/components/ui/Button";
import { isPrimaryAdminEmail } from "@/lib/firebase/config";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useApp();
  const isAdmin = Boolean(user?.role === "admin" && user.email && isPrimaryAdminEmail(user.email));

  // Cached session → show admin UI immediately while Firebase confirms.
  if (!ready && isAdmin) return <>{children}</>;

  if (!ready) {
    return (
      <Section>
        <p className="text-sm text-muted">Restoring your session…</p>
      </Section>
    );
  }

  if (!isAdmin) {
    return (
      <Section>
        <h1 className="display text-4xl">Admin</h1>
        <p className="mt-3 text-muted">Studio access only. Sign in with your admin credentials.</p>
        <Button href="/login?next=/admin" className="mt-6">Admin login</Button>
      </Section>
    );
  }

  return <>{children}</>;
}

export function AdminNav() {
  const links = [
    ["/admin", "Overview"],
    ["/admin/projects", "Projects"],
    ["/admin/notifications", "Notifications"],
    ["/admin/requests", "Requests"],
  ];
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/[0.04]">
          {label}
        </Link>
      ))}
    </div>
  );
}

export function AdminHome() {
  const { projects, contacts, customizations, favourites, notices } = useApp();
  const published = projects.filter((item) => item.status === "published").length;

  const cards = [
    ["Published projects", published],
    ["Contact requests", contacts.length],
    ["Customizations", customizations.length],
    ["Favourites saved", favourites.length],
    ["Notifications sent", notices.length],
  ];

  return (
    <Section>
      <AdminGate>
        <Badge>Admin</Badge>
        <h1 className="display mt-3 text-4xl">Marketplace control</h1>
        <p className="mt-2 text-muted">Listings, requests and enquiries. Clients purchase through WhatsApp or email.</p>
        <div className="mt-8">
          <AdminNav />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([label, value]) => (
            <article key={String(label)} className="glass rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
              <p className="display mt-2 text-3xl">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <Button href="/admin/notifications">Push a notification</Button>
          <Button href="/admin/projects" variant="ghost">Manage projects</Button>
        </div>
      </AdminGate>
    </Section>
  );
}
