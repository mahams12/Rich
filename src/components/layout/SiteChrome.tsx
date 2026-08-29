"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { site } from "@/data/site";
import { isStudioAdmin } from "@/lib/admin";
import { openMailClient } from "@/lib/contact";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, favourites, logout } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  function search(e: FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : "/portfolio");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 max-w-[100vw] overflow-x-clip">
        <div className="bg-paper/85 px-2 pt-2 pb-2 backdrop-blur-xl sm:px-4">
        <div className="glass flex min-w-0 items-center gap-1 rounded-full px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
          <Link href="/" className="min-w-0 shrink px-0.5 sm:px-1" aria-label="NovexaHub home">
            <Logo className="scale-[0.92] origin-left sm:scale-100" />
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm text-ink/70 transition hover:bg-black/[0.04] hover:text-ink",
                  pathname.startsWith(item.href) && "bg-black/[0.06] text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={search} className="relative ml-auto hidden min-w-0 flex-1 md:block lg:max-w-[220px]">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-black/10 bg-white py-2 pl-9 pr-3 text-sm outline-none"
              aria-label="Search projects"
            />
          </form>
          <NotificationBell />
          <Link
            href="/favourites"
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-black/[0.04] sm:h-10 sm:w-10"
            aria-label="Favourites"
          >
            <Icon name="heart" />
            {favourites.length ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c45c3a]" /> : null}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[9rem] truncate text-sm text-ink/80">
                Welcome, {user.name.split(" ")[0]}
              </span>
              {isStudioAdmin(user) ? (
                <Button href="/admin" variant="ghost" className="px-3 py-2 text-xs">
                  Admin
                </Button>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.04]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Button href="/login" variant="ghost" className="hidden px-3 py-2 sm:inline-flex">
              Login
            </Button>
          )}
          <Button href="/contact" className="hidden md:inline-flex">
            Talk to studio
          </Button>
          <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full md:hidden" aria-label="Open menu" onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
        {open ? (
          <div className="glass mt-2 max-h-[min(70svh,520px)] space-y-1 overflow-y-auto rounded-3xl p-3 md:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2.5 text-sm">
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-2xl bg-[#16110e] px-3 py-2.5 text-center text-sm font-semibold text-white">
              Talk to studio
            </Link>
            <Link href="/notifications" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2.5 text-sm">Notifications</Link>
            {user ? (
              <>
                <p className="rounded-2xl px-3 py-2 text-sm text-ink/80">Welcome, {user.name.split(" ")[0]}</p>
                {isStudioAdmin(user) ? (
                  <Link href="/admin" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2 text-sm font-semibold">
                    Admin panel
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-full rounded-2xl px-3 py-2 text-left text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2.5 text-sm">Login</Link>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-black/10 bg-[#ebe6de]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-[#6d655d]">{site.tagline} A digital studio. Enquire on WhatsApp or email — nothing is purchased on the site.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d655d]">Studio</p>
          <div className="mt-3 space-y-2 text-sm">
            <Link href="/portfolio" className="block hover:text-[#c45c3a]">Portfolio</Link>
            <Link href="/services" className="block hover:text-[#c45c3a]">Services</Link>
            <Link href="/features" className="block hover:text-[#c45c3a]">Feature modules</Link>
            <Link href="/contact" className="block hover:text-[#c45c3a]">WhatsApp & email</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Company</p>
          <div className="mt-3 space-y-2 text-sm">
            <Link href="/about" className="block hover:text-[#c45c3a]">About</Link>
            <Link href="/reviews" className="block hover:text-[#c45c3a]">Reviews</Link>
            <Link href="/contact" className="block hover:text-[#c45c3a]">Contact</Link>
            <Link href="/login" className="block hover:text-[#c45c3a]">Client login</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d655d]">Talk to us</p>
          <div className="mt-3 space-y-2 text-sm">
            <a
              href={`#`}
              onClick={(e) => {
                e.preventDefault();
                openMailClient();
              }}
              className="block hover:text-[#c45c3a]"
            >
              {site.email}
            </a>
            <Link href="/contact" className="block hover:text-[#c45c3a]">WhatsApp & email</Link>
            <Link href="/contact" className="block hover:text-[#c45c3a]">Contact form</Link>
          </div>
        </div>
      </div>
      <p className="border-t border-black/10 py-4 text-center text-xs text-muted">© 2026 {site.domain}</p>
    </footer>
  );
}

export function WhatsAppFab() {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi NovexaHub, I want to talk about a digital product.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 sm:text-sm sm:font-semibold"
      style={{ background: "#25D366", color: "#052e16" }}
      aria-label="Chat on WhatsApp"
    >
      <Icon name="whatsapp" className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
