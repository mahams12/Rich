import type { Metadata } from "next";
import { ContactView } from "./ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact NovexaHub for websites, apps, ecommerce, AI automation, UI/UX, posters, banners, ads, video editing, custom features, final-year projects and assignment writing. WhatsApp and email available.",
};

export default function ContactPage() {
  return <ContactView />;
}
