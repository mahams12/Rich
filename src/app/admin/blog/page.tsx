import type { Metadata } from "next";
import { AdminBlogView } from "./AdminBlogView";

export const metadata: Metadata = { title: "Admin blog", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminBlogView />;
}
