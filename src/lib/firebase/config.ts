import type { FirebaseOptions } from "firebase/app";

export const firebaseProjectId = "novexa-4876f";

export const primaryAdminEmail = "novexahub.net@gmail.com";

export const adminEmails = [primaryAdminEmail, "admin@novexahub.live"];

export function isAdminEmail(email?: string | null) {
  return Boolean(email && adminEmails.includes(email.trim().toLowerCase()));
}

export function isPrimaryAdminEmail(email?: string | null) {
  return Boolean(email && email.trim().toLowerCase() === primaryAdminEmail);
}

export function firebaseOptions(): FirebaseOptions | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseProjectId;
  if (!apiKey || !appId) return null;
  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function isFirebaseConfigured() {
  return firebaseOptions() !== null;
}
