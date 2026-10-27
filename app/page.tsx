import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.wasteluxe.in",
  },
};

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
      {/* Editorial Brand Narrative — Contemporary Indian Streetwear */}
      <section
        aria-label="About WASTE®"
        className="w-full border-t border-brand-border bg-brand-bg px-6 py-14 sm:py-16 md:px-12 md:py-20"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-border pb-8 sm:pb-10">
            <div className="max-w-2xl space-y-3">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-brand-gold font-medium">
                Modern Indian Culture &bull; Est. 2024
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[0.95] tracking-[-0.03em] uppercase text-brand-black">
                WASTE® &mdash; <span className="font-editorial italic text-brand-gold">Contemporary</span> Indian Streetwear
              </h1>
            </div>
            <div className="max-w-md space-y-4">
              <p className="text-xs sm:text-sm leading-relaxed text-brand-muted">
                Born in India and created for a generation that refuses to fit into a box. WASTE® crafts heavyweight garments, distinctive silhouettes, and raw aesthetics inspired by modern Indian streetwear culture.
              </p>
              <div>
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-brand-black hover:text-brand-gold transition-colors group"
                >
                  <span>Explore Our Story</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductGrid products={resolvedFeaturedProducts.slice(0, 4)} />
      <Gallery items={homepageContent.carouselImages} title="Luxe Art Work" />
      <Footer />
    </div>
  );
}
