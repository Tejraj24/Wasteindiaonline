import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { uploadBufferToImageKit } from "@/lib/imagekit";
import { removeBackgroundFromCloudinaryUrl } from "@/lib/background-removal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB max limit

export async function POST(req: NextRequest) {
  try {
    console.log("[Upload API 1. Request Received]", {
      method: req.method,
      contentType: req.headers.get("content-type"),
      hasAuthHeader: Boolean(req.headers.get("authorization") || req.headers.get("Authorization")),
    });

    // 1. Enforce strict Administrator authentication
    const auth = await requireAdminAuth(req);
    console.log("[Upload API 2. Admin Auth Verified]", {
      email: auth.email,
      role: auth.role,
      uid: auth.firebaseUid,
    });

    // 2. Parse Multipart FormData
    const formData = await req.formData();
    const files = (formData.getAll("files").concat(formData.getAll("file"))) as File[];
    const provider = (formData.get("provider")?.toString() || "cloudinary").toLowerCase();
    const shouldRemoveBg = formData.get("removeBackground") !== "false";
    const folder = formData.get("folder")?.toString() || (provider === "imagekit" ? "/wasteindia/products" : "wasteindia/products");

    console.log("[Upload API 3. FormData Parsed]", {
      fileCount: files.length,
      provider,
      files: files.map((f) => (typeof f === "object" && f.name ? { name: f.name, size: f.size, type: f.type } : "non-file")),
      shouldRemoveBg,
    });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No image files provided for upload" },
        { status: 400 }
      );
    }

    // 3. Server-side validation of file type and size
    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      if (file.type && !file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `File "${file.name}" is not an image. Only image formats (JPG, PNG, WebP, AVIF) are permitted.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum allowed file size of 15MB.` },
          { status: 400 }
        );
      }
    }

    const uploadedImages = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseName = file.name.split(".")[0];

      if (provider === "imagekit") {
        console.log(`[Upload API 4. Calling ImageKit REST] Uploading file: ${file.name} (${buffer.length} bytes)`);

        const result = await uploadBufferToImageKit(
          buffer,
          file.name,
          folder
        );

        console.log(`[Upload API 5. ImageKit Success] File: ${file.name}`, {
          url: result.url,
          fileId: result.fileId,
        });

        uploadedImages.push({
          imageUrl: result.url,
          originalUrl: result.url,
          secureUrl: result.url,
          publicId: result.fileId,
          altText: baseName,
          provider: "imagekit",
          bgRemoved: false,
        });
      } else {
        // Cloudinary upload path (exact existing behavior)
        console.log(`[Upload API 4. Calling Cloudinary SDK] Uploading file: ${file.name} (${buffer.length} bytes)`);

        const result = await uploadBufferToCloudinary(
          buffer,
          folder,
          baseName
        );

        console.log(`[Upload API 5. Cloudinary SDK Success] File: ${file.name}`, {
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });

        const originalUrl = result.secure_url;
        const transparentUrl = shouldRemoveBg
          ? removeBackgroundFromCloudinaryUrl(originalUrl)
          : originalUrl;

        uploadedImages.push({
          imageUrl: transparentUrl,
          originalUrl,
          secureUrl: transparentUrl,
          publicId: result.public_id,
          altText: baseName,
          provider: "cloudinary",
          bgRemoved: shouldRemoveBg,
        });
      }
    }

    const responsePayload = {
      success: true,
      provider,
      images: uploadedImages,
      count: uploadedImages.length,
    };

    console.log("[Upload API 6. Returning JSON Payload]", responsePayload);
    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("[Upload API Error]", error);
    const message = error?.message || "Failed to upload image";

    let status = 500;
    if (message === "UNAUTHORIZED") {
      status = 401;
    } else if (message === "FORBIDDEN") {
      status = 403;
    } else if (error?.http_code && typeof error.http_code === "number" && error.http_code >= 400 && error.http_code < 600) {
      status = error.http_code;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
