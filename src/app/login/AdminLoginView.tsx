"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { isPrimaryAdminEmail } from "@/lib/firebase/config";

export function AdminLoginView() {
  const { adminLogin, resetPassword, firebaseReady, user, ready } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!ready || !user) return;
    if (!isPrimaryAdminEmail(user.email) || user.role !== "admin") return;
    router.replace(next.startsWith("/admin") ? next : "/admin");
  }, [ready, user, next, router]);

  if (!ready) {
    return (
      <Section className="max-w-lg">
        <p className="text-sm text-muted">Restoring your session…</p>
      </Section>
    );
  }

  if (user && isPrimaryAdminEmail(user.email) && user.role === "admin") {
    return null;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await adminLogin(email, password);
    setBusy(false);
    if (result.ok) router.push(next.startsWith("/admin") ? next : "/admin");
    else if (result.error) setError(result.error);
  }

  async function sendReset() {
    const form = formRef.current;
    if (!form) return;
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) {
      setError("Enter your admin email first, then tap forgot password.");
      return;
    }
    if (!isPrimaryAdminEmail(email)) {
      setError(`Only the studio admin email can reset access here.`);
      return;
    }
    setBusy(true);
    setError("");
    const ok = await resetPassword(email);
    setBusy(false);
    if (ok) setError("Reset link sent. Check your inbox.");
  }

  return (
    <Section className="max-w-lg">
      <Badge>Studio admin</Badge>
      <h1 className="display mt-4 text-4xl">Admin login</h1>
      <p className="mt-3 text-sm text-muted">
        Studio access only. Enter your admin email and password — no registration on this panel.
      </p>
      <form ref={formRef} onSubmit={submit} className="glass mt-8 space-y-4 rounded-[2rem] p-6">
        <Field label="Admin email">
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className={inputClass}
            placeholder="you@studio.com"
          />
        </Field>
        <Field label="Password">
          <input name="password" type="password" required className={inputClass} minLength={6} autoComplete="current-password" />
        </Field>
        {error ? <p className="text-sm text-[#c45c3a]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Please wait…" : "Sign in"}
        </Button>
        {firebaseReady ? (
          <button
            type="button"
            onClick={sendReset}
            className="w-full text-sm text-[#6d655d] underline-offset-4 hover:underline"
            disabled={busy}
          >
            Forgot password?
          </button>
        ) : null}
      </form>
      {!firebaseReady ? (
        <p className="mt-4 text-xs text-muted">Demo mode: connect Firebase in .env.local for production admin security.</p>
      ) : null}
    </Section>
  );
}
