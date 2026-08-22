"use client";

import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

export function HeroStage() {
  return (
    <section className="relative bg-[#ece7e0] p-3">
      <div className="h-[calc(100svh-5.5rem)] min-h-[520px]">
        <TiltCard className="rounded-[1.35rem] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10" max={8} smoke>
          <img
            src="/brand/hero-studio.jpg"
            alt="NovexaHub studio"
            className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/55 to-transparent" />
          <div className="relative z-30 flex h-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
            <p className="font-display text-xl tracking-tight text-white/80">novexa</p>
            <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Find it. Customize it. Build it.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Ready-made websites, apps, ecommerce, automation and studio work. Message WhatsApp or email to purchase or customize.
            </p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Digital products · Custom studio · {site.domain}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/portfolio" variant="light">
                See our work
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button href="/contact" variant="outline">
                Talk to the studio
              </Button>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
