import { getApps, getApp, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import * as path from "path";
import * as fs from "fs";

function parseServiceAccount(): Record<string, any> | null {
  const envConfig = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (envConfig && typeof envConfig === "string" && envConfig.trim().length > 0) {
    try {
      const raw = envConfig.trim();
      const parsed = JSON.parse(
        raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf-8")
      );
      if (parsed.private_key && typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch {
      console.warn("[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON environment variable.");
    }
  }

  // Fallback to local file in development if present
  try {
    const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
    if (fs.existsSync(serviceAccountPath)) {
      const fileContent = fs.readFileSync(serviceAccountPath, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (parsed.private_key && typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    }
  } catch {
    console.warn("[Firebase Admin] Failed to read local firebase-service-account.json file.");
  }

  return null;
}

function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = parseServiceAccount();
  if (serviceAccount) {
    try {
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || serviceAccount.project_id,
        storageBucket:
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
          (serviceAccount.project_id ? `${serviceAccount.project_id}.appspot.com` : undefined),
      });
    } catch {
      console.warn("[Firebase Admin] Failed to initialize with service account credentials, falling back to default initialization.");
    }
  }

  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

let _app: App | null = null;
let _auth: Auth | null = null;

export function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  if (!_app) {
    _app = initializeFirebaseAdmin();
  }
  return _app;
}

export function getAdminAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseAdmin());
  }
  return _auth;
}

// Lazy Proxies for backward compatibility with `adminAuth` and `firebaseAdmin`
export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    const authInstance = getAdminAuth();
    const value = (authInstance as any)[prop];
    if (typeof value === "function") {
      return value.bind(authInstance);
    }
    return value;
  },
});

export const firebaseAdmin = new Proxy({} as App, {
  get(_target, prop) {
    const appInstance = getFirebaseAdmin();
    const value = (appInstance as any)[prop];
    if (typeof value === "function") {
      return value.bind(appInstance);
    }
    return value;
  },
});
