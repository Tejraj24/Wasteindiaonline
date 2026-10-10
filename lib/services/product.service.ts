import prisma from "@/lib/prisma";

export interface StorefrontProduct {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  categoryId?: string | null;
  categorySlug?: string | null;
  brand: string;
  status: string;
  inventory: number;
  soldOut: boolean;
  featured: boolean;
  tags: string[];
  images: string[];
  sku: string;
  createdAt: Date;
}

export function formatStorefrontProduct(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  brand: string;
  status: string;
  inventory: number;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  images?: { imageUrl: string; sortOrder: number }[];
}): StorefrontProduct {
  const images = (product.images || [])
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.imageUrl);

  // Fallback placeholder image if none exists
  if (images.length === 0) {
    images.push(
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
    );
  }
  if (images.length === 1) {
    images.push(images[0]);
  }

  const categoryName = product.category?.name || "General";

  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    title: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    category: categoryName,
    categoryId: product.categoryId,
    categorySlug: product.category?.slug || null,
    brand: product.brand,
    status: product.status,
    inventory: product.inventory,
    soldOut: product.status !== "ACTIVE" || product.inventory <= 0,
    featured: product.featured,
    tags: product.tags,
    images,
    sku: `WST-${product.slug.toUpperCase().slice(0, 8)}`,
    createdAt: product.createdAt,
  };
}

export async function getProducts(params?: {
  category?: string;
  categorySlug?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  skip?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
}): Promise<StorefrontProduct[]> {
  try {
    const whereClause: any = {};

    if (params?.status) {
      whereClause.status = params.status;
    } else {
      whereClause.status = "ACTIVE";
    }

    if (params?.featured !== undefined) {
      whereClause.featured = params.featured;
    }

    if (params?.categorySlug) {
      whereClause.category = {
        slug: params.categorySlug,
      };
    } else if (params?.category && params.category !== "All") {
      whereClause.category = {
        name: {
          contains: params.category,
          mode: "insensitive",
        },
      };
    }

    if (params?.search && params.search.trim() !== "") {
      const q = params.search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (params?.sort === "price-asc") orderBy = { price: "asc" };
    if (params?.sort === "price-desc") orderBy = { price: "desc" };
    if (params?.sort === "featured") orderBy = [{ featured: "desc" }, { createdAt: "desc" }];

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy,
      take: params?.limit,
      skip: params?.skip,
    });

    return products.map(formatStorefrontProduct);
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return [];
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<StorefrontProduct[]> {
  try {
    let products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        featured: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // If fewer than limit featured products, backfill with most recent active products
    if (products.length < limit) {
      const additional = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          id: { notIn: products.map((p: any) => p.id) },
        },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit - products.length,
      });
      products = [...products, ...additional];
    }

    return products.map(formatStorefrontProduct);
  } catch (error) {
    console.error("Error fetching featured products from database:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<StorefrontProduct | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
        ],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) return null;
    return formatStorefrontProduct(product);
  } catch (error) {
    console.error(`Error fetching product by slug "${slug}":`, error);
    return null;
  }
}

export async function getProductsByCategory(
  categorySlugOrName: string,
  limit: number = 4,
  excludeId?: string
): Promise<StorefrontProduct[]> {
  try {
    const whereClause: any = {
      status: "ACTIVE",
      OR: [
        { category: { slug: categorySlugOrName } },
        { category: { name: { contains: categorySlugOrName, mode: "insensitive" } } },
      ],
    };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(formatStorefrontProduct);
  } catch (error) {
    console.error(`Error fetching products for category "${categorySlugOrName}":`, error);
    return [];
  }
}

export async function searchProducts(
  query: string,
  limit: number = 12
): Promise<StorefrontProduct[]> {
  if (!query || query.trim() === "") return [];
  return getProducts({ search: query, limit });
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { status: "ACTIVE" } } },
        },
      },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
