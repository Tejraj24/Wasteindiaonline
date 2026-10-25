import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function getEffectiveAuthDomain(): string {
  if (typeof window !== "undefined") {
    const host = window.location.host;
    // When running on the deployed production domain (www.wasteluxe.in / wasteluxe.in),
    // route Firebase Auth requests through the canonical first-party Next.js reverse proxy (/__/auth/*).
    // This allows first-party storage access on iOS Safari and mobile Chrome for signInWithRedirect,
    // eliminating the null credential return caused by third-party cookie/storage partitioning.
    if (host === "wasteluxe.in" || host === "www.wasteluxe.in") {
      return "www.wasteluxe.in";
    }
    if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
      return host;
    }
  }
  return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "wasteindia.firebaseapp.com";
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: getEffectiveAuthDomain(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`
      : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Core required fields for Firebase Auth
const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

console.log("[Auth Diagnostic] Client Firebase Configuration:", {
  hasApiKey: Boolean(firebaseConfig.apiKey),
  hasAuthDomain: Boolean(firebaseConfig.authDomain),
  authDomain: firebaseConfig.authDomain,
  runtimeHost: typeof window !== "undefined" ? window.location.host : "SSR",
  pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
  hasProjectId: Boolean(firebaseConfig.projectId),
  hasAppId: Boolean(firebaseConfig.appId),
  isConfigured: hasFirebaseConfig,
});

const firebaseApp =
  typeof window !== "undefined" && hasFirebaseConfig
    ? getApps().length > 0
      ? getApp()
      : initializeApp(firebaseConfig)
    : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const isFirebaseConfigured = hasFirebaseConfig;
