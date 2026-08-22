import type { Metadata } from "next";
import { AdminHome } from "./AdminBits";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminHome />;
}
