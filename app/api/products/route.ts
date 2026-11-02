import { NextRequest, NextResponse } from "next/server";
import { getProducts, getCategories } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const categorySlug = searchParams.get("categorySlug") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined;
    const sort = (searchParams.get("sort") as any) || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const products = await getProducts({
      category,
      categorySlug,
      search,
      featured,
      sort,
      limit,
    });

    const categories = await getCategories();

    return NextResponse.json({
      products,
      categories,
      total: products.length,
    });
  } catch (error: any) {
    console.error("Storefront products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
