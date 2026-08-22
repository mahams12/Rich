"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { isStudioAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";

const links = [
  ["/admin", "Overview"],
  ["/admin/projects", "Projects"],
  ["/admin/projects/new", "New project"],
  ["/admin/requests", "Requests"],
  ["/admin/notifications", "Notifications"],
] as const;

export function AdminBar() {
  const pathname = usePathname();
  const { user, ready } = useApp();

  // Avoid SSR/client mismatch: only render after auth is ready.
  if (!ready || !isStudioAdmin(user)) return null;

  return (
    <div className="border-b border-[#c45c3a]/20 bg-[#16110e] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#c45c3a]">Studio admin</span>
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition hover:bg-white/10",
              pathname === href || (href !== "/admin" && pathname.startsWith(href))
                ? "bg-white/15 text-white"
                : "text-white/75",
            )}
          >
            {label}
          </Link>
        ))}
        <Link href="/portfolio" className="ml-auto text-xs text-white/60 hover:text-white">
          Browse site →
        </Link>
      </div>
    </div>
  );
}
