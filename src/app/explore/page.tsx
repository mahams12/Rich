import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreView } from "./ExploreView";

export const metadata: Metadata = {
  title: "Explore Digital Products",
  description:
    "Search websites, mobile apps, ecommerce, AI automation, UI/UX, posters, banners, product design, ads, video editing, custom software features, final-year kits and assignment writing on NovexaHub.",
  keywords: ["explore digital products", "website studio", "mobile app development", "AI automation"],
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="px-6 py-20 text-muted">Loading marketplace…</div>}>
      <ExploreView />
    </Suspense>
  );
}
