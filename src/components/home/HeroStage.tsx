"use client";

import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

export function HeroStage() {
  return (
    <section className="relative bg-[#ece7e0] p-2 sm:p-3">
      <div className="h-auto min-h-[32rem] sm:h-[calc(100svh-5.5rem)] sm:min-h-[520px]">
        <TiltCard
          className="min-h-[32rem] rounded-2xl bg-[#1a1410] shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10 sm:min-h-0 sm:rounded-[1.35rem]"
          max={8}
          smoke
        >
          {/* Mobile: full photo visible (no crop). Desktop: cinematic cover. */}
          <img
            src="/brand/hero-studio.jpg"
            alt="NovexaHub studio"
            className="absolute inset-0 h-full w-full object-contain object-center sm:object-cover sm:object-[78%_center]"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/75 to-black/20 sm:bg-gradient-to-r sm:from-black sm:via-black/55 sm:to-transparent" />
          <div className="relative z-30 flex min-h-[32rem] max-w-3xl flex-col justify-end px-4 pb-8 pt-36 sm:min-h-0 sm:justify-center sm:px-10 sm:py-16 sm:pt-16 lg:px-16">
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
            <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
              <Button href="/portfolio" variant="light" className="w-full justify-center sm:w-auto">
                See our work
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button href="/contact" variant="outline" className="w-full justify-center sm:w-auto">
                Talk to the studio
              </Button>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
