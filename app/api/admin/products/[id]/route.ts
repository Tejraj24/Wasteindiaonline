import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req);
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req);
    const { id } = params;
    const body = await req.json();

    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      compareAtPrice,
      categoryId,
      brand,
      status,
      inventory,
      featured,
      tags,
      images,
    } = body;

    // Delete existing images if new image array provided
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: price !== undefined ? parseFloat(price) : undefined,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        categoryId: categoryId || null,
        brand,
        status,
        inventory: inventory !== undefined ? parseInt(inventory, 10) : undefined,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined,
        images: Array.isArray(images)
          ? {
              create: images.map((img: { imageUrl: string; altText?: string }, index: number) => ({
                imageUrl: typeof img === "string" ? img : img.imageUrl,
                altText: (typeof img === "object" ? img.altText : null) || `${name || "Product"} view ${index + 1}`,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req);
    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Duplicate product
  try {
    await requireAdminAuth(req);
    const { id } = params;

    const original = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!original) {
      return NextResponse.json({ error: "Original product not found" }, { status: 404 });
    }

    const timestamp = Date.now().toString().slice(-4);
    const newSlug = `${original.slug}-copy-${timestamp}`;
    const newName = `${original.name} (Copy)`;

    const duplicated = await prisma.product.create({
      data: {
        name: newName,
        slug: newSlug,
        description: original.description,
        shortDescription: original.shortDescription,
        price: original.price,
        compareAtPrice: original.compareAtPrice,
        categoryId: original.categoryId,
        brand: original.brand,
        status: "DRAFT",
        inventory: original.inventory,
        featured: false,
        tags: original.tags,
        images: {
          create: original.images.map((img: any) => ({
            imageUrl: img.imageUrl,
            altText: img.altText,
            sortOrder: img.sortOrder,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("POST duplicate product error:", error);
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 });
  }
}
