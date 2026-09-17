import type { Metadata } from "next";
import { site } from "@/data/site";
import { BlogView } from "./BlogView";

export const metadata: Metadata = {
  title: "Blog — Software Projects, Apps & NovexaHub Insights",
  description:
    "NovexaHub blog on software projects, ready-made websites, mobile apps, AI automation, final-year projects, and how to work with the studio at novexahub.live.",
  keywords: [
    ...site.keywords,
    "software project blog",
    "NovexaHub blog",
    "custom software tips",
    "final year project ideas",
  ],
  alternates: { canonical: `${site.url}/blog` },
  openGraph: {
    title: "NovexaHub Blog",
    description: "Trends and guides on software projects, websites, apps, and the NovexaHub studio.",
    url: `${site.url}/blog`,
  },
};

export default function BlogPage() {
  return <BlogView />;
}
