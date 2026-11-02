/**
 * Image Provider Detection & Utility Helpers
 * Supports dual-provider architecture for Cloudinary and ImageKit.
 */

export type ImageProvider = "imagekit" | "cloudinary" | "external";

/**
 * Validates if a URL points to Cloudinary CDN
 */
export function isCloudinaryUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("res.cloudinary.com");
}

/**
 * Validates if a URL points to ImageKit CDN
 */
export function isImageKitUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  
  if (url.includes("ik.imagekit.io")) {
    return true;
  }

  // Also check if custom configured URL endpoint is used
  const configuredEndpoint =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT
      : undefined;

  if (configuredEndpoint && typeof configuredEndpoint === "string") {
    try {
      const endpointHost = new URL(configuredEndpoint).hostname;
      if (endpointHost && url.includes(endpointHost)) {
        return true;
      }
    } catch (_) {
      // Ignore invalid URL format in env
    }
  }

  return false;
}

/**
 * Authoritatively identifies the image provider from URL structure
 */
export function getImageProvider(url?: string | null): ImageProvider {
  if (isImageKitUrl(url)) return "imagekit";
  if (isCloudinaryUrl(url)) return "cloudinary";
  return "external";
}

/**
 * Default fallback image placeholder used across the store
 */
export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80";

/**
 * Returns a guaranteed valid image URL, falling back to brand placeholder if missing or invalid
 */
export function getSafeImageUrl(url?: string | null, fallback: string = DEFAULT_FALLBACK_IMAGE): string {
  if (!url || typeof url !== "string" || !url.trim() || url === "none") {
    return fallback;
  }
  return url.trim();
}
