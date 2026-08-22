import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessView } from "./SuccessView";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessView />
    </Suspense>
  );
}
