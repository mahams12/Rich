import { logAdminLoginFailed } from "@/lib/firebase/security";

export async function reportAdminLoginFailed(attemptedEmail: string) {
  const normalized = attemptedEmail.trim().toLowerCase();
  if (!normalized) return;

  void logAdminLoginFailed(normalized).catch(() => undefined);

  void fetch("/api/security/admin-login-failed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attemptedEmail: normalized }),
  }).catch(() => undefined);
}
