import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/services/product.service";
import { ShopCatalogClient } from "./ShopCatalogClient";

export const revalidate = 0; // Always fetch fresh database catalog

export const metadata: Metadata = {
  title: "Shop Collection | WASTE",
  description: "Explore the latest curated collections, garments, and silhouettes by WASTE.",
  alternates: {
    canonical: "https://www.wasteluxe.in/shop",
  },
};

export default async function ShopPage() {
  const [products, rawCategories] = await Promise.all([
    getProducts({ status: "ACTIVE" }),
    getCategories(),
  ]);

  const categories = rawCategories
    .filter(
      (c: any) =>
        c.slug.toLowerCase() !== "headwear" &&
        c.slug.toLowerCase() !== "accessories" &&
        c.name.toLowerCase() !== "headwear" &&
        c.name.toLowerCase() !== "accessories"
    )
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
      <ShopCatalogClient
        initialProducts={products}
        categories={categories}
      />
    </Suspense>
  );
}
