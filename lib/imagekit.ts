import crypto from "crypto";

/**
 * Authoritative Server-side ImageKit Configuration & SDK-free helper.
 * Uses native Node.js crypto and fetch to comply strictly with ImageKit REST API.
 * Keeps IMAGEKIT_PRIVATE_KEY strictly on the server.
 */

export interface ImageKitAuthPayload {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
  folder?: string;
}

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  name: string;
  filePath: string;
  thumbnailUrl?: string;
  format?: string;
  width?: number;
  height?: number;
  size?: number;
}

/**
 * Checks whether ImageKit environment variables are configured.
 */
export function isImageKitConfigured(): boolean {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  return Boolean(privateKey && publicKey && urlEndpoint);
}

/**
 * Resolves server-side ImageKit credentials with strict safety checks.
 * Throws a descriptive error if required environment variables are absent.
 */
export function getImageKitConfig() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  // Safe diagnostics (never outputs full secrets or private keys)
  console.log("[ImageKit Diagnostics]", {
    hasPrivateKey: Boolean(privateKey),
    privateKeyLength: privateKey ? privateKey.length : 0,
    hasPublicKey: Boolean(publicKey),
    publicKeyPrefix: publicKey ? `${publicKey.slice(0, 6)}...` : "NOT_SET",
    hasUrlEndpoint: Boolean(urlEndpoint),
    urlEndpoint: urlEndpoint || "NOT_SET",
    isReady: Boolean(privateKey && publicKey && urlEndpoint),
  });

  if (!privateKey || !publicKey || !urlEndpoint) {
    const missing: string[] = [];
    if (!privateKey) missing.push("IMAGEKIT_PRIVATE_KEY");
    if (!publicKey) missing.push("IMAGEKIT_PUBLIC_KEY (or NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY)");
    if (!urlEndpoint) missing.push("IMAGEKIT_URL_ENDPOINT (or NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)");

    throw new Error(
      `ImageKit server configuration missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Normalize urlEndpoint: remove trailing slash
  const normalizedEndpoint = urlEndpoint.replace(/\/+$/, "");

  return {
    privateKey,
    publicKey,
    urlEndpoint: normalizedEndpoint,
  };
}

/**
 * Generates authenticated parameters for client-side direct uploads to ImageKit.
 *
 * Algorithm per official ImageKit documentation:
 * - token: unique random string (UUID)
 * - expire: Unix epoch timestamp in seconds (< 1 hour in the future)
 * - signature: HMAC-SHA1 of (token + expire) using privateKey as secret (lowercase hex)
 *
 * @param folder - Destination folder on ImageKit (e.g. "/wasteindia/products")
 */
export function generateImageKitUploadAuth(
  folder: string = "/wasteindia/products"
): ImageKitAuthPayload {
  const { privateKey, publicKey, urlEndpoint } = getImageKitConfig();

  const token = crypto.randomUUID();
  // Set expire to 30 minutes (1800 seconds) in the future
  const expire = Math.floor(Date.now() / 1000) + 1800;

  // Concatenate token + expire as specified by ImageKit
  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  // Ensure folder starts with a forward slash for ImageKit format
  const normalizedFolder = folder.startsWith("/") ? folder : `/${folder}`;

  return {
    token,
    expire,
    signature,
    publicKey,
    urlEndpoint,
    folder: normalizedFolder,
  };
}

/**
 * Uploads a file buffer directly to ImageKit using ImageKit's V1 REST API with Basic Auth.
 * Used for server-side uploads.
 *
 * @param buffer - File Buffer
 * @param filename - Destination file name
 * @param folder - Target folder in ImageKit
 * @param timeoutMs - Request timeout in ms (default 60s)
 */
export async function uploadBufferToImageKit(
  buffer: Buffer,
  filename: string,
  folder: string = "/wasteindia/products",
  timeoutMs: number = 60000
): Promise<ImageKitUploadResult> {
  const { privateKey } = getImageKitConfig();

  // Basic auth header using ImageKit Private Key as username (empty password)
  const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

  // Build FormData for ImageKit V1 Upload API
  const formData = new FormData();
  // Convert Node Buffer to a Blob with filename
  const blob = new Blob([new Uint8Array(buffer)]);
  formData.append("file", blob, filename);
  formData.append("fileName", filename);

  const normalizedFolder = folder.startsWith("/") ? folder : `/${folder}`;
  formData.append("folder", normalizedFolder);
  formData.append("useUniqueFileName", "true");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || !data.url) {
      const errorMsg = data?.message || data?.help || `ImageKit upload failed with HTTP status ${res.status}`;
      const err = new Error(errorMsg);
      (err as any).http_code = res.status;
      throw err;
    }

    console.log("[ImageKit Upload Success]:", {
      fileId: data.fileId,
      name: data.name,
      url: data.url,
      size: data.size,
    });

    return {
      url: data.url,
      fileId: data.fileId,
      name: data.name,
      filePath: data.filePath,
      thumbnailUrl: data.thumbnailUrl,
      format: data.format,
      width: data.width,
      height: data.height,
      size: data.size,
    };
  } catch (error: any) {
    clearTimeout(timer);
    if (error.name === "AbortError") {
      const timeoutError = new Error(`ImageKit upload timed out after ${Math.round(timeoutMs / 1000)}s`);
      (timeoutError as any).http_code = 499;
      throw timeoutError;
    }
    throw error;
  }
}
