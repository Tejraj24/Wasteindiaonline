import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { generateCloudinaryUploadSignature } from "@/lib/cloudinary";
import { generateImageKitUploadAuth } from "@/lib/imagekit";

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

    // 2. Parse provider selection from query parameters or JSON body
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const provider = (body.provider || searchParams.get("provider") || "cloudinary").toLowerCase();
    const folder = body.folder || searchParams.get("folder") || "wasteindia/products";

    // 3. Generate signed parameters based on selected provider
    if (provider === "imagekit") {
      const authData = generateImageKitUploadAuth(folder);
      return NextResponse.json({
        success: true,
        provider: "imagekit",
        ...authData,
      });
    }

    // Default & backward-compatible: Cloudinary signed parameters
    const signatureData = generateCloudinaryUploadSignature(folder);
    return NextResponse.json({
      success: true,
      provider: "cloudinary",
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
