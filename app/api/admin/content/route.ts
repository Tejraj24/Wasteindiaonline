import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth/admin";
import {
  getHomepageContent,
  updateHomepageContent,
  HomepageContentConfig,
} from "@/lib/services/content.service";
import { getFeaturedProducts } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdminAuth(req);

    const config = await getHomepageContent();
    const featuredProducts = await getFeaturedProducts(4);

    return NextResponse.json({
      success: true,
      config,
      featuredProducts: featuredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image1: p.images[0] || "",
        image2: p.images[1] || p.images[0] || "",
        category: p.category,
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
    const { heroSlides, featuredOverrides, carouselImages } = body;

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

    const payload: Partial<HomepageContentConfig> = {};
    if (heroSlides) payload.heroSlides = heroSlides;
    if (featuredOverrides) payload.featuredOverrides = featuredOverrides;
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
