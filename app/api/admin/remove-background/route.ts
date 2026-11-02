import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import {
  isCloudinaryUrl,
  removeBackgroundFromCloudinaryUrl,
  getOriginalFromCloudinaryUrl,
  verifyTransparentImage,
} from "@/lib/background-removal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce strict administrator authorization
    const auth = await requireAdminAuth(req);

    const body = await req.json().catch(() => ({}));
    const { imageUrl, action = "remove", verify = true } = body;

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "A valid imageUrl string is required" },
        { status: 400 }
      );
    }

    if (!isCloudinaryUrl(imageUrl)) {
      return NextResponse.json(
        {
          error: "Background removal requires an image stored on Cloudinary (res.cloudinary.com)",
        },
        { status: 400 }
      );
    }

    // 2. Handle Restore Action (revert to original unedited asset)
    if (action === "restore") {
      const originalUrl = getOriginalFromCloudinaryUrl(imageUrl);
      return NextResponse.json({
        success: true,
        imageUrl: originalUrl,
        originalUrl,
        isTransparent: false,
      });
    }

    // 3. Handle Remove Action (AI Background Removal)
    const transparentUrl = removeBackgroundFromCloudinaryUrl(imageUrl);
    const originalUrl = getOriginalFromCloudinaryUrl(imageUrl);

    // 4. Verify & Pre-warm Cloudinary AI background removal transformation
    if (verify) {
      console.log("[RemoveBackground API] Verifying & warming up Cloudinary transformation:", transparentUrl);
      const verification = await verifyTransparentImage(transparentUrl, 30000);

      if (!verification.success) {
        console.error("[RemoveBackground API Error]", verification.error);
        return NextResponse.json(
          {
            error: verification.error || "Background removal processing failed",
            transparentUrl,
            originalUrl,
          },
          { status: 422 }
        );
      }

      console.log("[RemoveBackground API Success] Generated transparent PNG:", {
        bytes: verification.bytes,
        contentType: verification.contentType,
      });
    }

    return NextResponse.json({
      success: true,
      imageUrl: transparentUrl,
      transparentUrl,
      originalUrl,
      isTransparent: true,
    });
  } catch (error: any) {
    console.error("[RemoveBackground API Uncaught Error]:", error);
    const message = error?.message || "Failed to process background removal";

    let status = 500;
    if (message === "UNAUTHORIZED") status = 401;
    else if (message === "FORBIDDEN") status = 403;

    return NextResponse.json({ error: message }, { status });
  }
}
