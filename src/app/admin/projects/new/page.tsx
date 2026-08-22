import type { Metadata } from "next";
import { NewProjectView } from "./NewProjectView";

export const metadata: Metadata = { title: "New project", robots: { index: false, follow: false } };

export default function Page() {
  return <NewProjectView />;
}
