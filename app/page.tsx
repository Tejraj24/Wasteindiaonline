import { Hero } from "@/components/Hero";
import { StackedProductCarousel } from "@/components/StackedProductCarousel";
import { CategorySection } from "@/components/CategorySection";
import { ProductGrid } from "@/components/ProductGrid";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { getFeaturedProducts, getCategories } from "@/lib/services/product.service";
import { getHomepageContent } from "@/lib/services/content.service";

export const revalidate = 0; // Dynamic homepage with live database featured items

export default async function Home() {
  const [featuredProducts, categories, homepageContent] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getHomepageContent(),
  ]);

  // Apply visual overrides for 3D lookbook carousel and featured products
  const resolvedFeaturedProducts = featuredProducts.map((p, idx) => {
    const override =
      homepageContent.featuredOverrides[p.id] ||
      homepageContent.featuredOverrides[`slot-${idx + 1}`];

    return {
      ...p,
      image1: override?.image1 || p.images[0] || "",
      image2: override?.image2 || p.images[1] || p.images[0] || "",
      carouselOverride1: override?.image1,
      carouselOverride2: override?.image2,
      adminProductOverride1: override?.image1,
      adminProductOverride2: override?.image2,
    };
  });

  return (
    <div className="w-full flex flex-col bg-brand-bg text-brand-black">
      <Hero slides={homepageContent.heroSlides} />
      <StackedProductCarousel
        products={resolvedFeaturedProducts}
        overrides={homepageContent.featuredOverrides}
        silhouettes={homepageContent.carouselImages}
      />
      <CategorySection categories={categories} />
      <ProductGrid products={resolvedFeaturedProducts.slice(0, 4)} />
      <Gallery items={homepageContent.carouselImages} />
      <Footer />
    </div>
  );
}
