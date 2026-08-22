"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";

export function AdminVerifyPrompt() {
  const { reloadAuthUser, sendVerificationEmail, logout, firebaseReady } = useApp();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function resend() {
    setBusy(true);
    setMessage("");
    const ok = await sendVerificationEmail();
    setBusy(false);
    setMessage(ok ? "Confirmation email sent. Open the link, then tap the button below." : "Could not send email. Try again.");
  }

  async function checkVerified() {
    setBusy(true);
    setMessage("");
    const account = await reloadAuthUser();
    setBusy(false);
    if (account?.emailVerified) {
      router.push("/admin");
      return;
    }
    setMessage("Email not verified yet. Open the confirmation link in your inbox first.");
  }

  return (
    <Section className="max-w-lg">
      <h1 className="display text-4xl">Confirm your email</h1>
      <p className="mt-3 text-sm text-muted">
        We sent a confirmation link to your admin email. Open it and tap Yes, then return here.
      </p>
      <div className="glass mt-8 space-y-3 rounded-[2rem] p-6">
        {message ? <p className="text-sm text-[#c45c3a]">{message}</p> : null}
        {firebaseReady ? (
          <>
            <Button type="button" className="w-full" disabled={busy} onClick={checkVerified}>
              {busy ? "Checking…" : "I've confirmed my email"}
            </Button>
            <button
              type="button"
              onClick={resend}
              disabled={busy}
              className="w-full text-sm text-[#6d655d] underline-offset-4 hover:underline"
            >
              Resend confirmation email
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">Connect Firebase in .env.local to enable email confirmation.</p>
        )}
        <button type="button" onClick={logout} className="w-full text-sm text-muted underline-offset-4 hover:underline">
          Sign out
        </button>
      </div>
    </Section>
  );
}
