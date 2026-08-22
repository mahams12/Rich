import type { Metadata } from "next";
import { HomeView } from "./HomeView";

export const metadata: Metadata = {
  title: { absolute: "NovexaHub | Buy Ready-Made Digital Products & Custom Software" },
  description:
    "NovexaHub.live is a Pinterest-inspired marketplace for ready-made websites, mobile apps, ecommerce, AI automation, UI/UX design, custom software features and creative services.",
};

export default function Page() {
  return <HomeView />;
}
