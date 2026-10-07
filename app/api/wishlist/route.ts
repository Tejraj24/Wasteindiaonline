import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

/**
 * Ensures a PostgreSQL User record exists for the authenticated Firebase user.
 * Guarantees upsert semantics using Firebase UID as the stable identity.
 */
async function ensureUser(uid: string, email?: string) {
  const existingUserById = await prisma.user.findUnique({
    where: { id: uid },
  });

  if (existingUserById) {
    if (email && existingUserById.email !== email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (!existingEmail) {
        await prisma.user.update({
          where: { id: uid },
          data: { email },
        });
      }
    }
    return existingUserById;
  }

  if (email) {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return existingUserByEmail;
    }
  }

  return prisma.user.create({
    data: {
      id: uid,
      email: email || `${uid}@placeholder.wasteindia.internal`,
    },
  });
}

/**
 * GET /api/wishlist
 * Returns current authenticated user's wishlist items.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const decodedToken = await verifyFirebaseToken(authHeader);
    const user = await ensureUser(decodedToken.uid, decodedToken.email);

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      items.map((item) => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        category: item.category ?? undefined,
        createdAt: item.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message, success: false }, { status: 401 });
  }
}

/**
 * POST /api/wishlist
 * Adds or updates a wishlist item for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const decodedToken = await verifyFirebaseToken(authHeader);
    const user = await ensureUser(decodedToken.uid, decodedToken.email);

    const body = await request.json();
    const item = body.item || body;

    if (!item?.productId) {
      return NextResponse.json({ error: "Missing productId", success: false }, { status: 400 });
    }

    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: item.productId,
        },
      },
      update: {
        name: item.name ?? "",
        slug: item.slug ?? "",
        image: item.image ?? "",
        price: typeof item.price === "number" ? item.price : 0,
        category: item.category ?? null,
      },
      create: {
        userId: user.id,
        productId: item.productId,
        name: item.name ?? "",
        slug: item.slug ?? "",
        image: item.image ?? "",
        price: typeof item.price === "number" ? item.price : 0,
        category: item.category ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save wishlist item";
    return NextResponse.json({ error: message, success: false }, { status: 401 });
  }
}

/**
 * DELETE /api/wishlist
 * Removes a wishlist item by productId for the authenticated user.
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const decodedToken = await verifyFirebaseToken(authHeader);
    const user = await ensureUser(decodedToken.uid, decodedToken.email);

    let productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      try {
        const body = await request.json();
        productId = body?.productId;
      } catch {
        // body may be empty
      }
    }

    if (!productId) {
      return NextResponse.json({ error: "Missing productId", success: false }, { status: 400 });
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
        productId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove wishlist item";
    return NextResponse.json({ error: message, success: false }, { status: 401 });
  }
}
