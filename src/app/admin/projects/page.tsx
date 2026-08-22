import type { Metadata } from "next";
import { AdminProjectsView } from "./AdminProjectsView";

export const metadata: Metadata = { title: "Admin projects", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminProjectsView />;
}
