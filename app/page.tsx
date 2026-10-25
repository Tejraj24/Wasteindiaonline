import { Hero } from "@/components/Hero";
import { StackedProductCarousel } from "@/components/StackedProductCarousel";
import { CategorySection } from "@/components/CategorySection";
import { ObjectsOfExpressionHero } from "@/components/ObjectsOfExpressionHero";
import { EditorialCollectionSection } from "@/components/EditorialCollectionSection";
import { ProductGrid } from "@/components/ProductGrid";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { getFeaturedProducts, getCarouselProducts, getCategories } from "@/lib/services/product.service";
import { getHomepageContent } from "@/lib/services/content.service";

export const revalidate = 0; // Dynamic homepage with live database featured items

export default async function Home() {
  const homepageContent = await getHomepageContent();
  const explicitCarouselIds = (homepageContent.featuredOverrides as any)?._carouselProductIds;

  const [featuredProducts, categories] = await Promise.all([
    getCarouselProducts(explicitCarouselIds, 8),
    getCategories(),
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
        title="Street Articles"
      />
      {/* Temporarily commented out for full-width image replacement
      <CategorySection categories={categories} />
      */}
      {/* Objects of Expression — Editorial Streetwear Hero Showcase */}
      <ObjectsOfExpressionHero />
      {/* Editorial Collection Showcase — Drop 02 */}
      <EditorialCollectionSection />
      <ProductGrid products={resolvedFeaturedProducts.slice(0, 4)} />
      <Gallery items={homepageContent.carouselImages} title="Luxe Art Work" />
      <Footer />
    </div>
  );
}
