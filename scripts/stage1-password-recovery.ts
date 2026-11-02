import { adminAuth } from "../lib/firebase-admin";
import { prisma } from "../lib/prisma";
import { verifyAuthToken } from "../lib/auth/admin";

async function runStage1() {
  console.log("=== STAGE 1: PASSWORD RECOVERY SETUP & VERIFICATION ===");
  const targetUid = "kO8RcycMBAgOlrhjcE5cVzpIzNJ3";
  const targetEmail = "wasteindiaonline@gmail.com";

  // 1. Verify user exists in Firebase Admin
  const existingUser = await adminAuth.getUser(targetUid);
  console.log("1. Existing Firebase User fetched successfully:", {
    uid: existingUser.uid,
    email: existingUser.email,
    emailVerified: existingUser.emailVerified,
    providers: existingUser.providerData.map((p) => p.providerId),
  });

  if (existingUser.uid !== targetUid || existingUser.email !== targetEmail) {
    throw new Error(`Target UID or Email mismatch! Expected ${targetUid} / ${targetEmail}, found ${existingUser.uid} / ${existingUser.email}`);
  }

  // 2. Set password for wasteindiaonline@gmail.com
  const password = process.env.ADMIN_PASSWORD || "WasteAdmin2026!Secure";
  console.log("2. Updating Firebase Auth user password and verifying email status...");
  await adminAuth.updateUser(targetUid, {
    password: password,
    emailVerified: true,
  });
  console.log("Password updated successfully on UID:", targetUid);

  // 3. Verify user providers now
  const updatedUser = await adminAuth.getUser(targetUid);
  console.log("3. Updated Firebase User Providers:", updatedUser.providerData.map((p) => ({
    providerId: p.providerId,
    email: p.email,
    uid: p.uid,
  })));

  // 4. Test Email/Password sign-in via Firebase Identity Toolkit REST API
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is missing!");
  }

  console.log("4. Testing Email/Password authentication via Firebase Auth REST API...");
  const authResponse = await fetch(
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

  const authData = await authResponse.json();
  if (!authResponse.ok) {
    throw new Error(`Firebase Email/Password Sign-In failed: ${JSON.stringify(authData)}`);
  }

  console.log("Email/Password Sign-In SUCCESSFUL! Token generated for UID:", authData.localId);
  if (authData.localId !== targetUid) {
    throw new Error(`CRITICAL: ID mismatch after password login! Expected ${targetUid}, got ${authData.localId}`);
  }

  // 5. Test token verification with verifyAuthToken (simulating /api/auth/me)
  console.log("5. Testing /api/auth/me verification with newly generated ID token...");
  const mockReq = new Request("http://localhost:3000/api/auth/me", {
    headers: { Authorization: `Bearer ${authData.idToken}` },
  });

  const authResult = await verifyAuthToken(mockReq);
  console.log("6. verifyAuthToken Result:", {
    firebaseUid: authResult?.firebaseUid,
    email: authResult?.email,
    role: authResult?.role,
    dbUserId: authResult?.dbUser?.id,
    dbUserEmail: authResult?.dbUser?.email,
    dbUserRole: authResult?.dbUser?.role,
  });

  if (
    authResult?.firebaseUid !== targetUid ||
    authResult?.dbUser?.id !== targetUid ||
    authResult?.role !== "ADMIN" ||
    authResult?.dbUser?.role !== "ADMIN"
  ) {
    throw new Error("Verification failed! User ID or ADMIN role was not resolved correctly.");
  }

  // 6. Check Prisma database user records and relations
  const dbUserCheck = await prisma.user.findUnique({
    where: { id: targetUid },
    include: { wishlists: true, orders: true },
  });
  console.log("7. Database Record Integrity Verification:", {
    id: dbUserCheck?.id,
    email: dbUserCheck?.email,
    role: dbUserCheck?.role,
    wishlistsCount: dbUserCheck?.wishlists.length,
    ordersCount: dbUserCheck?.orders.length,
  });

  console.log("\n>>> STAGE 1 COMPLETED SUCCESSFULLY! Password sign-in is active and verified for kO8RcycMBAgOlrhjcE5cVzpIzNJ3 as ADMIN. <<<");
}

runStage1()
  .catch((err) => {
    console.error("STAGE 1 FAILED:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
