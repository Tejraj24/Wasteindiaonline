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
    const badge = p.badge || (p.compareAtPrice ? "SALE" : p.featured ? "FEATURED" : undefined);
    
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
    <section className="bg-brand-light px-4 py-16 text-brand-dark sm:py-20 md:px-8 md:py-24" ref={gridRef}>
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
        <h2 className="max-w-[15rem] text-[clamp(1.35rem,4vw,3rem)] font-bold uppercase leading-none tracking-tighter sm:max-w-none">
          ( FEATURED PRODUCTS )
        </h2>
        <a href="/shop" className="body-upper hover:opacity-70 transition-opacity hidden md:block">
          VIEW ALL
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:gap-3 lg:grid-cols-4">
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
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-brand-grey">
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10 bg-brand-blue text-white px-2 py-1 text-xs font-bold uppercase tracking-widest pointer-events-none">
                    {product.badge}
                  </div>
                )}
                {/* Primary Image */}
                <img
                  src={product.image1}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Hover / Secondary Image */}
                <img
                  src={product.image2}
                  alt={`${product.name} lifestyle`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                />
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                {/* Meta - Hidden by default, shown on hover */}
                <div className="absolute inset-0 hidden flex-col justify-between p-3 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 sm:flex sm:p-4">
                  <div />
                  <div className="flex justify-between items-start font-bold uppercase text-sm md:text-base text-white">
                    <h3 className="tracking-tight max-w-[70%] leading-tight">
                      {product.name}
                    </h3>
                    <div className="text-right flex flex-col">
                      <span>{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="line-through text-white/60 text-xs">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex min-h-[4.5rem] flex-col justify-between gap-1 pt-3 sm:hidden">
                <h3 className="line-clamp-2 text-[10px] font-bold uppercase leading-[1.25] tracking-[0.06em]">
                  {product.name}
                </h3>
                <div className="flex items-end justify-between gap-2 text-[10px] font-semibold">
                  <span>{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-[9px] text-black/45 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-[9px] uppercase tracking-[0.14em] text-black/55">
                  Quick view
                </span>
              </div>
            </a>
            <div className="absolute right-3 top-3 z-20">
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
        <a href="/shop" className="body-upper hover:opacity-70 transition-opacity">
          VIEW ALL PRODUCTS
        </a>
      </div>
    </section>
  );
}
