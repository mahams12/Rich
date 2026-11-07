import type { Metadata } from "next";
import { SubmissionsView } from "./SubmissionsView";

export const metadata: Metadata = {
  title: "My submissions",
  description: "Track your submitted, approved and rejected articles on NovexaHub.",
  robots: { index: false, follow: true },
};

export default function SubmissionsPage() {
  return <SubmissionsView />;
}
