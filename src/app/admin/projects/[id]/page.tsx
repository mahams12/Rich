import type { Metadata } from "next";
import { EditProjectView } from "./EditProjectView";

export const metadata: Metadata = { title: "Edit project", robots: { index: false, follow: false } };

export default function Page() {
  return <EditProjectView />;
}
