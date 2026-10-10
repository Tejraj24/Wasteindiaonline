import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("[Upload API 1. Request Received]", {
      method: req.method,
      contentType: req.headers.get("content-type"),
      hasAuthHeader: Boolean(req.headers.get("authorization") || req.headers.get("Authorization")),
    });

    // 1. Enforce Administrator authentication
    const auth = await requireAdminAuth(req);
    console.log("[Upload API 2. Admin Auth Verified]", {
      email: auth.email,
      role: auth.role,
      uid: auth.firebaseUid,
    });

    // 2. Parse Multipart FormData
    const formData = await req.formData();
    const files = (formData.getAll("files").concat(formData.getAll("file"))) as File[];

    console.log("[Upload API 3. FormData Parsed]", {
      fileCount: files.length,
      files: files.map((f) => (typeof f === "object" && f.name ? { name: f.name, size: f.size, type: f.type } : "non-file")),
    });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No image files provided for upload" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseName = file.name.split(".")[0];

      console.log(`[Upload API 4. Calling Cloudinary SDK] Uploading file: ${file.name} (${buffer.length} bytes)`);

      const result = await uploadBufferToCloudinary(
        buffer,
        "wasteindia/products",
        baseName
      );

      console.log(`[Upload API 5. Cloudinary SDK Success] File: ${file.name}`, {
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      });

      uploadedImages.push({
        imageUrl: result.secure_url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        altText: baseName,
      });
    }

    const responsePayload = {
      success: true,
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
