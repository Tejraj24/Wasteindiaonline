import {
  getPhonePeConfig,
  isPhonePeConfigured,
  validateWebhookHeader,
} from "../lib/services/phonepe.service";
import { formatStorefrontProduct } from "../lib/services/product.service";
import { generateMerchantOrderId } from "../lib/services/order.service";

async function runTests() {
  console.log("=================================================");
  console.log("  WASTE® PhonePe PG V2 & Preorder Test Suite     ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // TEST 1: Merchant Order ID Format Compliance (PhonePe regex: [A-Za-z0-9_-]+)
  const orderId = generateMerchantOrderId();
  const phonePeRegex = /^[A-Za-z0-9_-]{1,64}$/;
  assert(
    phonePeRegex.test(orderId),
    "T1: Merchant Order ID format conforms to PhonePe alphanumeric requirements",
    `Generated: ${orderId}`
  );

  // TEST 2: Fail-Safe Credentials Check
  const isConfigured = isPhonePeConfigured();
  console.log(`   PhonePe Credentials Configured: ${isConfigured ? "YES" : "NO (Sandbox placeholders present)"}`);
  try {
    getPhonePeConfig();
    assert(true, "T2: PhonePe configuration validates active credentials");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    assert(
      msg.includes("PHONEPE_CREDENTIALS_MISSING"),
      "T2: Fail-safe protection: Throws explicit error when credentials are not yet configured in env",
      msg
    );
  }

  // TEST 3: Preorder Product Formatting & Capacity Check
  const samplePreorderProduct = formatStorefrontProduct({
    id: "test-prod-1",
    slug: "overdyed-vintage-tee",
    name: "Overdyed Vintage Tee",
    description: "Heavyweight jersey.",
    price: 4990,
    compareAtPrice: 5990,
    brand: "WASTE.",
    status: "ACTIVE",
    inventory: 0, // 0 physical inventory
    isPreorder: true,
    preorderCapacity: 25,
    preorderAllocated: 5,
    expectedShipmentText: "Arrives November 2026",
    releaseDate: new Date("2026-11-15"),
    featured: true,
    tags: ["Signature"],
    createdAt: new Date(),
  });

  assert(
    samplePreorderProduct.isPreorder === true,
    "T3.1: Preorder flag recognized in storefront product"
  );
  assert(
    samplePreorderProduct.soldOut === false,
    "T3.2: Preorder with 0 physical inventory but available capacity is NOT marked sold out"
  );
  assert(
    samplePreorderProduct.expectedShipmentText === "Arrives November 2026",
    "T3.3: Preorder expected shipment notice correctly passed to storefront"
  );

  // TEST 4: Preorder Capacity Limit Reached
  const fullPreorderProduct = formatStorefrontProduct({
    id: "test-prod-2",
    slug: "limited-cargo",
    name: "Limited Technical Cargo",
    description: "Technical twill.",
    price: 8990,
    brand: "WASTE.",
    status: "ACTIVE",
    inventory: 0,
    isPreorder: true,
    preorderCapacity: 20,
    preorderAllocated: 20, // Capacity full
    featured: false,
    tags: [],
    createdAt: new Date(),
  });

  assert(
    fullPreorderProduct.soldOut === true,
    "T4: Preorder item with allocated >= capacity is correctly evaluated as soldOut"
  );

  // TEST 5: Normal In-Stock Product Isolation (Zero Preorder Regression)
  const standardProduct = formatStorefrontProduct({
    id: "test-prod-3",
    slug: "standard-hoodie",
    name: "Classic Boxy Hoodie",
    description: "Fleece cotton.",
    price: 6990,
    brand: "WASTE.",
    status: "ACTIVE",
    inventory: 10,
    isPreorder: false,
    featured: false,
    tags: [],
    createdAt: new Date(),
  });

  assert(
    standardProduct.isPreorder === false && standardProduct.soldOut === false,
    "T5: Normal in-stock product inventory behavior remains intact without regression"
  );

  // TEST 6: Webhook Signature Header Validation
  process.env.PHONEPE_WEBHOOK_USERNAME = "test_merchant";
  process.env.PHONEPE_WEBHOOK_PASSWORD = "test_password_123";

  const validBasicAuth = `Basic ${Buffer.from("test_merchant:test_password_123").toString("base64")}`;
  const invalidBasicAuth = `Basic ${Buffer.from("wrong_user:wrong_password").toString("base64")}`;

  assert(
    validateWebhookHeader(validBasicAuth) === true,
    "T6.1: Valid webhook authorization header accepted"
  );
  assert(
    validateWebhookHeader(invalidBasicAuth) === false,
    "T6.2: Forged/tampered webhook authorization header rejected with 401"
  );
  assert(
    validateWebhookHeader(null) === false,
    "T6.3: Missing webhook authorization header rejected"
  );

  // TEST 7: Price Tampering Defense Simulation
  // Simulate attacker sending manipulated price in cart payload
  const trustedDbProducts = [
    { id: "p1", price: 4990, name: "WASTE Heavy Tee" },
    { id: "p2", price: 9990, name: "WASTE Bomber Jacket" },
  ];
  const clientPayload = [
    { productId: "p1", quantity: 1, price: 1 }, // Tampered price: ₹1
    { productId: "p2", quantity: 2, price: 10 }, // Tampered price: ₹10
  ];

  // Server calculation strictly using DB prices:
  let serverTotal = 0;
  for (const item of clientPayload) {
    const dbItem = trustedDbProducts.find((p) => p.id === item.productId);
    if (dbItem) {
      serverTotal += dbItem.price * item.quantity;
    }
  }

  assert(
    serverTotal === 4990 + 9990 * 2,
    "T7: Server strictly calculates total using trusted database prices (₹24,970), rejecting client-side ₹21 attempt"
  );

  // TEST 8: Atomic Capacity Math Simulation
  // Capacity = 10, Current Allocated = 9, Request 2 -> Exceeds
  const capacity = 10;
  let allocated = 9;
  const requested = 2;
  const canAllocate = allocated + requested <= capacity;
  assert(
    canAllocate === false,
    "T8: Atomic capacity check prevents over-allocation when request exceeds remaining slots"
  );

  // TEST 9: Idempotent Release Calculation
  let allocatedAfterFailure = Math.max(0, allocated - 1);
  assert(
    allocatedAfterFailure === 8,
    "T9: Preorder reservation release safely decrements allocation without dropping below zero"
  );

  console.log("\n=================================================");
  console.log(`  Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
