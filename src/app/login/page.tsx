import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { isAdminHost } from "@/data/domains";
import { AdminLoginView } from "./AdminLoginView";
import { LoginView } from "./LoginView";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to NovexaHub to save favourite projects.",
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const host = (await headers()).get("host");
  const admin = isAdminHost(host);

  return (
    <Suspense>
      {admin ? <AdminLoginView /> : <LoginView mode="login" />}
    </Suspense>
  );
}
