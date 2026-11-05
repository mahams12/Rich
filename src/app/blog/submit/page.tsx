import type { Metadata } from "next";
import { SubmitBlogView } from "./SubmitBlogView";

export const metadata: Metadata = {
  title: "Write for NovexaHub — earn a $1-equivalent reward per published article",
  description: "Submit a technical article to the NovexaHub journal. Approved submissions publish under your name and earn a $1 reward (or local equivalent).",
  robots: { index: false, follow: true },
};

export default function SubmitBlogPage() {
  return <SubmitBlogView />;
}
