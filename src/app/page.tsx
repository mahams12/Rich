import type { Metadata } from "next";
import { faqs } from "@/data/content";
import { site } from "@/data/site";
import { HomeView } from "./HomeView";

export const metadata: Metadata = {
  title: { absolute: "NovexaHub | Buy Ready-Made Digital Products & Custom Software" },
  description:
    "Explore ready-made websites, mobile apps, ecommerce solutions and AI automation, or hire NovexaHub for custom software and UI/UX design.",
  alternates: { canonical: site.url },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeView />
    </>
  );
}
