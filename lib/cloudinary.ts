import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

/**
 * Server-side authoritative Cloudinary configuration.
 * Reads credentials strictly from server environment variables.
 */
export function getCloudinaryClient() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isConfigured = Boolean(cloudName && apiKey && apiSecret);

  // Safe diagnostic logging: Never logs full API keys or secrets
  console.log("[Cloudinary Diagnostics]", {
    resolvedCloudName: cloudName || "NOT_SET",
    isApiKeyConfigured: Boolean(apiKey),
    apiKeyPrefix: apiKey ? `${apiKey.slice(0, 4)}...` : "NOT_SET",
    isApiSecretConfigured: Boolean(apiSecret),
    apiSecretLength: apiSecret ? apiSecret.length : 0,
    isReady: isConfigured,
  });

  if (!cloudName || !apiKey || !apiSecret) {
    const missing: string[] = [];
    if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
    if (!apiKey) missing.push("CLOUDINARY_API_KEY");
    if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");

    throw new Error(`Cloudinary server configuration missing required environment variables: ${missing.join(", ")}`);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
}

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream.
 * Includes stream error listening, explicit timeouts, and accurate error forwarding.
 *
 * @param buffer - File Buffer
 * @param folder - Target folder in Cloudinary
 * @param filename - Optional custom filename identifier
 * @param timeoutMs - Max timeout in ms (defaults to 60s)
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string = "wasteindia/products",
  filename?: string,
  timeoutMs: number = 60000
): Promise<CloudinaryUploadResult> {
  const client = getCloudinaryClient();

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    let isSettled = false;

    const timeoutTimer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try {
          uploadStream.destroy();
        } catch (_) {}
        const timeoutError = new Error(`Cloudinary upload timed out after ${Math.round(timeoutMs / 1000)}s`);
        (timeoutError as any).http_code = 499;
        reject(timeoutError);
      }
    }, timeoutMs);

    const safeReject = (err: unknown) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timeoutTimer);
        reject(err);
      }
    };

    const safeResolve = (result: CloudinaryUploadResult) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timeoutTimer);
        resolve(result);
      }
    };

    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: "image",
      overwrite: true,
      timeout: timeoutMs,
    };

    if (filename) {
      uploadOptions.public_id = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    }

    const uploadStream = client.uploader.upload_stream(
      uploadOptions,
      (error?: UploadApiErrorResponse | Error, result?: UploadApiResponse) => {
        if (error) {
          const errObj = error as Record<string, any>;
          console.error("[Cloudinary upload_stream Error]:", {
            message: errObj.message || "Unknown error",
            http_code: errObj.http_code,
            name: errObj.name,
          });

          const formattedError = new Error(errObj.message || "Failed to upload image to Cloudinary");
          if (errObj.http_code) {
            (formattedError as any).http_code = errObj.http_code;
          }
          return safeReject(formattedError);
        }

        if (!result) {
          return safeReject(new Error("Cloudinary upload completed without returning response metadata"));
        }

        console.log("[Cloudinary Upload Success]:", {
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format,
          bytes: result.bytes,
        });

        safeResolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.on("error", (streamError) => {
      console.error("[Cloudinary Stream Error]:", streamError);
      safeReject(streamError instanceof Error ? streamError : new Error(String(streamError)));
    });

    uploadStream.end(buffer);
  });
}

/**
 * Uploads a base64 Data URI or external URL directly to Cloudinary.
 */
export async function uploadDataUrlToCloudinary(
  dataUriOrUrl: string,
  folder: string = "wasteindia/products",
  timeoutMs: number = 60000
): Promise<CloudinaryUploadResult> {
  const client = getCloudinaryClient();

  try {
    const result = await client.uploader.upload(dataUriOrUrl, {
      folder,
      resource_type: "image",
      timeout: timeoutMs,
    });

    return {
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error: any) {
    console.error("[Cloudinary uploadDataUrl Error]:", error);
    const formattedError = new Error(error?.message || "Failed to upload URL to Cloudinary");
    if (error?.http_code) {
      (formattedError as any).http_code = error.http_code;
    }
    throw formattedError;
  }
}

export default cloudinary;
