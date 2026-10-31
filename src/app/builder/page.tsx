import type { Metadata } from "next";
import { site } from "@/data/site";
import { BuilderView } from "./BuilderView";

export const metadata: Metadata = {
  title: "Solution Builder",
  description:
    "Answer a few questions about business type, platform, budget and deadline. NovexaHub recommends ready-made digital products or a custom studio path.",
  alternates: { canonical: `${site.url}/builder` },
};

export default function BuilderPage() {
  return <BuilderView />;
}
