import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { User, Role } from "@prisma/client";

export interface AuthenticatedUser {
  firebaseUid: string;
  email: string;
  role: Role;
  dbUser: User | null;
}

/**
 * Helper to get list of configured admin emails.
 */
export function getConfiguredAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || "";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Extracts and verifies the Firebase ID token from the Authorization header.
 * Synchronizes user with PostgreSQL and auto-promotes if email is in ADMIN_EMAILS.
 */
export async function verifyAuthToken(req: Request): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
  console.log("[Auth Flow] 1. Request Authorization Header:", authHeader ? `Bearer ${authHeader.slice(7, 22)}...` : "NONE");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("[Auth Flow] No Bearer token found in Authorization header.");
    return null;
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    console.warn("[Auth Flow] Empty Bearer token extracted from header.");
    return null;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = (decoded.email || "").trim().toLowerCase();
    const adminEmails = getConfiguredAdminEmails();
    const isAdminEmail = email ? adminEmails.includes(email) : false;

    console.log("[Auth Flow] 2. Firebase Token Decoded Successfully:", {
      uid: decoded.uid,
      email: decoded.email,
      normalizedEmail: email,
      ADMIN_EMAILS: adminEmails,
      isAdminByEmail: isAdminEmail,
    });

    if (!email) {
      console.warn("[Auth Flow] Firebase user has no email attached.");
      return {
        firebaseUid: decoded.uid,
        email: "",
        role: "CUSTOMER",
        dbUser: null,
      };
    }

    // Find or synchronize user in PostgreSQL
    let dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.uid },
      });
    }

    if (!dbUser) {
      const initialRole: Role = isAdminEmail ? "ADMIN" : "CUSTOMER";
      console.log(`[Auth Flow] 3. Creating new DB user for ${email} with initial role: ${initialRole}`);
      dbUser = await prisma.user.create({
        data: {
          email,
          name: decoded.name || email.split("@")[0],
          role: initialRole,
        },
      });
    } else if (isAdminEmail && dbUser.role !== "ADMIN") {
      console.log(`[Auth Flow] 3. Existing DB user ${email} currently has role '${dbUser.role}'. Auto-promoting to 'ADMIN'.`);
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { role: "ADMIN" },
      });
    }

    const calculatedRole: Role = (isAdminEmail || dbUser.role === "ADMIN") ? "ADMIN" : "CUSTOMER";
    console.log("[Auth Flow] 4. Final Auth Resolution:", {
      email,
      dbRoleId: dbUser.role,
      calculatedRole,
      isAdmin: calculatedRole === "ADMIN",
    });

    return {
      firebaseUid: decoded.uid,
      email,
      role: calculatedRole,
      dbUser,
    };
  } catch (error) {
    console.error("[Auth Flow] Firebase token verification failed:", error);
    return null;
  }
}

/**
 * Verifies that the requester is an ADMIN user.
 */
export async function requireAdminAuth(req: Request): Promise<AuthenticatedUser> {
  const auth = await verifyAuthToken(req);
  if (!auth) {
    console.warn("[Auth Flow] requireAdminAuth: Unauthorized (no valid token)");
    throw new Error("UNAUTHORIZED");
  }

  if (auth.role !== "ADMIN") {
    console.warn(`[Auth Flow] requireAdminAuth: Forbidden (user ${auth.email} has role ${auth.role})`);
    throw new Error("FORBIDDEN");
  }

  return auth;
}
