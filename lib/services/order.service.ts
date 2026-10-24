import { prisma } from "@/lib/prisma";
import {
  initiateStandardCheckout,
  getPhonePeOrderStatus,
} from "@/lib/services/phonepe.service";
import { sendOrderConfirmationEmail } from "@/lib/services/email.service";

export interface CheckoutCustomerData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CheckoutItemPayload {
  productId: string;
  size: string;
  quantity: number;
}

export function generateMerchantOrderId(): string {
  // PhonePe requires alphanumeric characters, underscores, and hyphens [A-Za-z0-9_-]+
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WST-${timestamp}-${random}`;
}

/**
 * Creates a pending order, atomically reserves preorder capacity / in-stock inventory,
 * and initiates a PhonePe PG V2 Standard Checkout session.
 *
 * If payment initiation fails, reservations are automatically rolled back.
 */
export async function createCheckoutSession(params: {
  customer: CheckoutCustomerData;
  items: CheckoutItemPayload[];
  userId?: string | null;
  redirectBaseUrl: string;
}): Promise<{ redirectUrl: string; orderNumber: string; merchantOrderId: string }> {
  if (!params.items || params.items.length === 0) {
    throw new Error("INVALID_CART: Cart is empty.");
  }

  // 1. Fetch products from database using trusted server prices
  const productIds = Array.from(new Set(params.items.map((i) => i.productId)));
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE",
    },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Verify all products exist and are active
  for (const item of params.items) {
    const prod = productMap.get(item.productId);
    if (!prod) {
      throw new Error(`PRODUCT_UNAVAILABLE: Product ${item.productId} is no longer active.`);
    }
    if (item.quantity <= 0 || item.quantity > 5) {
      throw new Error(`INVALID_QUANTITY: Allowed quantity is 1 to 5 units per item.`);
    }
  }

  // 2. Compute trusted totals on server
  let subtotal = 0;
  let hasPreorder = false;
  let maxReleaseDate: Date | null = null;

  const verifiedItems = params.items.map((item) => {
    const prod = productMap.get(item.productId)!;
    const itemTotal = prod.price * item.quantity;
    subtotal += itemTotal;

    if (prod.isPreorder) {
      hasPreorder = true;
      if (prod.releaseDate && (!maxReleaseDate || prod.releaseDate > maxReleaseDate)) {
        maxReleaseDate = prod.releaseDate;
      }
    }

    return {
      productId: prod.id,
      title: prod.name,
      price: prod.price,
      size: item.size || "M",
      quantity: item.quantity,
      isPreorder: prod.isPreorder,
      releaseDate: prod.releaseDate,
      image: prod.slug, // fallback identifier
    };
  });

  const shipping = 0; // Complimentary carbon-neutral delivery across India
  const tax = 0;
  const total = subtotal + shipping + tax;
  const amountInPaise = Math.round(total * 100);

  const merchantOrderId = generateMerchantOrderId();
  const orderNumber = merchantOrderId;
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minute session

  let createdOrderId: string | null = null;

  // 3. Atomically reserve capacity & create Order inside a Prisma Transaction
  try {
    await prisma.$transaction(async (tx) => {
      // Reserve capacity for each item atomically
      for (const item of verifiedItems) {
        if (item.isPreorder) {
          // Preorder: atomically increment preorderAllocated if capacity allows
          const rowsUpdated = await tx.$executeRaw`
            UPDATE "Product"
            SET "preorderAllocated" = "preorderAllocated" + ${item.quantity}
            WHERE id = ${item.productId}
              AND "isPreorder" = true
              AND ("preorderCapacity" IS NULL OR "preorderAllocated" + ${item.quantity} <= "preorderCapacity")
          `;

          if (rowsUpdated === 0) {
            throw new Error(
              `PREORDER_CAPACITY_EXCEEDED: "${item.title}" has reached its maximum preorder capacity.`
            );
          }
        } else {
          // In-stock: atomically decrement physical inventory
          const rowsUpdated = await tx.$executeRaw`
            UPDATE "Product"
            SET "inventory" = "inventory" - ${item.quantity}
            WHERE id = ${item.productId}
              AND "isPreorder" = false
              AND "inventory" >= ${item.quantity}
          `;

          if (rowsUpdated === 0) {
            throw new Error(
              `INSUFFICIENT_STOCK: "${item.title}" is out of stock in this quantity.`
            );
          }
        }
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          merchantOrderId,
          userId: params.userId || null,
          customerName: params.customer.name,
          customerEmail: params.customer.email,
          customerPhone: params.customer.phone,
          shippingAddress: {
            addressLine1: params.customer.addressLine1,
            addressLine2: params.customer.addressLine2 || "",
            city: params.customer.city,
            state: params.customer.state,
            pincode: params.customer.pincode,
            country: "India",
          },
          subtotal,
          shipping,
          tax,
          total,
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          isPreorder: hasPreorder,
          releaseDate: maxReleaseDate,
          expiresAt,
          capacityReserved: true,
          items: {
            create: verifiedItems.map((vi) => ({
              productId: vi.productId,
              title: vi.title,
              size: vi.size,
              quantity: vi.quantity,
              price: vi.price,
              image: vi.image,
              isPreorder: vi.isPreorder,
              releaseDate: vi.releaseDate,
            })),
          },
        },
      });

      createdOrderId = newOrder.id;
    });
  } catch (txError: unknown) {
    const msg = txError instanceof Error ? txError.message : "Order creation failed";
    throw new Error(msg);
  }

  // 4. Initiate PhonePe Payment
  const redirectUrl = `${params.redirectBaseUrl}/checkout/result?orderNumber=${encodeURIComponent(
    orderNumber
  )}`;

  try {
    const payResult = await initiateStandardCheckout({
      merchantOrderId,
      amountInPaise,
      redirectUrl,
      message: `Payment for WASTE order #${orderNumber}`,
    });

    // Update order with PhonePe's returned orderId
    if (payResult.orderId) {
      await prisma.order.update({
        where: { id: createdOrderId! },
        data: { phonePeOrderId: payResult.orderId },
      });
    }

    return {
      redirectUrl: payResult.redirectUrl,
      orderNumber,
      merchantOrderId,
    };
  } catch (payError: unknown) {
    // Crucial: Roll back the reservations immediately if PhonePe initiation fails!
    console.error("[PhonePe Payment Initiation Failure] Rolling back reserved inventory:", payError);
    if (createdOrderId) {
      await rollbackOrderReservation(createdOrderId, "Payment initiation failed");
    }
    const msg = payError instanceof Error ? payError.message : "Payment initiation failed";
    throw new Error(`CHECKOUT_INITIATION_FAILED: ${msg}`);
  }
}

/**
 * Idempotently rolls back inventory / preorder capacity reservations for an order.
 */
export async function rollbackOrderReservation(orderId: string, reason: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || !order.capacityReserved) {
      return; // Already released or order not found
    }

    // Release each item
    for (const item of order.items) {
      if (!item.productId) continue;

      if (item.isPreorder) {
        await tx.$executeRaw`
          UPDATE "Product"
          SET "preorderAllocated" = GREATEST(0, "preorderAllocated" - ${item.quantity})
          WHERE id = ${item.productId} AND "isPreorder" = true
        `;
      } else {
        await tx.$executeRaw`
          UPDATE "Product"
          SET "inventory" = "inventory" + ${item.quantity}
          WHERE id = ${item.productId} AND "isPreorder" = false
        `;
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        capacityReserved: false,
        paymentStatus: "FAILED",
        orderStatus: "CANCELLED",
      },
    });

    console.log(`[Order Reservation Rolled Back] Order ${order.orderNumber} - Reason: ${reason}`);
  });
}

/**
 * Confirms order payment idempotently after verified payment success from PhonePe.
 */
export async function confirmOrderPayment(
  merchantOrderId: string,
  phonePeOrderId?: string,
  rawStatus?: Record<string, unknown>
): Promise<{ order: unknown; alreadyConfirmed: boolean }> {
  const existingOrder = await prisma.order.findUnique({
    where: { merchantOrderId },
    include: { items: true },
  });

  if (!existingOrder) {
    throw new Error(`ORDER_NOT_FOUND: Order with merchantOrderId ${merchantOrderId} not found.`);
  }

  // Idempotency: If already marked PAID, do not double-process or re-send emails
  if (existingOrder.paymentStatus === "PAID") {
    return { order: existingOrder, alreadyConfirmed: true };
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: existingOrder.id },
      data: {
        paymentStatus: "PAID",
        orderStatus: existingOrder.isPreorder ? "PREORDER_PLACED" : "CONFIRMED",
        phonePeOrderId: phonePeOrderId || existingOrder.phonePeOrderId,
      },
      include: { items: true },
    });

    // Record PaymentTransaction audit entry
    await tx.paymentTransaction.create({
      data: {
        orderId: order.id,
        merchantOrderId,
        phonePeOrderId: phonePeOrderId || null,
        amount: order.total,
        state: "COMPLETED",
        paymentInstrument: rawStatus?.paymentDetails as unknown as object || null,
        rawResponse: rawStatus as unknown as object || null,
      },
    });

    return order;
  });

  // Dispatch confirmation email asynchronously
  const shippingAddr = (updatedOrder.shippingAddress || {}) as {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  void sendOrderConfirmationEmail({
    orderNumber: updatedOrder.orderNumber,
    customerName: updatedOrder.customerName || "Customer",
    customerEmail: updatedOrder.customerEmail || "",
    isPreorder: updatedOrder.isPreorder,
    releaseDate: updatedOrder.releaseDate,
    items: updatedOrder.items,
    subtotal: updatedOrder.subtotal,
    shipping: updatedOrder.shipping,
    total: updatedOrder.total,
    shippingAddress: shippingAddr,
  }).catch((err) => {
    console.error("[Order Confirmation Email Dispatch Failed]", err);
  });

  return { order: updatedOrder, alreadyConfirmed: false };
}

/**
 * Reconciles an order with PhonePe by verifying its status server-to-server.
 */
export async function reconcileOrderWithPhonePe(
  merchantOrderId: string
): Promise<{ state: "PENDING" | "COMPLETED" | "FAILED"; order: unknown }> {
  const order = await prisma.order.findUnique({
    where: { merchantOrderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error(`ORDER_NOT_FOUND: Order ${merchantOrderId} does not exist.`);
  }

  // If already confirmed as PAID, return immediately
  if (order.paymentStatus === "PAID") {
    return { state: "COMPLETED", order };
  }

  // Query PhonePe directly
  try {
    const statusResult = await getPhonePeOrderStatus(merchantOrderId);

    if (statusResult.state === "COMPLETED") {
      const { order: confirmedOrder } = await confirmOrderPayment(
        merchantOrderId,
        statusResult.orderId,
        statusResult.raw
      );
      return { state: "COMPLETED", order: confirmedOrder };
    }

    if (statusResult.state === "FAILED") {
      await rollbackOrderReservation(order.id, "PhonePe reported FAILED status");
      const updated = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
      return { state: "FAILED", order: updated };
    }

    return { state: "PENDING", order };
  } catch (err: unknown) {
    console.error(`[Reconcile Error for ${merchantOrderId}]`, err);
    return { state: (order.paymentStatus === "PAID" ? "COMPLETED" : "PENDING"), order };
  }
}
