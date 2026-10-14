import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { generateCloudinaryUploadSignature } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce strict server-side Admin authentication via Firebase Admin token verification
    const auth = await requireAdminAuth(req);

    console.log("[Upload Signature API] Admin verified for direct upload:", {
      email: auth.email,
      role: auth.role,
      uid: auth.firebaseUid,
    });

    // 2. Generate signed parameters for direct upload to wasteindia/products
    const signatureData = generateCloudinaryUploadSignature("wasteindia/products");

    return NextResponse.json({
      success: true,
      ...signatureData,
    });
  } catch (error: any) {
    console.error("[Upload Signature API Error]:", error?.message || error);
    const message = error?.message || "Failed to generate upload signature";

    let status = 500;
    if (message === "UNAUTHORIZED") {
      status = 401;
    } else if (message === "FORBIDDEN") {
      status = 403;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
