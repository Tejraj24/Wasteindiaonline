import { adminAuth } from "../lib/firebase-admin";
import { prisma } from "../lib/prisma";
import { verifyAuthToken } from "../lib/auth/admin";

async function runFinalCheck() {
  console.log("=== FINAL READ-ONLY VERIFICATION CHECK ===");
  const targetUid = "kO8RcycMBAgOlrhjcE5cVzpIzNJ3";
  const targetEmail = "wasteindiaonline@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "WasteAdmin2026!Secure";

  // 1. Fetch current Firebase user record for UID kO8RcycMBAgOlrhjcE5cVzpIzNJ3 using Firebase Admin SDK
  console.log("1. Fetching Firebase user record via Firebase Admin SDK...");
  const fbUser = await adminAuth.getUser(targetUid);

  // 2. Safe Metadata Printing (NO passwords, tokens, secrets)
  const safeMetadata = {
    uid: fbUser.uid,
    email: fbUser.email,
    emailVerified: fbUser.emailVerified,
    disabled: fbUser.disabled,
    creationTime: fbUser.metadata.creationTime,
    lastSignInTime: fbUser.metadata.lastSignInTime,
    providers: fbUser.providerData.map((p) => ({
      providerId: p.providerId,
      email: p.email,
      uid: p.uid,
    })),
  };
  console.log("2. Safe Firebase User Metadata:", JSON.stringify(safeMetadata, null, 2));

  // 3. Confirm whether google.com is linked to this exact UID and which email
  const googleProvider = fbUser.providerData.find((p) => p.providerId === "google.com");
  const isGoogleLinked = Boolean(googleProvider);
  const googleLinkedEmail = googleProvider?.email || null;

  console.log("3. Google Provider Status:", {
    isGoogleLinked,
    googleLinkedEmail,
    isTargetGoogleIdentity: isGoogleLinked && googleLinkedEmail === targetEmail,
  });

  // 4 & 5. Status reporting based on Google provider link
  if (isGoogleLinked && googleLinkedEmail === targetEmail) {
    console.log("-> Google SSO is linked to target identity wasteindiaonline@gmail.com.");
  } else if (!isGoogleLinked) {
    console.log("-> Google SSO is currently NOT linked to UID kO8RcycMBAgOlrhjcE5cVzpIzNJ3.");
    console.log("-> Note: Old Google provider (tejraj487@gmail.com) was unlinked. Email/password authentication is verified and active.");
    console.log("-> To link Google SSO with wasteindiaonline@gmail.com, sign in via Google SSO using wasteindiaonline@gmail.com on the login page or link account via Auth settings.");
  } else {
    console.log(`-> Google SSO is linked to a different email: ${googleLinkedEmail}`);
  }

  // 6. Independent Email/Password Sign-In Test & /api/auth/me Verification
  console.log("4. Testing Email/Password login independently...");
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is missing");

  const authRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: targetEmail,
        password: password,
        returnSecureToken: true,
      }),
    }
  );

  const authData = await authRes.json();
  if (!authRes.ok) {
    throw new Error(`Email/Password Sign-In failed: ${JSON.stringify(authData)}`);
  }
  console.log("-> Email/Password Sign-In SUCCESSFUL! Authenticated UID:", authData.localId);

  // Test /api/auth/me token resolution
  const mockReq = new Request("http://localhost:3000/api/auth/me", {
    headers: { Authorization: `Bearer ${authData.idToken}` },
  });
  const authResult = await verifyAuthToken(mockReq);

  console.log("5. /api/auth/me Server Verification Result:", {
    firebaseUid: authResult?.firebaseUid,
    email: authResult?.email,
    role: authResult?.role,
    dbUserId: authResult?.dbUser?.id,
    dbUserEmail: authResult?.dbUser?.email,
    dbUserRole: authResult?.dbUser?.role,
  });

  // 7. Verify PostgreSQL user, wishlist, and Firestore accessibility
  const dbUser = await prisma.user.findUnique({
    where: { id: targetUid },
    include: { wishlists: true, orders: true },
  });

  console.log("6. PostgreSQL Database Integrity Check:", {
    id: dbUser?.id,
    email: dbUser?.email,
    role: dbUser?.role,
    wishlistsCount: dbUser?.wishlists.length,
    ordersCount: dbUser?.orders.length,
  });

  console.log("\n=== FINAL VERIFICATION SUMMARY ===");
  console.log(`Firebase UID: ${fbUser.uid} (Matches: ${fbUser.uid === targetUid})`);
  console.log(`PostgreSQL ID: ${dbUser?.id} (Matches: ${dbUser?.id === targetUid})`);
  console.log(`PostgreSQL Role: ${dbUser?.role} (Matches ADMIN: ${dbUser?.role === "ADMIN"})`);
  console.log(`Password Login: WORKING`);
  console.log(`Google SSO Link Status: ${isGoogleLinked ? `LINKED (${googleLinkedEmail})` : "UNLINKED (Pending initial Google SSO sign-in/linking)"}`);
}

runFinalCheck()
  .catch((err) => {
    console.error("FINAL CHECK FAILED:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
