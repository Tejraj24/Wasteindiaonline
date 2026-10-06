"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WishlistButton } from "@/components/WishlistButton";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image1: string;
  image2: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: "p1",
    name: "Classic Heavyweight Tee",
    price: 65,
    image1: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790931088/download_12_lrb2in.jpg",
    image2: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790931132/%D1%81%D1%82%D1%80%D0%B0%D1%85_%D1%82%D1%80%D0%B8%D0%BF%D0%BE%D1%84%D0%BE%D0%B1%D1%96%D0%B2_%D0%B7%D0%B7%D0%B0%D0%B4%D1%83_pkkxqz.jpg",
    badge: "NEW",
  },
  {
    id: "p2",
    name: "Pleated Trousers",
    price: 185,
    image1: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790931525/Rustic_Viking_Leather_Tunic_Aesthetic_whtent.jpg",
    image2: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790931469/Redirecting____1_vgrr2e.jpg",
  },
  {
    id: "p3",
    name: "Oversized Wool Coat",
    price: 450,
    originalPrice: 500,
    image1: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790930845/download_11_hstv1u.jpg",
    image2: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790930801/download_10_talp7h.jpg",
    badge: "SALE",
  },
  {
    id: "p4",
    name: "Ribbed Beanie",
    price: 35,
    image1: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790930444/transeddiemunson_mksxvh.jpg",
    image2: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790929898/download_9_vk2wlo.jpg",
  },
];

export function ProductGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!gridRef.current) return;
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
  }, []);

  return (
    <section className="bg-brand-light px-4 py-16 text-brand-dark sm:py-20 md:px-8 md:py-24" ref={gridRef}>
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
        <h2 className="max-w-[15rem] text-[clamp(1.35rem,4vw,3rem)] font-bold uppercase leading-none tracking-tighter sm:max-w-none">( FEATURED PRODUCTS )</h2>
        <a href="/shop" className="body-upper hover:opacity-70 transition-opacity hidden md:block">
          VIEW ALL
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:gap-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="group relative flex flex-col"
          >
            <a
              href={`/product/${product.id}`}
              ref={(el) => { cardsRef.current[i] = el; }}
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
                  <h3 className="tracking-tight max-w-[70%] leading-tight">{product.name}</h3>
                  <div className="text-right flex flex-col">
                    <span>${product.price}</span>
                    {product.originalPrice && (
                      <span className="line-through text-white/60 text-xs">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex min-h-[4.5rem] flex-col justify-between gap-1 pt-3 sm:hidden">
                    <h3 className="line-clamp-2 text-[10px] font-bold uppercase leading-[1.25] tracking-[0.06em]">{product.name}</h3>
                    <div className="flex items-end justify-between gap-2 text-[10px] font-semibold">
                      <span>${product.price}</span>
                      {product.originalPrice && <span className="text-[9px] text-black/45 line-through">${product.originalPrice}</span>}
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.14em] text-black/55">Quick view</span>
                  </div>
                </div>
              </div>
              </div>
            </a>
            <div className="absolute right-3 top-3 z-20">
              <WishlistButton item={{ productId: product.id, name: product.name, slug: product.id, image: product.image1, price: product.price, category: "Featured" }} />
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
