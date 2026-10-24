import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reconcileOrderWithPhonePe } from "@/lib/services/order.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber")?.trim();

    if (!orderNumber) {
      return NextResponse.json({ error: "Missing orderNumber parameter." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // If order is still PENDING, verify status with PhonePe PG API directly
    if (order.paymentStatus === "PENDING" && order.merchantOrderId) {
      try {
        const { state, order: updated } = await reconcileOrderWithPhonePe(order.merchantOrderId);
        return NextResponse.json({
          order: updated || order,
          verifiedState: state,
        });
      } catch (reconcileErr) {
        console.warn("[Verify Endpoint Reconcile Warning]", reconcileErr);
      }
    }

    return NextResponse.json({
      order,
      verifiedState: order.paymentStatus === "PAID" ? "COMPLETED" : order.paymentStatus,
    });
  } catch (error: unknown) {
    console.error("[GET /api/orders/verify Error]", error);
    return NextResponse.json(
      { error: "Failed to verify order payment status." },
      { status: 500 }
    );
  }
}
