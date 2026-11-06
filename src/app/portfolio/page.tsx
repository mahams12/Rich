import type { Metadata } from "next";
import { projects as seedProjects } from "@/data/projects";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { PortfolioView } from "./PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore NovexaHub's published websites, mobile apps, ecommerce platforms, SaaS products and automation projects. View project details, technologies and customization options.",
  alternates: { canonical: `${site.url}/portfolio` },
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const catalog = await fetchCatalogServer();
  // Keep real project links in the initial HTML even if Firestore is briefly
  // unavailable during a crawler request or edge-cache refresh.
  return <PortfolioView initialProjects={catalog?.projects ?? seedProjects} />;
}
