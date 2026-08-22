import type { Metadata } from "next";
import { FeaturesView } from "./FeaturesView";

export const metadata: Metadata = {
  title: "Feature modules — Cart, Chat, Reels, Payments, Pages",
  description:
    "Add individual software features: cart, chat, calling, reels, authentication, payments, frontend pages, maps, notifications, booking, CMS and admin dashboards. Enquire on WhatsApp or email.",
};

export default function FeaturesPage() {
  return <FeaturesView />;
}
