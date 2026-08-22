import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseOptions } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

export function getFirebaseApp() {
  const options = firebaseOptions();
  if (!options) return null;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(options);
    if (typeof window !== "undefined") {
      void isSupported()
        .then((ok) => {
          if (ok && app) analytics = getAnalytics(app);
        })
        .catch(() => undefined);
    }
  }
  return app;
}

export function getFirebaseAuth() {
  const instance = getFirebaseApp();
  if (!instance) return null;
  if (!auth) {
    if (typeof window === "undefined") {
      auth = getAuth(instance);
    } else {
      try {
        // IndexedDB persistence + resolver fixes Google redirect/popup on Chrome.
        auth = initializeAuth(instance, {
          persistence: [indexedDBLocalPersistence, browserLocalPersistence],
          popupRedirectResolver: browserPopupRedirectResolver,
        });
      } catch {
        auth = getAuth(instance);
      }
    }
  }
  return auth;
}

export function getFirebaseDb() {
  const instance = getFirebaseApp();
  if (!instance) return null;
  if (!db) db = getFirestore(instance);
  return db;
}

export function getFirebaseStorage() {
  const instance = getFirebaseApp();
  if (!instance) return null;
  if (!storage) storage = getStorage(instance);
  return storage;
}

export function getFirebaseAnalytics() {
  getFirebaseApp();
  return analytics;
}
