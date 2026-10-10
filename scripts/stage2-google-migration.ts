import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, unlink } from "firebase/auth";
import { adminAuth } from "../lib/firebase-admin";
import { prisma } from "../lib/prisma";
import { verifyAuthToken } from "../lib/auth/admin";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function runStage2() {
  console.log("=== STAGE 2: GOOGLE SSO PROVIDER UNLINKING & PREPARATION ===");
  const targetUid = "kO8RcycMBAgOlrhjcE5cVzpIzNJ3";
  const targetEmail = "wasteindiaonline@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "WasteAdmin2026!Secure";

  // 1. Initialize Firebase Client SDK
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const clientAuth = getAuth(app);

  // 2. Sign in as admin with verified email/password
  console.log("1. Authenticating admin user via Firebase Client SDK with Email/Password...");
  const userCredential = await signInWithEmailAndPassword(clientAuth, targetEmail, password);
  const user = userCredential.user;

  console.log("Authenticated Client User:", {
    uid: user.uid,
    email: user.email,
    providers: user.providerData.map((p) => ({ providerId: p.providerId, email: p.email, uid: p.uid })),
  });

  if (user.uid !== targetUid) {
    throw new Error(`UID mismatch! Expected ${targetUid}, got ${user.uid}`);
  }

  // Verify password provider is attached
  const hasPassword = user.providerData.some((p) => p.providerId === "password");
  if (!hasPassword) {
    throw new Error("ABORTING: Password provider is not attached to user! Cannot safely unlink Google.");
  }

  // Check if old google.com provider is linked
  const hasOldGoogle = user.providerData.some((p) => p.providerId === "google.com" && p.email === "tejraj487@gmail.com");
  if (hasOldGoogle) {
    console.log("2. Unlinking old Google provider (tejraj487@gmail.com) using Firebase Client SDK unlink()...");
    const updatedUser = await unlink(user, "google.com");
    console.log("Old Google provider successfully unlinked! Updated providers:", updatedUser.providerData.map((p) => p.providerId));
  } else {
    console.log("2. Old Google provider (tejraj487@gmail.com) is already not present or already unlinked.");
  }

  // 3. Verify via Firebase Admin SDK
  console.log("3. Verifying updated account state via Firebase Admin SDK...");
  const adminUser = await adminAuth.getUser(targetUid);
  console.log("Firebase Admin SDK User Providers:", adminUser.providerData.map((p) => ({
    providerId: p.providerId,
    email: p.email,
    uid: p.uid,
  })));

  if (adminUser.uid !== targetUid || adminUser.email !== targetEmail) {
    throw new Error(`Server state mismatch! UID: ${adminUser.uid}, Email: ${adminUser.email}`);
  }

  // 4. Verify /api/auth/me token resolution
  console.log("4. Testing ID token resolution with /api/auth/me handler...");
  const idToken = await clientAuth.currentUser?.getIdToken(true);
  if (!idToken) throw new Error("Could not acquire ID token.");

  const mockReq = new Request("http://localhost:3000/api/auth/me", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const authResult = await verifyAuthToken(mockReq);

  console.log("5. Auth Verification Result:", {
    firebaseUid: authResult?.firebaseUid,
    email: authResult?.email,
    role: authResult?.role,
    dbUserId: authResult?.dbUser?.id,
    dbUserEmail: authResult?.dbUser?.email,
    dbUserRole: authResult?.dbUser?.role,
  });

  if (authResult?.firebaseUid !== targetUid || authResult?.role !== "ADMIN" || authResult?.dbUser?.role !== "ADMIN") {
    throw new Error("Auth resolution failed after unlinking old Google provider!");
  }

  // 5. Database & wishlist integrity check
  const dbUser = await prisma.user.findUnique({
    where: { id: targetUid },
    include: { wishlists: true },
  });
  console.log("6. Database User Record:", {
    id: dbUser?.id,
    email: dbUser?.email,
    role: dbUser?.role,
    wishlistsCount: dbUser?.wishlists.length,
  });

  console.log("\n>>> STAGE 2 UNLINKING COMPLETED SUCCESSFULLY! Old Google provider unlinked. Password sign-in active for kO8RcycMBAgOlrhjcE5cVzpIzNJ3 as ADMIN. <<<");
}

runStage2()
  .catch((err) => {
    console.error("STAGE 2 FAILED:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
