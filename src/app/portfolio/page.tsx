import type { Metadata } from "next";
import { site } from "@/data/site";
import { PortfolioView } from "./PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "See websites, apps, ecommerce, automation and studio work published by NovexaHub. Enquire on WhatsApp or email to purchase or customize.",
  alternates: { canonical: `${site.url}/portfolio` },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
