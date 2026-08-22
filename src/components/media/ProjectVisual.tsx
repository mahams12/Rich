"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { VisualKind, VisualMood } from "@/types";

const moods: Record<VisualMood, string> = {
  ocean: "from-[#1c1916] via-[#3f2a22] to-[#c45c3a]",
  sunset: "from-[#2a1612] via-[#8a3a28] to-[#e8b89a]",
  forest: "from-[#1a1f18] via-[#3d4a38] to-[#c4b08a]",
  neon: "from-[#1a1410] via-[#5c3a2e] to-[#d9c4b0]",
  gold: "from-[#1c1917] via-[#8a5a32] to-[#e8d5b0]",
  rose: "from-[#2a1418] via-[#8a3d48] to-[#f0c8c0]",
  mint: "from-[#141816] via-[#3d4a42] to-[#c5d0c4]",
  violet: "from-[#1a1418] via-[#5c3d48] to-[#d4c0c8]",
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80";

function isUploadedCover(url?: string) {
  if (!url) return false;
  return url.includes("firebasestorage.googleapis.com") || url.includes("firebasestorage.app") || url.startsWith("blob:");
}

export function ProjectVisual({
  kind,
  mood,
  title,
  cover,
  className,
}: {
  kind: VisualKind;
  mood: VisualMood;
  title: string;
  cover?: string;
  className?: string;
}) {
  const [src, setSrc] = useState(cover);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(cover);
    setFailed(false);
  }, [cover]);

  if (cover && src && !failed) {
    const fit = isUploadedCover(cover) ? "object-contain" : "object-cover";
    return (
      <div className={cn("relative overflow-hidden bg-[#1a1410]", className)}>
        <img
          key={src}
          src={src}
          alt={title}
          loading="eager"
          decoding="async"
          className={cn("h-full w-full", fit)}
          onError={() => {
            if (src !== FALLBACK_COVER) setSrc(FALLBACK_COVER);
            else setFailed(true);
          }}
        />
        {!isUploadedCover(cover) ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", moods[mood], className)} aria-hidden>
      <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <p className="absolute left-3 top-3 z-10 max-w-[70%] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
        {kind === "web" ? "Website" : kind === "mobile" ? "App" : kind === "shop" ? "Store" : kind === "dash" ? "Dashboard" : kind === "ai" ? "Automation" : kind === "brand" ? "Design" : "Feature"}
      </p>
      <div className="absolute bottom-3 left-3 right-3">
        {kind === "mobile" ? <PhoneMock /> : null}
        {kind === "web" ? <WebMock /> : null}
        {kind === "dash" ? <DashMock /> : null}
        {kind === "shop" ? <ShopMock /> : null}
        {kind === "ai" ? <AiMock /> : null}
        {kind === "brand" ? <BrandMock title={title} /> : null}
        {kind === "module" ? <ModuleMock /> : null}
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="mx-auto h-40 w-24 rounded-[1.4rem] border border-white/30 bg-black/40 p-1.5 shadow-2xl">
      <div className="h-full overflow-hidden rounded-[1.1rem] bg-white/10">
        <div className="h-8 bg-white/10" />
        <div className="space-y-1.5 p-2">
          <div className="h-10 rounded-lg bg-white/20" />
          <div className="h-2 w-2/3 rounded bg-white/30" />
          <div className="h-2 w-1/2 rounded bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function WebMock() {
  return (
    <div className="rounded-xl border border-white/20 bg-black/30 p-2 shadow-2xl">
      <div className="mb-2 flex gap-1">
        <i className="h-1.5 w-1.5 rounded-full bg-white/50" />
        <i className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <i className="h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="col-span-2 h-14 rounded-lg bg-white/20" />
        <div className="h-14 rounded-lg bg-white/10" />
        <div className="h-8 rounded-lg bg-white/15" />
        <div className="h-8 rounded-lg bg-white/10" />
        <div className="h-8 rounded-lg bg-white/20" />
      </div>
    </div>
  );
}

function DashMock() {
  return (
    <div className="rounded-xl border border-white/20 bg-black/35 p-2">
      <div className="mb-2 flex gap-2">
        <div className="h-8 flex-1 rounded-lg bg-white/15" />
        <div className="h-8 flex-1 rounded-lg bg-white/10" />
        <div className="h-8 flex-1 rounded-lg bg-amber-200/30" />
      </div>
      <div className="flex h-12 items-end gap-1 px-1">
        {[40, 70, 55, 90, 48, 76, 62].map((h, i) => (
          <span key={i} className="flex-1 rounded-t bg-white/40" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function ShopMock() {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg bg-white/15 p-1.5">
          <div className="mb-1 h-8 rounded bg-white/20" />
          <div className="h-1.5 w-2/3 rounded bg-white/40" />
        </div>
      ))}
    </div>
  );
}

function AiMock() {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <span className="h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_16px_#fcd34d]" />
      <span className="h-px w-10 bg-gradient-to-r from-amber-200 to-orange-300" />
      <span className="h-8 w-8 rounded-2xl border border-white/30 bg-white/10" />
      <span className="h-px w-10 bg-gradient-to-r from-orange-300 to-amber-200" />
      <span className="h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_16px_#fdba74]" />
    </div>
  );
}

function BrandMock({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-black/25 p-3 text-center">
      <p className="display text-lg tracking-wide text-white">{title.split(" ")[0]}</p>
      <div className="mx-auto mt-2 flex w-max gap-1">
        <span className="h-4 w-4 rounded-full bg-white/80" />
        <span className="h-4 w-4 rounded-full bg-white/50" />
        <span className="h-4 w-4 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

function ModuleMock() {
  return (
    <div className="flex gap-1.5">
      {["Cart", "Chat", "Pay"].map((label) => (
        <div key={label} className="flex-1 rounded-lg border border-white/20 bg-white/10 px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-widest text-white">
          {label}
        </div>
      ))}
    </div>
  );
}
