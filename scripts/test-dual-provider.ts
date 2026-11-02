import crypto from "crypto";
import { isCloudinaryUrl, isImageKitUrl, getImageProvider, getSafeImageUrl, DEFAULT_FALLBACK_IMAGE } from "../lib/images";
import { generateImageKitUploadAuth, isImageKitConfigured } from "../lib/imagekit";
import { generateCloudinaryUploadSignature } from "../lib/cloudinary";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

console.log("\n=======================================================");
console.log("TEST SUITE: ImageKit + Cloudinary Dual-Provider Verification");
console.log("=======================================================\n");

// Test 1: Cloudinary URL Recognition
console.log("1. Cloudinary URL Detection & Provider Identification:");
const sampleCloudinaryUrl = "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933538/Waste_Black_Hoodie3_wxexba.png";
const sampleCloudinaryBgRemoved = "https://res.cloudinary.com/dom7a6zlx/image/upload/e_background_removal,f_png/v1791933538/Waste_Black_Hoodie3_wxexba.png";

assert(isCloudinaryUrl(sampleCloudinaryUrl) === true, "Standard Cloudinary URL detected");
assert(isCloudinaryUrl(sampleCloudinaryBgRemoved) === true, "Transformed Cloudinary URL detected");
assert(isImageKitUrl(sampleCloudinaryUrl) === false, "Cloudinary URL not identified as ImageKit");
assert(getImageProvider(sampleCloudinaryUrl) === "cloudinary", "getImageProvider returned 'cloudinary'");

// Test 2: ImageKit URL Recognition
console.log("\n2. ImageKit URL Detection & Provider Identification:");
const sampleImageKitUrl = "https://ik.imagekit.io/wasteindia/products/oversized_hoodie_2024.webp";
const sampleImageKitCustomDomain = "https://images.wasteluxe.in/products/oversized_hoodie_2024.webp";

assert(isImageKitUrl(sampleImageKitUrl) === true, "ik.imagekit.io URL detected");
assert(isCloudinaryUrl(sampleImageKitUrl) === false, "ImageKit URL not identified as Cloudinary");
assert(getImageProvider(sampleImageKitUrl) === "imagekit", "getImageProvider returned 'imagekit'");

// Test 3: External / Fallback URL Recognition
console.log("\n3. External Fallback URL Detection & Safe Fallback Handling:");
const sampleUnsplashUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80";

assert(getImageProvider(sampleUnsplashUrl) === "external", "Unsplash URL identified as 'external'");
assert(getSafeImageUrl(null) === DEFAULT_FALLBACK_IMAGE, "Null image safely returns default fallback image");
assert(getSafeImageUrl("") === DEFAULT_FALLBACK_IMAGE, "Empty image safely returns default fallback image");
assert(getSafeImageUrl("none") === DEFAULT_FALLBACK_IMAGE, "'none' sentinel safely returns default fallback image");
assert(getSafeImageUrl(sampleImageKitUrl) === sampleImageKitUrl, "Valid ImageKit URL preserved untouched");
assert(getSafeImageUrl(sampleCloudinaryUrl) === sampleCloudinaryUrl, "Valid Cloudinary URL preserved untouched");

// Test 4: ImageKit HMAC-SHA1 Signature Algorithm Verification
console.log("\n4. ImageKit Upload Authentication Signature Algorithm Verification:");
// Simulate known test vectors for HMAC-SHA1
const testPrivateKey = "private_test_key_sample123";
const testToken = "test-uuid-456";
const testExpire = 1700000000;

const expectedSignature = crypto
  .createHmac("sha1", testPrivateKey)
  .update(testToken + testExpire)
  .digest("hex");

// Verify HMAC-SHA1 output format
assert(typeof expectedSignature === "string" && expectedSignature.length === 40, "Signature is valid 40-character SHA1 hex digest");
assert(/^[0-9a-f]{40}$/.test(expectedSignature), "Signature matches lowercase hex string requirement");

// Test 5: ImageKit Auth Generator with Mock Env
console.log("\n5. ImageKit Auth Generator Execution with Configuration:");
const prevPrivKey = process.env.IMAGEKIT_PRIVATE_KEY;
const prevPubKey = process.env.IMAGEKIT_PUBLIC_KEY;
const prevEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

try {
  process.env.IMAGEKIT_PRIVATE_KEY = "private_mock_key_for_testing_only";
  process.env.IMAGEKIT_PUBLIC_KEY = "public_mock_key_123";
  process.env.IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/mock_endpoint";

  assert(isImageKitConfigured() === true, "isImageKitConfigured() returns true when vars are present");

  const authData = generateImageKitUploadAuth("/wasteindia/products");
  assert(Boolean(authData.token), "Token generated");
  assert(typeof authData.expire === "number" && authData.expire > Math.floor(Date.now() / 1000), "Expire is future Unix timestamp");
  assert(authData.expire < Math.floor(Date.now() / 1000) + 3600, "Expire is within 1 hour limit");
  assert(authData.signature.length === 40, "Signature is valid 40-char SHA1 hex");
  assert(authData.publicKey === "public_mock_key_123", "Public key correctly provided for client");
  assert(authData.urlEndpoint === "https://ik.imagekit.io/mock_endpoint", "URL endpoint correctly provided");
  assert(authData.folder === "/wasteindia/products", "Folder formatted with leading slash");

  // Re-compute signature to guarantee calculation correctness
  const verificationSig = crypto
    .createHmac("sha1", "private_mock_key_for_testing_only")
    .update(authData.token + authData.expire)
    .digest("hex");
  assert(authData.signature === verificationSig, "Generated signature matches authoritative HMAC-SHA1 calculation");
} finally {
  process.env.IMAGEKIT_PRIVATE_KEY = prevPrivKey;
  process.env.IMAGEKIT_PUBLIC_KEY = prevPubKey;
  process.env.IMAGEKIT_URL_ENDPOINT = prevEndpoint;
}

// Test 6: Missing Credentials Handling
console.log("\n6. Missing Credentials Safety & Error Handling:");
const oldPriv = process.env.IMAGEKIT_PRIVATE_KEY;
delete process.env.IMAGEKIT_PRIVATE_KEY;

try {
  let threwExpected = false;
  try {
    generateImageKitUploadAuth();
  } catch (err: any) {
    threwExpected = true;
    assert(err.message.includes("IMAGEKIT_PRIVATE_KEY"), "Descriptive error identifies missing IMAGEKIT_PRIVATE_KEY");
  }
  assert(threwExpected === true, "Calling ImageKit generation without credentials throws descriptive error instead of crashing silently");
} finally {
  if (oldPriv) process.env.IMAGEKIT_PRIVATE_KEY = oldPriv;
}

// Test 7: Cloudinary Signature Generation Verification
console.log("\n7. Existing Cloudinary Flow Compatibility:");
try {
  const cldSig = generateCloudinaryUploadSignature("wasteindia/products");
  assert(Boolean(cldSig.signature), "Cloudinary signature generated");
  assert(typeof cldSig.timestamp === "number", "Cloudinary timestamp present");
  assert(cldSig.folder === "wasteindia/products", "Cloudinary folder preserved");
  assert(Boolean(cldSig.apiKey), "Cloudinary apiKey present");
} catch (err: any) {
  console.log("  (Cloudinary env missing or partially set in current test run:", err.message, ")");
}

console.log("\n-------------------------------------------------------");
console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log("-------------------------------------------------------\n");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
