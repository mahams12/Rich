"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FoundersSection } from "@/components/home/FoundersSection";
import { HeroStage } from "@/components/home/HeroStage";
import { ProjectFan } from "@/components/home/ProjectFan";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { TechStack } from "@/components/home/TechStack";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { Icon } from "@/components/ui/Icon";
import { faqs, processSteps, reviews as catalogReviews, serviceTicker } from "@/data/content";
import { getPublishedProjects } from "@/data/projects";
import type { Project } from "@/types";

export function HomeView({ initialProjects }: { initialProjects?: Project[] }) {
  const { projects, catalogReady, reviews: liveReviews } = useApp();
  const [openFaq, setOpenFaq] = useState(0);
  // Same merge as PortfolioView: server-rendered catalog shows immediately,
  // the live snapshot takes over once it delivers fresher data.
  const effectiveProjects = catalogReady || !initialProjects?.length ? projects : initialProjects;
  const publishedList = useMemo(() => getPublishedProjects(effectiveProjects), [effectiveProjects]);
  const published = publishedList.length;
  const allReviews = useMemo(
    () => [...liveReviews, ...catalogReviews].filter((item) => !item.sample),
    [liveReviews],
  );
  const previewCount = 3;
  const visibleReviews = allReviews.slice(0, previewCount);

  return (
    <>
      <HeroStage />

      <div className="overflow-hidden border-y border-black/10 bg-[#ebe6de]">
        <div className="flex gap-10 px-4 py-4">
          <div className="marquee flex min-w-max gap-10 text-sm text-[#4a433c]">
            {[...serviceTicker, ...serviceTicker].map((item, i) => (
              <span key={`${item}-${i}`} className="inline-flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-[#a14b30]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ServicesCarousel />
      <TechStack />
      <ProjectFan items={publishedList} />

      <Section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a14b30]">How it works</p>
        <h2 className="display mt-2 text-3xl tracking-tight">Talk first. Build next.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-5">
          {processSteps.map((step) => (
            <div key={step.n} className="rounded-3xl border border-black/10 bg-card p-5">
              <p className="display text-2xl text-[#a14b30]">{step.n}</p>
              <p className="mt-2 font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-[#6d655d]">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {allReviews.length ? (
      <Section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a14b30]">Reviews</p>
            <h2 className="display mt-2 text-3xl tracking-tight">What clients say</h2>
          </div>
          <Button href="/reviews" variant="ghost">All reviews</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {visibleReviews.map((item) => (
            <blockquote key={item.id} className="rounded-3xl border border-black/10 bg-card p-6">
              <div className="mb-3 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className={`h-4 w-4 ${i < item.rating ? "text-[#a14b30]" : "text-black/15"}`} />
                ))}
              </div>
              <p>“{item.quote}”</p>
              <p className="mt-4 text-sm text-[#6d655d]">{item.name} · {item.role}</p>
            </blockquote>
          ))}
        </div>
        {allReviews.length > previewCount ? (
          <div className="mt-6 text-center">
            <Link
              href="/reviews"
              className="text-sm font-semibold text-[#16110e] underline-offset-4 hover:underline"
            >
              See all {allReviews.length} reviews
            </Link>
          </div>
        ) : null}
      </Section>
      ) : null}

      <FoundersSection />

      <Section>
        <h2 className="display text-3xl tracking-tight">Questions</h2>
        <div className="mt-6 divide-y divide-black/10 overflow-hidden rounded-[1.4rem] border border-black/10 bg-card">
          {faqs.map((item, i) => (
            <button
              key={item.q}
              type="button"
              className="w-full px-5 py-4 text-left hover:bg-black/[0.03]"
              onClick={() => setOpenFaq(i === openFaq ? -1 : i)}
              aria-expanded={openFaq === i}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">{item.q}</p>
                <span className="text-[#a14b30]">{openFaq === i ? "–" : "+"}</span>
              </div>
              {openFaq === i ? <p className="mt-2 text-sm text-[#6d655d]">{item.a}</p> : null}
            </button>
          ))}
        </div>
      </Section>

      <Section className="pt-4">
        <div className="rounded-[1.6rem] bg-[#1a1410] px-6 py-14 text-center text-white">
          <h2 className="display text-4xl tracking-tight">Ready to start building?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            {published ? `${published} published projects on the site. ` : ""}Message us on WhatsApp or email to purchase, customize, or start from scratch.
          </p>
          <div className="mt-7 flex justify-center">
            <ContactActions />
          </div>
        </div>
      </Section>
    </>
  );
}
