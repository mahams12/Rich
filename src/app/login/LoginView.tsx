"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { isAdminEmail } from "@/lib/firebase/config";

function isGoogleRedirectPending() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("novexah-google-redirect") === "1";
}

function destination(email: string, next: string) {
  if (isAdminEmail(email)) return "/admin";
  if (next === "/admin") return "/";
  if (next === "/dashboard") return "/";
  return next;
}

export function LoginView({ mode }: { mode: "login" | "register" }) {
  const { login, register, resetPassword, loginWithGoogle, firebaseReady, user, ready } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!user) return;
    // Don't wait for ready — leave login as soon as we have a session.
    const dest = destination(user.email, next);
    if (window.location.pathname.startsWith("/login") || window.location.pathname.startsWith("/register")) {
      window.location.replace(dest);
    }
  }, [user, next]);

  if (user) {
    return (
      <Section className="max-w-lg">
        <p className="text-sm text-muted">Signed in — opening…</p>
      </Section>
    );
  }

  if (!ready) {
    return (
      <Section className="max-w-lg">
        <p className="text-sm text-muted">
          {isGoogleRedirectPending() ? "Finishing Google sign-in…" : "Restoring your session…"}
        </p>
      </Section>
    );
  }

  if (isGoogleRedirectPending()) {
    return (
      <Section className="max-w-lg">
        <h1 className="display text-3xl">Google sign-in</h1>
        <p className="mt-4 text-sm text-muted">Finishing Google sign-in…</p>
      </Section>
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "");
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    const result =
      mode === "register"
        ? await register(name, email, password)
        : await login(email, password, name);
    setBusy(false);
    if (result.ok) router.push(destination(email, next));
    else if (result.error) setError(result.error);
  }

  async function sendReset() {
    const form = formRef.current;
    if (!form) return;
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) {
      setError("Enter your email first, then tap forgot password.");
      return;
    }
    setBusy(true);
    await resetPassword(email);
    setBusy(false);
  }

  async function googleSignIn() {
    setBusy(true);
    setError("");
    sessionStorage.setItem("novexah-auth-next", next);
    try {
      const result = await loginWithGoogle();
      if (result.redirecting) return;
      if (result.account) {
        // Hard navigate so the home/next page opens immediately.
        window.location.replace(destination(result.account.email, next));
        return;
      }
      setBusy(false);
      if (result.error) setError(result.error);
    } catch {
      setBusy(false);
      setError("Google sign-in failed. Try again.");
    }
  }

  return (
    <Section className="max-w-lg">
      <Badge>{mode === "login" ? "Welcome back" : "Create account"}</Badge>
      <h1 className="display mt-4 text-4xl">{mode === "login" ? "Login" : "Register"}</h1>
      <p className="mt-3 text-sm text-muted">
        {mode === "login"
          ? "Sign in with email/password, or Continue with Google. Google accounts don’t use a password here."
          : "Create a client account with email or Google — studio admin access is separate."}
      </p>
      <div className="glass mt-8 space-y-4 rounded-[2rem] p-6">
        <form ref={formRef} onSubmit={submit} method="post" className="space-y-4">
          {mode === "register" ? (
            <Field label="Name">
              <input name="name" required className={inputClass} />
            </Field>
          ) : null}
          <Field label="Email">
            <input name="email" type="email" required className={inputClass} placeholder="you@studio.com" />
          </Field>
          <Field label="Password">
            <input name="password" type="password" required className={inputClass} minLength={6} />
          </Field>
          {error ? <p className="text-sm text-[#c45c3a]">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>
          {mode === "login" ? (
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

        <div className="relative z-10 border-t border-black/10 pt-4">
          {firebaseReady ? (
            <button
              type="button"
              onClick={googleSignIn}
              disabled={busy}
              className="relative z-10 flex w-full cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#16110e] transition hover:bg-black/[0.03] disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Continue with Google"}
            </button>
          ) : (
            <p className="text-center text-xs text-muted">Connect Firebase in .env.local to enable Google sign-in.</p>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        {mode === "login" ? (
          <>Need an account? <Link href="/register" className="text-[#c45c3a]">Register</Link></>
        ) : (
          <>Already registered? <Link href="/login" className="text-[#c45c3a]">Login</Link></>
        )}
      </p>
    </Section>
  );
}
