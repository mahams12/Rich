"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/ui/Button";

/** Old bookmark URL — send people to the normal login Google button. */
function GoogleRedirect() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const next = params.get("next") || "/";
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [params, router]);

  return (
    <Section className="max-w-lg">
      <h1 className="display text-3xl">Google sign-in</h1>
      <p className="mt-4 text-sm text-muted">Taking you to login…</p>
      <Link href="/login" className="mt-6 inline-block text-sm text-[#c45c3a] underline-offset-4 hover:underline">
        Back to login
      </Link>
    </Section>
  );
}

export default function GoogleAuthPage() {
  return (
    <Suspense>
      <GoogleRedirect />
    </Suspense>
  );
}
