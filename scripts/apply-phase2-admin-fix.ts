import { adminAuth } from "../lib/firebase-admin";
import { prisma } from "../lib/prisma";
import { verifyAuthToken } from "../lib/auth/admin";

async function applyFixAndTest() {
  console.log("=== PHASE 2: APPLYING SAFE AUTHORIZATION FIX ===");

  // 1. Demote tejraj487@gmail.com in PostgreSQL to CUSTOMER (preserving account & ID)
  const oldUser = await prisma.user.findUnique({
    where: { email: "tejraj487@gmail.com" },
  });

  if (oldUser) {
    console.log("1. Demoting user tejraj487@gmail.com (ID: " + oldUser.id + ") from " + oldUser.role + " to CUSTOMER...");
    const updatedOldUser = await prisma.user.update({
      where: { id: oldUser.id },
      data: { role: "CUSTOMER" },
    });
    console.log("Demotion completed. User status:", {
      id: updatedOldUser.id,
      email: updatedOldUser.email,
      role: updatedOldUser.role,
    });
  }

  // 2. Verify admin user wasteindiaonline@gmail.com remains untouched as ADMIN
  const adminUser = await prisma.user.findUnique({
    where: { email: "wasteindiaonline@gmail.com" },
  });
  console.log("2. Admin User Verification:", {
    id: adminUser?.id,
    email: adminUser?.email,
    role: adminUser?.role,
  });

  if (adminUser?.id !== "kO8RcycMBAgOlrhjcE5cVzpIzNJ3" || adminUser?.role !== "ADMIN") {
    throw new Error("CRITICAL: Admin user state compromised!");
  }

  console.log("\n=== PHASE 3: TESTING BOTH ACCOUNTS ===");

  // Test 1: Generate custom token for wasteindiaonline@gmail.com and verify verifyAuthToken
  console.log("1. Testing wasteindiaonline@gmail.com authorization...");
  const adminFbUser = await adminAuth.getUserByEmail("wasteindiaonline@gmail.com");
  const adminCustomToken = await adminAuth.createCustomToken(adminFbUser.uid);

  // Exchange custom token for ID token via REST API
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const adminIdTokenRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: adminCustomToken, returnSecureToken: true }),
  });
  const adminIdTokenData = await adminIdTokenRes.json();

  const mockAdminReq = new Request("http://localhost:3000/api/auth/me", {
    headers: { Authorization: `Bearer ${adminIdTokenData.idToken}` },
  });
  const adminAuthRes = await verifyAuthToken(mockAdminReq);

  console.log("-> wasteindiaonline@gmail.com Auth Result:", {
    firebaseUid: adminAuthRes?.firebaseUid,
    email: adminAuthRes?.email,
    role: adminAuthRes?.role,
    dbUserId: adminAuthRes?.dbUser?.id,
    dbUserRole: adminAuthRes?.dbUser?.role,
  });

  if (adminAuthRes?.role !== "ADMIN" || adminAuthRes?.dbUser?.role !== "ADMIN") {
    throw new Error("Test Failed: wasteindiaonline@gmail.com was not granted ADMIN access!");
  }

  // Test 2: Generate custom token for tejraj487@gmail.com and verify verifyAuthToken
  console.log("\n2. Testing tejraj487@gmail.com authorization (Expecting CUSTOMER / FORBIDDEN)...");
  const oldFbUser = await adminAuth.getUserByEmail("tejraj487@gmail.com");
  const oldCustomToken = await adminAuth.createCustomToken(oldFbUser.uid);

  const oldIdTokenRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: oldCustomToken, returnSecureToken: true }),
  });
  const oldIdTokenData = await oldIdTokenRes.json();

  const mockOldReq = new Request("http://localhost:3000/api/auth/me", {
    headers: { Authorization: `Bearer ${oldIdTokenData.idToken}` },
  });
  const oldAuthRes = await verifyAuthToken(mockOldReq);

  console.log("-> tejraj487@gmail.com Auth Result:", {
    firebaseUid: oldAuthRes?.firebaseUid,
    email: oldAuthRes?.email,
    role: oldAuthRes?.role,
    dbUserId: oldAuthRes?.dbUser?.id,
    dbUserRole: oldAuthRes?.dbUser?.role,
  });

  if (oldAuthRes?.role === "ADMIN" || oldAuthRes?.dbUser?.role === "ADMIN") {
    throw new Error("CRITICAL SECURITY FAILURE: tejraj487@gmail.com was still granted ADMIN access!");
  } else {
    console.log("SUCCESS: tejraj487@gmail.com is correctly resolved as CUSTOMER role.");
  }

  console.log("\n>>> ALL AUTHORIZATION TESTS PASSED SUCCESSFULLY! <<<");
}

applyFixAndTest()
  .catch(err => {
    console.error("Phase 2/3 Execution Failed:", err);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
