"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { formatWhen } from "@/lib/format";
import type { NoticeKind } from "@/types";

const kindLabel: Record<NoticeKind, string> = {
  project: "Project",
  feature: "Feature",
  sale: "Sale",
  general: "Studio",
};

export function NotificationBell() {
  const { user, unreadNotices, unreadCount, markNoticeRead, markAllNoticesRead } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login?next=/notifications"
        className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/[0.04]"
        aria-label="Login for notifications"
      >
        <Icon name="bell" />
      </Link>
    );
  }

  const latest = unreadNotices.slice(0, 6);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-black/[0.04]"
        aria-label="Notifications"
      >
        <Icon name="bell" />
        {unreadCount ? (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#c45c3a] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(92vw,22rem)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount ? (
              <button
                type="button"
                className="text-xs text-[#c45c3a]"
                onClick={() => {
                  markAllNoticesRead();
                  setOpen(false);
                }}
              >
                Mark all read
              </button>
            ) : null}
          </div>
          {latest.length ? (
            <ul className="max-h-80 overflow-auto border-t border-black/10">
              {latest.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left hover:bg-black/[0.03]"
                    onClick={() => {
                      markNoticeRead(item.id);
                      setOpen(false);
                      router.push(item.href || "/notifications");
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c45c3a]">
                      {kindLabel[item.kind]} · {formatWhen(item.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#16110e]">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#6d655d]">{item.body}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-sm text-[#6d655d]">No new notifications.</p>
          )}
          <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-black/10 px-4 py-3 text-center text-sm font-semibold">
            View all
          </Link>
        </div>
      ) : null}
    </div>
  );
}
