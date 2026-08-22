import type { Metadata } from "next";
import { NotificationsView } from "./NotificationsView";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: true },
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
