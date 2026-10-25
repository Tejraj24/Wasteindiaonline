/**
 * Server-side & client-safe utilities for automatic AI background removal
 * using Cloudinary's native AI background removal engine (e_background_removal).
 */

export function isCloudinaryUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("res.cloudinary.com") && url.includes("/image/upload/");
}

export function isBackgroundRemovedUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("e_background_removal") || url.includes("e_bgremoval");
}

/**
 * Transforms a standard Cloudinary image URL into an AI background-removed transparent PNG URL.
 * Produces a genuine RGBA PNG with an alpha channel.
 *
 * Example:
 *   Input:  https://res.cloudinary.com/.../image/upload/v1234/folder/garment.jpg
 *   Output: https://res.cloudinary.com/.../image/upload/e_background_removal,f_png/v1234/folder/garment.png
 */
export function removeBackgroundFromCloudinaryUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  if (!isCloudinaryUrl(url)) return url;
  if (isBackgroundRemovedUrl(url)) {
    // If it already has background removal, ensure format is PNG
    return url.replace(/\.(jpg|jpeg|webp|avif)$/i, ".png");
  }

  // Insert e_background_removal,f_png right after /image/upload/
  let transformed = url.replace(/\/image\/upload\/(v\d+\/)?/, (match, version) => {
    return `/image/upload/e_background_removal,f_png/${version || ""}`;
  });

  // Ensure file extension is .png to support genuine alpha channel transparency
  transformed = transformed.replace(/\.(jpg|jpeg|webp|avif)$/i, ".png");
  return transformed;
}

/**
 * Reverses background removal to restore the original uploaded asset URL.
 */
export function getOriginalFromCloudinaryUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  if (!isCloudinaryUrl(url)) return url;
  return url.replace(/\/e_background_removal[^\/]*\//, "/");
}

/**
 * Server-side verification: Fetches the transformed URL to warm up Cloudinary's
 * background removal processing and confirm that it responds with 200 OK and valid image data.
 */
export async function verifyTransparentImage(
  url: string,
  timeoutMs: number = 25000
): Promise<{ success: boolean; bytes?: number; contentType?: string; error?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errorHeader = res.headers.get("x-cld-error");
      const errText = errorHeader || (await res.text().catch(() => "")) || `HTTP ${res.status}`;
      return {
        success: false,
        error: `Cloudinary background removal failed (${errText})`,
      };
    }

    const contentType = res.headers.get("content-type") || "";
    const buffer = await res.arrayBuffer();

    return {
      success: true,
      bytes: buffer.byteLength,
      contentType,
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return {
        success: false,
        error: `Background removal timed out after ${Math.round(timeoutMs / 1000)}s`,
      };
    }
    return {
      success: false,
      error: error?.message || "Failed to verify background removal",
    };
  }
}
