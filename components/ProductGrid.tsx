"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WishlistButton } from "@/components/WishlistButton";
import { StorefrontProduct } from "@/lib/services/product.service";

export interface GridProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image1: string;
  image2: string;
  badge?: string;
  category?: string;
}

interface ProductGridProps {
  products?: StorefrontProduct[] | GridProductItem[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductGrid({ products = [] }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Normalize incoming products whether they are StorefrontProduct or GridProductItem
  const normalizedProducts: GridProductItem[] = products.map((p: any) => {
    const img1 = p.image1 || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80";
    const img2 = p.image2 || (p.images && p.images[1]) || img1;
    const badge = p.badge || (p.isPreorder ? "PRE-ORDER" : p.compareAtPrice ? "SALE" : p.featured ? "FEATURED" : undefined);
    
    return {
      id: p.id,
      slug: p.slug || p.id,
      name: p.name || p.title || "Product",
      price: p.price,
      originalPrice: p.compareAtPrice || p.originalPrice || null,
      image1: img1,
      image2: img2,
      badge,
      category: p.category || "Collection",
    };
  });

  useEffect(() => {
    if (!gridRef.current || normalizedProducts.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current.filter(Boolean);

    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );
  }, [normalizedProducts.length]);

  if (normalizedProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-bg px-4 py-16 text-brand-black border-t border-brand-border sm:py-20 md:px-8 md:py-24" ref={gridRef}>
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
        <h2 className="font-tenor text-[clamp(1.25rem,3.2vw,2.25rem)] font-normal uppercase tracking-[0.15em] text-brand-black">
          FEATURED PRODUCTS
        </h2>
        <a href="/shop" className="body-upper text-brand-muted hover:text-brand-black transition-opacity hidden md:block">
          VIEW ALL â†’
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6">
        {normalizedProducts.map((product, i) => (
          <div key={product.id} className="group relative flex flex-col">
            <a
              href={`/product/${product.slug}`}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="flex flex-col"
              data-cursor="VIEW"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none border border-brand-border bg-brand-surfaceSubtle shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                {product.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10 bg-brand-black text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest pointer-events-none sm:top-3 sm:left-3 sm:text-[9px]">
                    {product.badge}
                  </div>
                )}
                {/* Primary Image */}
                <img
                  src={product.image1}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                {/* Hover / Secondary Image */}
                <img
                  src={product.image2}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                />
                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                {/* Quick View Tag on Desktop Hover */}
                <div className="absolute inset-x-0 bottom-0 hidden p-3 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                  <span className="inline-block border border-white/80 bg-brand-black/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    View piece
                  </span>
                </div>
              </div>

              {/* Product Information - Always visible by default on desktop and mobile */}
              <div className="flex flex-col pt-3 sm:pt-4">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-[11px] font-bold uppercase leading-[1.3] tracking-[0.07em] text-brand-black transition-colors duration-200 group-hover:text-brand-muted sm:text-xs md:text-sm">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-brand-muted sm:text-[10px]">
                      {product.category}
                    </p>
                  </div>
                  <div className="shrink-0 text-right font-mono text-xs font-semibold text-brand-black sm:text-sm">
                    <div>{formatPrice(product.price)}</div>
                    {product.originalPrice && (
                      <div className="mt-0.5 text-[9px] font-normal text-brand-muted line-through sm:text-[10px]">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.16em] text-brand-muted sm:mt-2.5 sm:text-[10px]">
                  <span>Explore</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">â†’</span>
                </div>
              </div>
            </a>
            <div className="absolute right-2.5 top-2.5 z-20 sm:right-3 sm:top-3">
              <WishlistButton
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  image: product.image1,
                  price: product.price,
                  category: product.category || "Featured",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center md:hidden">
        <a href="/shop" className="body-upper text-brand-muted hover:text-brand-black transition-opacity">
          VIEW ALL PRODUCTS â†’
        </a>
      </div>
    </section>
  );
}
