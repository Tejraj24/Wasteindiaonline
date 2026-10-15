"use client";

import Link from "next/link";
import { StorefrontProduct } from "@/lib/services/product.service";

// Verified fallback products with real Cloudinary catalogue cutouts
const FALLBACK_PRODUCTS: Partial<StorefrontProduct>[] = [
  {
    id: "prod-002",
    slug: "prod-002",
    name: "Heritage Crewneck Sweatshirt",
    title: "Heritage Crewneck Sweatshirt — Burgundy",
    price: 1400,
    category: "Sweatshirts",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933538/Waste_Black_Hoodie3_wxexba.png",
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933543/Waste_Black_Hoodie4_kstrvf.png",
    ],
  },
  {
    id: "prod-006",
    slug: "prod-006",
    name: "Reflections Graphic Tee",
    title: "Reflections Heavyweight Graphic Tee — Black",
    price: 750,
    category: "T-Shirts",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791935751/Waste_Black_Art_Tee6_gbwlst.png",
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791935738/Waste_Black_Art_Tee5_uixmnj.png",
    ],
  },
  {
    id: "prod-007",
    slug: "prod-007",
    name: "Art of Her Graphic Tee",
    title: "Minimal Wordmark T-Shirt — Stone Ash",
    price: 700,
    category: "T-Shirts",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934533/White_Art_of_Her5_o0r0zg.png",
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934534/White_Art_of_Her6_fuunrf.png",
    ],
  },
  {
    id: "prod-008",
    slug: "prod-008",
    name: "Minimal Wordmark Tee",
    title: "Minimal Wordmark T-Shirt — Chalk White",
    price: 700,
    category: "T-Shirts",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791936267/Waste_White_Tshirt5_xfhozt.png",
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791941164/Waste_White_Tshirt2_1_2_yk3bos.png",
    ],
  },
  {
    id: "prod-hoodie-1",
    slug: "prod-002",
    name: "Signature Heavyweight Hoodie",
    title: "Signature Heavyweight Hoodie — Pitch Black",
    price: 1800,
    category: "Hoodies",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933528/Waste_Black_Hoodie1_uzcz8v.png",
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933532/Waste_Black_Hoodie2_fvgpja.png",
    ],
  },
  {
    id: "prod-denim-1",
    slug: "prod-004",
    name: "Architectural Wide-Leg Denim",
    title: "Architectural Wide-Leg Denim — Indigo",
    price: 1650,
    category: "Trousers",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934989/waste-jeans_gpvjh6.jpg",
    ],
  },
];

interface ProductCollectionStripProps {
  products?: StorefrontProduct[];
}

export function ProductCollectionStrip({ products = [] }: ProductCollectionStripProps) {
  // Use actual catalogue items, backfilling if fewer than 6 to ensure smooth infinite ribbon
  const rawList = products.length >= 4 ? products : (products.concat(FALLBACK_PRODUCTS as StorefrontProduct[]));
  const displayProducts = rawList.slice(0, 10);

  return (
    <section
      aria-label="Continuous Product Archive Strip"
      className="relative w-full border-t border-brand-border bg-brand-bg py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      {/* Header Context Bar */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 mb-10 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border pb-4 sm:pb-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-gold block mb-2">
              RUNWAY ARCHIVE // 2024 DROP
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl uppercase tracking-[-0.03em] text-brand-black">
              Featured Silhouettes
            </h2>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.24em] font-mono text-brand-muted hover:text-brand-black transition-colors"
          >
            <span>Explore Collection</span>
            <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Moving Ribbon Track Wrapper */}
      <div className="relative w-full overflow-hidden group">
        {/* Soft Edge Fade Mask (Subtle Editorial Polish) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-brand-bg to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-brand-bg to-transparent" />

        {/* Continuous Ticker */}
        <div
          className="flex w-max animate-ticker hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto"
          style={{ animationDuration: "50s" }}
        >
          {/* Primary Interactive Track */}
          <div className="flex items-center gap-6 sm:gap-8 md:gap-12 pl-4 sm:pl-6">
            {displayProducts.map((product, idx) => {
              const image =
                (product as any).image1 ||
                (product as any).carouselOverride1 ||
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80";

              return (
                <Link
                  key={`primary-${product.id || idx}-${idx}`}
                  href={`/product/${product.slug || product.id}`}
                  className="group/card flex flex-col items-center w-36 sm:w-44 md:w-52 shrink-0 transition-transform duration-300 hover:-translate-y-1 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-brand-black"
                >
                  {/* Clean Ivory Cutout Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-brand-border bg-brand-surface p-4 transition-colors duration-300 group-hover/card:border-brand-black/40 group-hover/card:bg-brand-surfaceSubtle">
                    <img
                      src={image}
                      alt={product.title || product.name || "WASTE product"}
                      className="h-full w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:scale-105"
                      loading="eager"
                      decoding="async"
                    />

                    {/* Subtle Category Badge on Hover */}
                    <span className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-brand-muted/70 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                      {product.category || "WASTE"}
                    </span>
                  </div>

                  {/* Restrained Caption Below */}
                  <div className="mt-3 w-full text-center">
                    <p className="truncate font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.1em] text-brand-black transition-colors group-hover/card:text-brand-gold">
                      {product.name || product.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-brand-muted">
                      ₹{product.price?.toLocaleString("en-IN") || "—"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Secondary Duplicate Track (For Seamless Loop, tabIndex={-1} for Accessible Focus) */}
          <div
            aria-hidden="true"
            className="flex items-center gap-6 sm:gap-8 md:gap-12 pl-6 sm:pl-8 md:pl-12"
          >
            {displayProducts.map((product, idx) => {
              const image =
                (product as any).image1 ||
                (product as any).carouselOverride1 ||
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80";

              return (
                <Link
                  key={`duplicate-${product.id || idx}-${idx}`}
                  href={`/product/${product.slug || product.id}`}
                  tabIndex={-1}
                  className="group/card flex flex-col items-center w-36 sm:w-44 md:w-52 shrink-0 transition-transform duration-300 hover:-translate-y-1 focus:outline-hidden"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-brand-border bg-brand-surface p-4 transition-colors duration-300 group-hover/card:border-brand-black/40 group-hover/card:bg-brand-surfaceSubtle">
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:scale-105"
                      loading="eager"
                      decoding="async"
                    />

                    <span className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-brand-muted/70 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                      {product.category || "WASTE"}
                    </span>
                  </div>

                  <div className="mt-3 w-full text-center">
                    <p className="truncate font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.1em] text-brand-black transition-colors group-hover/card:text-brand-gold">
                      {product.name || product.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-brand-muted">
                      ₹{product.price?.toLocaleString("en-IN") || "—"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
