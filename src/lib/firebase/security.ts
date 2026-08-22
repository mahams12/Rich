import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./client";

export async function logAdminLoginFailed(attemptedEmail: string) {
  const db = getFirebaseDb();
  if (!db) return;
  await addDoc(collection(db, "securityAlerts"), {
    type: "admin_login_failed",
    attemptedEmail: attemptedEmail.trim().toLowerCase(),
    createdAt: serverTimestamp(),
  });
}
