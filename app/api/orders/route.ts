import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/admin";
import { createCheckoutSession } from "@/lib/services/order.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items } = body;

    // Validate customer contact information
    if (!customer || typeof customer !== "object") {
      return NextResponse.json(
        { error: "Customer details are required." },
        { status: 400 }
      );
    }

    const { name, email, phone, addressLine1, addressLine2, city, state, pincode } = customer;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide a valid full name." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!phone || !/^\+?[0-9]{10,13}$/.test(phone.replace(/[\s-]/g, ""))) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile phone number." },
        { status: 400 }
      );
    }
    if (!addressLine1 || addressLine1.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid street address." },
        { status: 400 }
      );
    }
    if (!city || !state || !/^\d{6}$/.test((pincode || "").trim())) {
      return NextResponse.json(
        { error: "Please provide a valid City, State, and 6-digit Pincode." },
        { status: 400 }
      );
    }

    // Validate cart items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    // Check optional authenticated user
    let userId: string | null = null;
    try {
      const auth = await verifyAuthToken(req);
      if (auth?.dbUser?.id) {
        userId = auth.dbUser.id;
      }
    } catch {
      // Safe fallback: allow guest checkout if unauthenticated
    }

    // Determine public redirect base URL
    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: (addressLine2 || "").trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      items: items.map((i: { productId: string; size?: string; quantity?: number }) => ({
        productId: i.productId,
        size: i.size || "M",
        quantity: Math.max(1, parseInt(String(i.quantity || 1), 10)),
      })),
      userId,
      redirectBaseUrl: origin,
    });

    return NextResponse.json(
      {
        success: true,
        redirectUrl: session.redirectUrl,
        orderNumber: session.orderNumber,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/orders Error]", error);
    const message = error instanceof Error ? error.message : "Failed to process order";

    if (message.includes("PREORDER_CAPACITY_EXCEEDED")) {
      return NextResponse.json({ error: message.replace("PREORDER_CAPACITY_EXCEEDED: ", "") }, { status: 409 });
    }
    if (message.includes("INSUFFICIENT_STOCK")) {
      return NextResponse.json({ error: message.replace("INSUFFICIENT_STOCK: ", "") }, { status: 409 });
    }
    if (message.includes("PHONEPE_CREDENTIALS_MISSING")) {
      return NextResponse.json(
        {
          error:
            "Payment Gateway is in sandbox setup mode. Please configure PhonePe sandbox credentials in server environment settings.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
