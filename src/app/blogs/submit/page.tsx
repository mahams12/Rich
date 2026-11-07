import type { Metadata } from "next";
import { SubmitBlogView } from "./SubmitBlogView";

export const metadata: Metadata = {
  title: "Write for NovexaHub — earn $1 for every 5–10 approved articles",
  description: "Submit a technical article to the NovexaHub journal. Approved submissions publish under your name and earn $1 for every 5–10 approved blogs.",
  robots: { index: false, follow: true },
};

export default function SubmitBlogPage() {
  return <SubmitBlogView />;
}
