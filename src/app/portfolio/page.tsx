import type { Metadata } from "next";
import { PortfolioView } from "./PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "See websites, apps, ecommerce, automation and studio work published by NovexaHub. Enquire on WhatsApp or email to purchase or customize.",
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
