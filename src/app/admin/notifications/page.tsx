import type { Metadata } from "next";
import { AdminNoticesView } from "./AdminNoticesView";

export const metadata: Metadata = {
  title: "Push notifications",
  robots: { index: false, follow: false },
};

export default function AdminNotificationsPage() {
  return <AdminNoticesView />;
}
