import { FirebaseError } from "firebase/app";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { INVALID_CREDENTIALS } from "@/lib/auth/messages";
import { getFirebaseAuth } from "./client";

const GOOGLE_ONLY =
  "This email already uses Google sign-in. Tap Continue with Google — there is no password for this account yet.";

const ALREADY_REGISTERED =
  "That email already has an account. Try Login, or Continue with Google if you signed up that way.";

export function firebaseErrorMessage(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return INVALID_CREDENTIALS;
    case "auth/email-already-in-use":
      return ALREADY_REGISTERED;
    case "auth/weak-password":
      return "Use at least 6 characters for the password.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Google sign-in was closed. Try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google popup. Allow popups for this site, then try again.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled yet. In Firebase Console open Authentication → Sign-in method → Google → Enable, then Save.";
    case "auth/unauthorized-domain":
      return "This site domain is not authorized for Google sign-in. Add it under Firebase → Authentication → Settings → Authorized domains.";
    case "auth/account-exists-with-different-credential":
      return GOOGLE_ONLY;
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/internal-error":
      return "Google sign-in failed. Try again, or use email/password.";
    case "permission-denied":
      return "Firebase permission denied. Deploy the Firestore rules for this project.";
    default:
      if (error instanceof FirebaseError) {
        return `${error.message} (${error.code})`;
      }
      if (error instanceof Error && error.message) return error.message;
      return "Something went wrong. Try again.";
  }
}

/** Clearer copy when the email is Google-only (no password). */
export async function resolveAuthErrorMessage(email: string, error: unknown) {
  const base = firebaseErrorMessage(error);
  const code = error instanceof FirebaseError ? error.code : "";
  const auth = getFirebaseAuth();
  if (!auth || !email.trim()) return base;

  const credentialFail =
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found" ||
    code === "auth/invalid-login-credentials" ||
    code === "auth/email-already-in-use";

  if (!credentialFail) return base;

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email.trim().toLowerCase());
    if (methods.includes("google.com") && !methods.includes("password")) {
      return GOOGLE_ONLY;
    }
    if (code === "auth/email-already-in-use" && methods.includes("google.com")) {
      return GOOGLE_ONLY;
    }
  } catch {
    /* enumeration protection may hide methods */
  }

  if (credentialFail && code !== "auth/email-already-in-use") {
    return `${INVALID_CREDENTIALS} If you signed up with Google, use Continue with Google.`;
  }
  return base;
}
