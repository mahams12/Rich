import type { Metadata } from "next";
import { AdminOrdersView } from "./AdminOrdersView";

export const metadata: Metadata = { title: "Admin orders", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminOrdersView />;
}
