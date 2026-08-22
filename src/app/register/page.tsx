import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import { isAdminHost } from "@/data/domains";
import { LoginView } from "../login/LoginView";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a NovexaHub client account to save favourites and purchase ready-made digital products.",
  robots: { index: false, follow: true },
};

export default async function RegisterPage() {
  const host = (await headers()).get("host");
  if (isAdminHost(host)) redirect("/login?next=/admin");

  return (
    <Suspense>
      <LoginView mode="register" />
    </Suspense>
  );
}
