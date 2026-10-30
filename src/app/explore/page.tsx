import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/data/site";
import { ExploreView } from "./ExploreView";
import { Section } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Explore Digital Products",
  description:
    "Search websites, mobile apps, ecommerce, AI automation, UI/UX, posters, banners, product design, ads, video editing, custom software features, final-year kits and assignment writing on NovexaHub.",
  keywords: ["explore digital products", "website studio", "mobile app development", "AI automation"],
  alternates: { canonical: `${site.url}/explore` },
};

export default function ExplorePage() {
  return (
    <>
      <Section>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c45c3a]">Explore</p>
        <h1 className="display mt-2 text-4xl">Every digital product, visually</h1>
        <p className="mt-3 max-w-2xl text-muted">Search websites of any kind, mobile apps, ecommerce, AI automation, UI/UX, posters, banners, product design, ads, video editing, posting, cart/chat/calling/reels/pages, customized builds, final-year kits and assignment writing.</p>
      </Section>
      <Suspense fallback={<Section><p className="py-8 text-muted">Loading marketplace…</p></Section>}>
        <ExploreView />
      </Suspense>
    </>
  );
}
