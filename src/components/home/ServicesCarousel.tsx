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
    const step = node.clientWidth < 640 ? node.clientWidth * 0.82 : 360;
    node.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d655d]">About us</p>
          <h2 className="display mt-2 max-w-xl text-2xl tracking-tight sm:text-3xl md:text-4xl">Inspired work, built to last</h2>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white sm:h-11 sm:w-11"
            aria-label="Previous services"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white sm:h-11 sm:w-11"
            aria-label="Next services"
          >
            <Icon name="chevron-right" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mb-3 text-center text-xs text-[#6d655d] sm:hidden">Swipe to see more services →</p>

      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto pb-3 pl-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:pb-2 sm:pl-0 sm:snap-none [&::-webkit-scrollbar]:hidden"
      >
        {showcaseServices.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="relative h-[22rem] w-[76vw] max-w-[16.5rem] shrink-0 snap-center overflow-hidden rounded-[1.35rem] bg-[#111] sm:h-[34rem] sm:w-[min(72vw,22rem)] sm:max-w-none sm:rounded-[2rem] sm:snap-align-none"
          >
            {item.image ? (
              <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
            <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/20 text-white sm:left-4 sm:top-4 sm:h-11 sm:w-11">
              <Icon name={item.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white sm:right-4 sm:top-4 sm:px-3 sm:text-[11px]">
              {String(index + 1).padStart(2, "0")} / {total}
            </p>
            <div className="absolute inset-x-4 bottom-14 text-white sm:inset-x-5 sm:bottom-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">{item.kicker}</p>
              <h3 className="display mt-1.5 flex items-center gap-2 text-lg tracking-tight sm:mt-2 sm:text-2xl">
                {item.title}
                <Icon name="spark" className="h-3.5 w-3.5 text-white/80 sm:h-4 sm:w-4" />
              </h3>
              <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-white/80 sm:mt-3 sm:max-w-[17rem] sm:text-sm">{item.text}</p>
            </div>
            <span className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-white/50 text-white sm:bottom-5 sm:right-5 sm:h-11 sm:w-11">
              <Icon name="arrow-ne" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
