import { Hero } from "@/components/Hero";
import { StackedProductCarousel } from "@/components/StackedProductCarousel";
import { CategorySection } from "@/components/CategorySection";
import { ProductGrid } from "@/components/ProductGrid";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { getFeaturedProducts, getCategories } from "@/lib/services/product.service";

export const revalidate = 0; // Dynamic homepage with live database featured items

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <div className="w-full flex flex-col bg-brand-bg text-brand-black">
      <Hero />
      <StackedProductCarousel products={featuredProducts} />
      <CategorySection categories={categories} />
      <ProductGrid products={featuredProducts.slice(0, 4)} />
      <Gallery />
      <Footer />
    </div>
  );
}
