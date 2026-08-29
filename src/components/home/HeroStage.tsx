"use client";

import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

function HeroCopy({ stacked }: { stacked?: boolean }) {
  return (
    <>
      <p className="font-display text-lg tracking-tight text-white/80 sm:text-xl">novexa</p>
      <h1 className="mt-2 max-w-xl text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-white sm:mt-3 sm:text-4xl md:text-6xl">
        Find it. Customize it. Build it.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-base md:text-lg">
        Ready-made websites, apps, ecommerce, automation and studio work. Message WhatsApp or email to purchase or customize.
      </p>
      <p className="mt-3 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 sm:mt-4 sm:block">
        Digital products · Custom studio · {site.domain}
      </p>
      <div
        className={
          stacked
            ? "mt-5 flex w-full flex-col gap-2.5"
            : "mt-5 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3"
        }
      >
        <Button href="/portfolio" variant="light" className="w-full justify-center sm:w-auto">
          See our work
          <Icon name="arrow" className="h-4 w-4" />
        </Button>
        <Button href="/contact" variant="outline" className="w-full justify-center sm:w-auto">
          Talk to the studio
        </Button>
      </div>
    </>
  );
}

export function HeroStage() {
  return (
    <section className="relative bg-[#ece7e0] p-2 sm:p-3">
      {/* Mobile: portrait crop fills the frame — no letterboxing */}
      <div className="sm:hidden">
        <TiltCard
          className="overflow-hidden rounded-2xl bg-[#1a1410] shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
          max={4}
          smoke
        >
          <div className="relative aspect-[9/16] w-full max-h-[min(72svh,40rem)]">
            <img
              src="/brand/hero-studio-mobile.jpg"
              alt="NovexaHub studio"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 pt-24">
              <HeroCopy stacked />
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Desktop: wide cinematic hero */}
      <div className="hidden h-[calc(100svh-5.5rem)] min-h-[520px] sm:block">
        <TiltCard
          className="h-full rounded-[1.35rem] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
          max={8}
          smoke
        >
          <img
            src="/brand/hero-studio.jpg"
            alt="NovexaHub studio"
            className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/55 to-transparent" />
          <div className="relative z-30 flex h-full max-w-3xl flex-col justify-center px-10 py-16 lg:px-16">
            <HeroCopy />
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
