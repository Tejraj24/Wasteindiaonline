import { NextRequest, NextResponse } from "next/server";
import { validateWebhookHeader } from "@/lib/services/phonepe.service";
import { reconcileOrderWithPhonePe } from "@/lib/services/order.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

    // 1. Authenticate webhook notification
    const isValidAuth = validateWebhookHeader(authHeader);
    if (!isValidAuth) {
      console.warn("[PhonePe Webhook Auth Failed] Header mismatch or untrusted sender.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bodyText = await req.text();
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(bodyText);
    } catch {
      console.warn("[PhonePe Webhook] Received unparseable JSON payload");
    }

    // PhonePe V2 payload typically contains payload: { orderId, merchantOrderId, state, ... }
    const payload = (body.payload as Record<string, unknown>) || body;
    const merchantOrderId =
      (payload.merchantOrderId as string) || (payload.orderId as string) || (body.orderId as string);

    if (!merchantOrderId) {
      console.warn("[PhonePe Webhook] No merchantOrderId detected in payload:", body);
      // Return 200 to prevent infinite retries from malformed test pings
      return NextResponse.json({ status: "IGNORED_NO_ORDER_ID" }, { status: 200 });
    }

    console.log(`[PhonePe Webhook Received] Processing merchantOrderId: ${merchantOrderId}`);

    // 2. Perform authoritative cross-verification with PhonePe server-to-server API
    const result = await reconcileOrderWithPhonePe(merchantOrderId);

    console.log(
      `[PhonePe Webhook Handled] Order ${merchantOrderId} reconciled to state: ${result.state}`
    );

    return NextResponse.json({ status: "SUCCESS", state: result.state });
  } catch (error: unknown) {
    console.error("[PhonePe Webhook Error]", error);
    // Return 500 so PhonePe retries if it was a transient internal failure
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
