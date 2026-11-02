import type { Metadata } from "next";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { PortfolioView } from "./PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "See websites, apps, ecommerce, automation and studio work published by NovexaHub. Enquire on WhatsApp or email to purchase or customize.",
  alternates: { canonical: `${site.url}/portfolio` },
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const catalog = await fetchCatalogServer();
  return <PortfolioView initialProjects={catalog?.projects} />;
}
