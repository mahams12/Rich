import type { Metadata } from "next";
import { AdminSubmissionsView } from "./AdminSubmissionsView";

export const metadata: Metadata = {
  title: "Blog submissions",
  description: "Review contributor blog submissions.",
};

export default function AdminSubmissionsPage() {
  return <AdminSubmissionsView />;
}
