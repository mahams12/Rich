import type { Metadata } from "next";
import { EditBlogView } from "./EditBlogView";

export const metadata: Metadata = { title: "Edit blog post", robots: { index: false, follow: false } };

export default function Page() {
  return <EditBlogView />;
}
