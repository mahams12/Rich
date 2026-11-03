import type { Metadata } from "next";
import { SubmitBlogView } from "./SubmitBlogView";

export const metadata: Metadata = {
  title: "Write for NovexaHub — earn 50 PKR per published article",
  description: "Submit a technical article to the NovexaHub journal. Approved submissions publish under your name and earn a 50 PKR reward.",
};

export default function SubmitBlogPage() {
  return <SubmitBlogView />;
}
