import type { Metadata } from "next";
import { BuilderView } from "./BuilderView";

export const metadata: Metadata = {
  title: "Solution Builder",
  description:
    "Answer a few questions about business type, platform, budget and deadline. NovexaHub recommends ready-made digital products or a custom studio path.",
};

export default function BuilderPage() {
  return <BuilderView />;
}
