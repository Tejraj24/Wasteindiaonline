import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/admin";
import {
  getHomepageContent,
  updateHomepageContent,
  HomepageContentConfig,
} from "@/lib/services/content.service";
import { getCarouselProducts } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdminAuth(req);

    const config = await getHomepageContent();
    const explicitIds = (config.featuredOverrides as any)?._carouselProductIds;
    const featuredProducts = await getCarouselProducts(explicitIds, 12);

    return NextResponse.json({
      success: true,
      config,
      carouselProductIds: explicitIds || featuredProducts.map((p) => p.id),
      featuredProducts: featuredProducts.map((p, idx) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        sku: p.sku,
        category: p.category,
        slotNumber: idx + 1,
        slotId: `slot-${idx + 1}`,
        image1: p.images[0] || "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791887490/file_000000006cb88208b63fe025ad85bfcc_zham6r.png",
        image2: p.images[1] || p.images[0] || "",
      })),
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }
    console.error("GET /api/admin/content error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdminAuth(req);

    const body = await req.json();
    const { heroSlides, featuredOverrides, carouselImages, carouselProductIds } = body;

    // Validate heroSlides
    if (heroSlides && !Array.isArray(heroSlides)) {
      return NextResponse.json({ error: "heroSlides must be an array" }, { status: 400 });
    }

    if (heroSlides) {
      for (const slide of heroSlides) {
        if (!slide.image || typeof slide.image !== "string" || !slide.image.startsWith("http")) {
          return NextResponse.json(
            { error: `Invalid desktop image URL for slide: ${slide.title || slide.id}` },
            { status: 400 }
          );
        }
        if (slide.mobileImage && (!slide.mobileImage.startsWith("http") || typeof slide.mobileImage !== "string")) {
          return NextResponse.json(
            { error: `Invalid mobile image URL for slide: ${slide.title || slide.id}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate carouselImages
    if (carouselImages && !Array.isArray(carouselImages)) {
      return NextResponse.json({ error: "carouselImages must be an array" }, { status: 400 });
    }

    if (carouselImages) {
      for (const item of carouselImages) {
        if (!item.image || typeof item.image !== "string" || !item.image.startsWith("http")) {
          return NextResponse.json(
            { error: `Invalid image URL for carousel item: ${item.title || item.id}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate featuredOverrides
    if (featuredOverrides && (typeof featuredOverrides !== "object" || Array.isArray(featuredOverrides))) {
      return NextResponse.json({ error: "featuredOverrides must be an object" }, { status: 400 });
    }

    // Validate carouselProductIds
    if (carouselProductIds && !Array.isArray(carouselProductIds)) {
      return NextResponse.json({ error: "carouselProductIds must be an array of product IDs" }, { status: 400 });
    }

    const mergedOverrides = { ...(featuredOverrides || {}) };
    if (Array.isArray(carouselProductIds)) {
      mergedOverrides._carouselProductIds = carouselProductIds;

      // Keep catalog product featured status aligned
      try {
        await prisma.product.updateMany({
          where: { id: { in: carouselProductIds } },
          data: { featured: true },
        });
      } catch (dbSyncErr) {
        console.warn("[PUT /api/admin/content] Product featured status sync warning:", dbSyncErr);
      }
    }

    const payload: Partial<HomepageContentConfig> = {};
    if (heroSlides) payload.heroSlides = heroSlides;
    payload.featuredOverrides = mergedOverrides;
    if (carouselImages) payload.carouselImages = carouselImages;

    const updatedConfig = await updateHomepageContent(payload);

    // Invalidate homepage cache to instantly reflect updates on storefront
    revalidatePath("/");
    revalidatePath("/admin/content");

    return NextResponse.json({
      success: true,
      config: updatedConfig,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }
    console.error("PUT /api/admin/content error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
