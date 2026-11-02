import crypto from "crypto";

export interface PhonePeConfig {
  env: "sandbox" | "production";
  clientId: string;
  clientSecret: string;
  clientVersion: number;
  webhookUsername?: string;
  webhookPassword?: string;
  appUrl: string;
  oauthUrl: string;
  pgBaseUrl: string;
}

export interface InitiatePaymentParams {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  message?: string;
}

export interface InitiatePaymentResult {
  orderId: string;
  state: "PENDING" | "COMPLETED" | "FAILED";
  redirectUrl: string;
  expireAt?: number;
}

export interface OrderStatusResult {
  orderId: string;
  state: "PENDING" | "COMPLETED" | "FAILED";
  amount: number;
  paymentDetails?: Array<{
    paymentId?: string;
    amount?: number;
    state?: string;
    paymentInstrument?: Record<string, unknown>;
  }>;
  raw: Record<string, unknown>;
}

// In-memory token cache to prevent redundant OAuth token calls
let cachedToken: {
  token: string;
  expiresAtMs: number;
} | null = null;

export function getPhonePeConfig(): PhonePeConfig {
  const env = (process.env.PHONEPE_ENV || "sandbox").toLowerCase() === "production" ? "production" : "sandbox";
  const clientId = process.env.PHONEPE_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET?.trim() || "";
  const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || "1", 10);
  const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME?.trim();
  const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD?.trim();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

  if (!clientId || !clientSecret) {
    throw new Error(
      "PHONEPE_CREDENTIALS_MISSING: PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET must be configured in server environment variables."
    );
  }

  const oauthUrl =
    env === "production"
      ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

  const pgBaseUrl =
    env === "production"
      ? "https://api.phonepe.com/apis/pg"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox";

  return {
    env,
    clientId,
    clientSecret,
    clientVersion,
    webhookUsername,
    webhookPassword,
    appUrl,
    oauthUrl,
    pgBaseUrl,
  };
}

export function isPhonePeConfigured(): boolean {
  try {
    getPhonePeConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves an active OAuth bearer token using PhonePe's client_credentials flow.
 * Tokens are cached in-memory until near expiration.
 */
export async function getPhonePeAuthToken(): Promise<string> {
  const config = getPhonePeConfig();
  const now = Date.now();

  // Return cached token if still valid (with 60-second safety buffer)
  if (cachedToken && cachedToken.expiresAtMs > now + 60000) {
    return cachedToken.token;
  }

  const bodyParams = new URLSearchParams({
    client_id: config.clientId,
    client_version: config.clientVersion.toString(),
    client_secret: config.clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(config.oauthUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PhonePe OAuth Token Failed: HTTP ${response.status} - ${errorBody}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    token_type?: string;
    expires_at?: number;
    expires_in?: number;
  };

  if (!data.access_token) {
    throw new Error(`PhonePe OAuth Token response did not contain access_token.`);
  }

  // expires_at can be in seconds or milliseconds
  let expiresAtMs = now + 3600 * 1000;
  if (data.expires_at) {
    expiresAtMs = data.expires_at > 9999999999 ? data.expires_at : data.expires_at * 1000;
  } else if (data.expires_in) {
    expiresAtMs = now + data.expires_in * 1000;
  }

  cachedToken = {
    token: data.access_token,
    expiresAtMs,
  };

  return data.access_token;
}

/**
 * Creates a PhonePe standard checkout payment session (v2/pay).
 */
export async function initiateStandardCheckout(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const config = getPhonePeConfig();
  const token = await getPhonePeAuthToken();

  const payUrl = `${config.pgBaseUrl}/checkout/v2/pay`;
  const payload = {
    merchantOrderId: params.merchantOrderId,
    amount: params.amountInPaise,
    expireAfter: 1200, // 20 minutes in seconds
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: params.message || `Payment for order ${params.merchantOrderId}`,
      merchantUrls: {
        redirectUrl: params.redirectUrl,
      },
    },
  };

  const response = await fetch(payUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PhonePe Checkout Pay Failed: HTTP ${response.status} - ${errorBody}`);
  }

  const data = (await response.json()) as {
    orderId?: string;
    state?: string;
    redirectUrl?: string;
    expireAt?: number;
  };

  if (!data.redirectUrl) {
    throw new Error(`PhonePe Checkout Pay did not return a redirectUrl: ${JSON.stringify(data)}`);
  }

  return {
    orderId: data.orderId || "",
    state: (data.state as "PENDING" | "COMPLETED" | "FAILED") || "PENDING",
    redirectUrl: data.redirectUrl,
    expireAt: data.expireAt,
  };
}

/**
 * Queries server-side order status directly from PhonePe API.
 * Never trust customer redirect query parameters alone.
 */
export async function getPhonePeOrderStatus(
  merchantOrderId: string
): Promise<OrderStatusResult> {
  const config = getPhonePeConfig();
  const token = await getPhonePeAuthToken();

  const statusUrl = `${config.pgBaseUrl}/checkout/v2/order/${encodeURIComponent(
    merchantOrderId
  )}/status?details=false&errorContext=true`;

  const response = await fetch(statusUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `PhonePe Order Status Verification Failed: HTTP ${response.status} - ${errorBody}`
    );
  }

  const data = (await response.json()) as {
    orderId?: string;
    state?: string;
    amount?: number;
    paymentDetails?: Array<{
      paymentId?: string;
      amount?: number;
      state?: string;
      paymentInstrument?: Record<string, unknown>;
    }>;
  };

  return {
    orderId: data.orderId || "",
    state: (data.state as "PENDING" | "COMPLETED" | "FAILED") || "PENDING",
    amount: data.amount || 0,
    paymentDetails: data.paymentDetails,
    raw: data as unknown as Record<string, unknown>,
  };
}

/**
 * Validates incoming webhook authorization header against configured credentials.
 */
export function validateWebhookHeader(authHeader: string | null): boolean {
  const config = getPhonePeConfig();
  if (!config.webhookUsername || !config.webhookPassword) {
    // If webhook username/password not configured, we require explicit direct API status verification
    return true;
  }

  if (!authHeader) return false;

  // 1. Basic Auth check: Authorization: Basic <base64(user:pass)>
  const expectedBasic = `Basic ${Buffer.from(
    `${config.webhookUsername}:${config.webhookPassword}`
  ).toString("base64")}`;

  if (authHeader.trim() === expectedBasic) {
    return true;
  }

  // 2. SHA256 hashed signature check
  const combined = `${config.webhookUsername}:${config.webhookPassword}`;
  const shaHash = crypto.createHash("sha256").update(combined).digest("hex");
  if (authHeader.includes(shaHash)) {
    return true;
  }

  return false;
}
