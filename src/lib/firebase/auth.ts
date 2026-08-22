import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import type { UserAccount } from "@/types";
import { getFirebaseAuth, getFirebaseDb } from "./client";
import { isAdminEmail, isPrimaryAdminEmail } from "./config";

export const AUTH_NEXT_KEY = "novexah-auth-next";
export const GOOGLE_REDIRECT_FLAG = "novexah-google-redirect";

function toAccount(user: User, role: UserAccount["role"], name?: string): UserAccount {
  return {
    uid: user.uid,
    name: name || user.displayName || user.email?.split("@")[0] || "Client",
    email: (user.email || "").toLowerCase(),
    role,
    emailVerified: user.emailVerified,
  };
}

async function ensureProfile(user: User, name?: string) {
  const email = (user.email || "").toLowerCase();
  const role: UserAccount["role"] = isAdminEmail(email) ? "admin" : "client";
  const displayName = name || user.displayName || email.split("@")[0] || "Client";
  const fallback = toAccount(user, role, displayName);

  const db = getFirebaseDb();
  if (!db) return fallback;

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        name: displayName,
        email,
        role,
        favourites: [],
        readNoticeIds: [],
        createdAt: serverTimestamp(),
      });
    } else {
      const data = snap.data();
      await setDoc(
        ref,
        {
          name: data.name || displayName,
          email,
          role: data.role === "admin" || isAdminEmail(email) ? "admin" : "client",
        },
        { merge: true },
      );
    }
    const latest = (await getDoc(ref)).data();
    return toAccount(user, latest?.role === "admin" ? "admin" : role, latest?.name || displayName);
  } catch {
    return fallback;
  }
}

export async function firebaseLogin(email: string, password: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured.");
  const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return ensureProfile(cred.user);
}

export async function firebaseAdminLogin(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!isPrimaryAdminEmail(normalized)) {
    throw new Error("Only the studio admin email can sign in here.");
  }
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured.");
  const cred = await signInWithEmailAndPassword(auth, normalized, password);
  if (!isPrimaryAdminEmail(cred.user.email)) {
    await signOut(auth);
    throw new Error("Only the studio admin email can sign in here.");
  }
  if (!cred.user.emailVerified) {
    void sendEmailVerification(cred.user).catch(() => undefined);
  }
  const account = await ensureProfile(cred.user);
  return { account, emailVerified: cred.user.emailVerified };
}

export async function firebaseSendVerificationEmail() {
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) throw new Error("Sign in first.");
  if (auth.currentUser.emailVerified) return;
  await sendEmailVerification(auth.currentUser);
}

export async function firebaseReloadAuthUser() {
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) return null;
  await reload(auth.currentUser);
  return ensureProfile(auth.currentUser);
}

export async function firebaseRegister(name: string, email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (isAdminEmail(normalized)) {
    throw new Error("The studio admin account cannot be created via registration.");
  }
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured.");
  const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
  return ensureProfile(cred.user, name.trim());
}

function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("email");
  provider.addScope("profile");
  return provider;
}

export function isGoogleRedirectPending() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(GOOGLE_REDIRECT_FLAG) === "1";
}

/** Prefer popup (COOP header allows it). Fall back to redirect if popup is blocked. */
export async function firebaseGoogleLogin(): Promise<UserAccount | { redirecting: true }> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured.");

  const pending = await firebaseGoogleRedirectResult();
  if (pending) return pending;

  try {
    const cred = await signInWithPopup(auth, googleProvider());
    sessionStorage.removeItem(GOOGLE_REDIRECT_FLAG);
    return ensureProfile(cred.user);
  } catch (error) {
    const code = error instanceof FirebaseError ? error.code : "";
    if (code === "auth/popup-closed-by-user") throw error;

    // Popup blocked / COOP / internal → full-page redirect
    if (
      code === "auth/popup-blocked" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/internal-error" ||
      code === "auth/argument-error"
    ) {
      sessionStorage.setItem(GOOGLE_REDIRECT_FLAG, "1");
      if (!sessionStorage.getItem(AUTH_NEXT_KEY)) sessionStorage.setItem(AUTH_NEXT_KEY, "/");
      await signInWithRedirect(auth, googleProvider());
      return { redirecting: true };
    }
    throw error;
  }
}

/** Finish Google redirect. Safe to call once on startup before listening to auth. */
export async function firebaseGoogleRedirectResult() {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  try {
    const cred = await getRedirectResult(auth);
    if (cred?.user) {
      sessionStorage.removeItem(GOOGLE_REDIRECT_FLAG);
      return ensureProfile(cred.user);
    }
  } catch (error) {
    console.error("Google redirect result failed", error);
    sessionStorage.removeItem(GOOGLE_REDIRECT_FLAG);
    return null;
  }

  // Cookie/partition edge case: redirect result empty but user already signed in.
  if (auth.currentUser) {
    sessionStorage.removeItem(GOOGLE_REDIRECT_FLAG);
    return ensureProfile(auth.currentUser);
  }

  return null;
}

export async function firebaseLogout() {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

export async function firebaseResetPassword(email: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured.");
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

export function subscribeFirebaseUser(
  onUser: (account: UserAccount | null) => void,
  onProfile: (favourites: string[], readNoticeIds: string[]) => void,
  onReady?: () => void,
) {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  if (!auth || !db) {
    onUser(null);
    onReady?.();
    return () => undefined;
  }

  let unsubProfile: (() => void) | undefined;
  let first = true;

  const finishFirst = () => {
    if (!first) return;
    first = false;
    onReady?.();
  };

  const unsubAuth = onAuthStateChanged(auth, async (user) => {
    unsubProfile?.();
    unsubProfile = undefined;
    try {
      if (!user) {
        onUser(null);
        onProfile([], []);
        return;
      }
      try {
        const account = await ensureProfile(user);
        onUser(account);
        unsubProfile = onSnapshot(doc(db, "users", user.uid), (snap) => {
          const data = snap.data();
          onProfile(
            Array.isArray(data?.favourites) ? data.favourites : [],
            Array.isArray(data?.readNoticeIds) ? data.readNoticeIds : [],
          );
          if (data?.name || data?.role) {
            onUser({
              ...account,
              name: data.name || account.name,
              role: data.role === "admin" || isAdminEmail(account.email) ? "admin" : "client",
            });
          }
        });
      } catch {
        onUser(
          toAccount(
            user,
            isAdminEmail(user.email) ? "admin" : "client",
            user.displayName || undefined,
          ),
        );
        onProfile([], []);
      }
    } finally {
      finishFirst();
    }
  });

  return () => {
    unsubProfile?.();
    unsubAuth();
  };
}
