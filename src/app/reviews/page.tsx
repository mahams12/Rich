import type { Metadata } from "next";
import { site } from "@/data/site";
import { ReviewsView } from "./ReviewsView";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Client reviews for NovexaHub studio work.",
  alternates: { canonical: `${site.url}/reviews` },
};

export default function ReviewsPage() {
  return <ReviewsView />;
}
