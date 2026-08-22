import type { Metadata } from "next";
import { ReviewsView } from "./ReviewsView";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Client reviews for NovexaHub studio work.",
};

export default function ReviewsPage() {
  return <ReviewsView />;
}
