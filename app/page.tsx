import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { getFeaturedProducts } from "@/lib/services/product.service";

export const revalidate = 0; // Dynamic homepage with live database featured items

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <div className="w-full flex flex-col">
      <Hero />
      <ProductGrid products={featuredProducts} />
      <Gallery />
      <Footer />
    </div>
  );
}
