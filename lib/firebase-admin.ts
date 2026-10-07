import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import path from "path";
import { existsSync, readFileSync } from "fs";

/**
 * Resolves Firebase Admin credentials using a hybrid strategy:
 * 1. Production: Environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 * 2. Local Fallback: firebase-service-account.json at project root
 */
function getCredentials(): ServiceAccount {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  const serviceAccountPath = path.resolve(
    process.cwd(),
    "firebase-service-account.json"
  );

  if (existsSync(serviceAccountPath)) {
    return JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  }

  throw new Error(
    "Firebase Admin credentials not found. Provide FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables, or place firebase-service-account.json in the project root."
  );
}

/**
 * Firebase Admin SDK — server-side singleton.
 *
 * Initializes once per Node.js process. The getApps() guard prevents
 * duplicate initialization during Next.js hot-module reloading.
 */
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert(getCredentials()),
  });
}

let adminAuth: ReturnType<typeof getAuth> | null = null;

function getAdminAuth() {
  if (adminAuth) {
    return adminAuth;
  }

  const app = getAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}

/**
 * Verify a Firebase ID token from an incoming request.
 *
 * Expects the `Authorization` header in the format: `Bearer <idToken>`
 *
 * @returns The decoded token containing `uid`, `email`, and other claims.
 * @throws If the header is missing, malformed, or the token is invalid/expired.
 */
export async function verifyFirebaseToken(
  authHeader: string | null
): Promise<DecodedIdToken> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or malformed Authorization header.");
  }

  const idToken = authHeader.split("Bearer ")[1];
  const auth = getAdminAuth();
  return auth.verifyIdToken(idToken);
}
