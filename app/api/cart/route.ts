import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await verifyAuthToken(req);
    if (!auth || !auth.dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: auth.dbUser.id },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      items: cart?.items || [],
    });
  } catch (error: unknown) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuthToken(req);
    if (!auth || !auth.dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items: Array<{
      productId: string;
      title: string;
      price: number;
      compareAtPrice?: number | null;
      image: string;
      size: string;
      sku?: string;
      quantity: number;
    }> = body.items || [];

    // Upsert user's cart container
    const cart = await prisma.cart.upsert({
      where: { userId: auth.dbUser.id },
      update: {},
      create: { userId: auth.dbUser.id },
    });

    // Clear and replace cart items in transaction
    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      }),
      ...(items.length > 0
        ? [
            prisma.cartItem.createMany({
              data: items.map((item) => ({
                cartId: cart.id,
                productId: item.productId,
                title: item.title,
                price: item.price,
                compareAtPrice: item.compareAtPrice || null,
                image: item.image,
                size: item.size || "M",
                sku: item.sku || null,
                quantity: item.quantity || 1,
              })),
            }),
          ]
        : []),
    ]);

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({
      items: updatedCart?.items || [],
    });
  } catch (error: unknown) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
