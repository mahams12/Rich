import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactView } from "./ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact NovexaHub for websites, apps, ecommerce, AI automation, UI/UX, posters, banners, ads, video editing, custom features, final-year projects and assignment writing. WhatsApp and email available.",
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return <ContactView />;
}
