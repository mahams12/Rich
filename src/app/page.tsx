import type { Metadata } from "next";
import { HomeView } from "./HomeView";

export const metadata: Metadata = {
  title: { absolute: "NovexaHub | Buy Ready-Made Digital Products & Custom Software" },
  description:
    "Explore ready-made websites, mobile apps, ecommerce solutions and AI automation, or hire NovexaHub for custom software and UI/UX design.",
};

export default function Page() {
  return <HomeView />;
}
