import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getConfiguredAdminEmails } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/account/sync-email
 * Synchronizes the cryptographically verified Firebase Authentication email address with the PostgreSQL User record.
 * Uses the verified email and UID from the Firebase ID token (never trusting raw client email).
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify token cryptographically via Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);
    const verifiedEmail = (decoded.email || "").trim().toLowerCase();

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "No verified email present in authentication token" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const previousEmail = typeof body?.previousEmail === "string" ? body.previousEmail.trim().toLowerCase() : "";

    const adminEmails = getConfiguredAdminEmails();
    const isAdminByConfig = adminEmails.includes(verifiedEmail) || (Boolean(previousEmail) && adminEmails.includes(previousEmail));

    // 2. Identify the authoritative database admin record
    let targetAdminUser = null;

    if (previousEmail && previousEmail !== verifiedEmail) {
      const prevUser = await prisma.user.findUnique({
        where: { email: previousEmail },
      });
      if (prevUser && (prevUser.role === "ADMIN" || isAdminByConfig)) {
        targetAdminUser = prevUser;
      }
    }

    if (!targetAdminUser) {
      const existingUser = await prisma.user.findUnique({
        where: { email: verifiedEmail },
      });
      if (existingUser && (existingUser.role === "ADMIN" || isAdminByConfig)) {
        targetAdminUser = existingUser;
      }
    }

    // If no existing admin record is found and not in ADMIN_EMAILS, reject
    if (!targetAdminUser && !isAdminByConfig) {
      return NextResponse.json(
        { error: "Forbidden: No authorized administrator record found" },
        { status: 403 }
      );
    }

    // 3. Perform atomic update preserving original ID and ADMIN role
    if (targetAdminUser) {
      // If target user already has verifiedEmail, return success immediately
      if (targetAdminUser.email.toLowerCase() === verifiedEmail) {
        if (targetAdminUser.role !== "ADMIN" && isAdminByConfig) {
          await prisma.user.update({
            where: { id: targetAdminUser.id },
            data: { role: "ADMIN" },
          });
        }
        return NextResponse.json({
          success: true,
          message: "Email is already synchronized",
          email: verifiedEmail,
          role: "ADMIN",
        });
      }

      // Check if a placeholder was created for verifiedEmail
      const placeholderUser = await prisma.user.findUnique({
        where: { email: verifiedEmail },
      });

      if (placeholderUser && placeholderUser.id !== targetAdminUser.id) {
        try {
          await prisma.user.delete({
            where: { id: placeholderUser.id },
          });
        } catch (delErr) {
          console.warn("Could not remove placeholder record:", delErr);
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetAdminUser.id },
        data: {
          email: verifiedEmail,
          role: "ADMIN",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Database email synchronized successfully",
        email: updatedUser.email,
        role: updatedUser.role,
      });
    }

    // If new admin by config without prior record, create it
    const newAdminUser = await prisma.user.create({
      data: {
        email: verifiedEmail,
        name: decoded.name || verifiedEmail.split("@")[0],
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database administrator record created and synchronized successfully",
      email: newAdminUser.email,
      role: newAdminUser.role,
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/account/sync-email error:", error);
    return NextResponse.json(
      { error: "Failed to synchronize email with database" },
      { status: 500 }
    );
  }
}
