import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { getFeaturedProducts } from "@/lib/services/product.service";
import { getHomepageContent } from "@/lib/services/content.service";

export const revalidate = 0; // Dynamic homepage with live database featured items

export default async function Home() {
  const [featuredProducts, homepageContent] = await Promise.all([
    getFeaturedProducts(4),
    getHomepageContent(),
  ]);

  // Apply visual overrides for featured products on the homepage if configured by admin
  const resolvedFeaturedProducts = featuredProducts.map((p) => {
    const override = homepageContent.featuredOverrides[p.id];
    return {
      ...p,
      image1: override?.image1 || p.images[0] || "",
      image2: override?.image2 || p.images[1] || p.images[0] || "",
    };
  });

  return (
    <div className="w-full flex flex-col">
      <Hero slides={homepageContent.heroSlides} />
      <ProductGrid products={resolvedFeaturedProducts} />
      <Gallery items={homepageContent.carouselImages} />
      <Footer />
    </div>
  );
}
