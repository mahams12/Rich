import type { Metadata } from "next";
import { AdminRequestsView } from "./AdminRequestsView";

export const metadata: Metadata = { title: "Admin requests", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminRequestsView />;
}
