"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { showcaseServices } from "@/data/showcase";

export function ServicesCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const total = String(showcaseServices.length).padStart(2, "0");

  function scroll(dir: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d655d]">About us</p>
          <h2 className="display mt-2 max-w-xl text-3xl tracking-tight sm:text-4xl">Inspired work, built to last</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-white"
            aria-label="Previous services"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-white"
            aria-label="Next services"
          >
            <Icon name="chevron-right" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {showcaseServices.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="relative h-[34rem] w-[min(86vw,22rem)] shrink-0 overflow-hidden rounded-[2rem] bg-[#111]"
          >
            {item.image ? (
              <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
            <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-black/20 text-white">
              <Icon name={item.icon} className="h-5 w-5" />
            </div>
            <p className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium tracking-wide text-white">
              {String(index + 1).padStart(2, "0")} / {total}
            </p>
            <div className="absolute inset-x-5 bottom-16 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{item.kicker}</p>
              <h3 className="display mt-2 flex items-center gap-2 text-2xl tracking-tight">
                {item.title}
                <Icon name="spark" className="h-4 w-4 text-white/80" />
              </h3>
              <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-white/80">{item.text}</p>
            </div>
            <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white">
              <Icon name="arrow-ne" className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
