import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/admin";
import { createPreorder } from "@/lib/services/order.service";

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

    const preorder = await createPreorder({
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
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber: preorder.orderNumber,
        redirectUrl: `/checkout/result?orderNumber=${encodeURIComponent(preorder.orderNumber)}`,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process preorder";
    console.error("[POST /api/orders Error]", message);

    if (message.includes("PRODUCT_UNAVAILABLE")) {
      return NextResponse.json({ error: "One or more selected pieces are no longer active." }, { status: 409 });
    }
    if (message.includes("INVALID_QUANTITY")) {
      return NextResponse.json({ error: "Allowed quantity is 1 to 5 units per item." }, { status: 400 });
    }
    if (message.includes("INVALID_CART")) {
      return NextResponse.json({ error: "Your shopping bag is empty." }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
