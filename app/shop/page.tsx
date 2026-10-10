import { getProducts, getCategories } from "@/lib/services/product.service";
import { ShopCatalogClient } from "./ShopCatalogClient";

export const revalidate = 0; // Always fetch fresh database catalog

export const metadata = {
  title: "Shop Collection | WASTE.",
  description: "Explore the latest curated collections, garments, and accessories by WASTE.",
};

export default async function ShopPage() {
  const [products, rawCategories] = await Promise.all([
    getProducts({ status: "ACTIVE" }),
    getCategories(),
  ]);

  const categories = rawCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <ShopCatalogClient
      initialProducts={products}
      categories={categories}
    />
  );
}
