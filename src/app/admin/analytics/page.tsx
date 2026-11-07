import type { Metadata } from "next";
import { AnalyticsView } from "./AnalyticsView";

export const metadata: Metadata = {
  title: "Website analytics",
  description: "Visitor intelligence dashboard.",
};

export default function AdminAnalyticsPage() {
  return <AnalyticsView />;
}
