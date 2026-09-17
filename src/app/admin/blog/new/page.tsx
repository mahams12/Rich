import type { Metadata } from "next";
import { NewBlogView } from "./NewBlogView";

export const metadata: Metadata = { title: "New blog post", robots: { index: false, follow: false } };

export default function Page() {
  return <NewBlogView />;
}
