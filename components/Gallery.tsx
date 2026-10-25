"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

import { DEFAULT_CAROUSEL_ITEMS, CarouselSlideContent } from "@/lib/services/content.service";

interface GalleryProps {
  items?: CarouselSlideContent[];
  title?: string;
}

export function Gallery({
  items = DEFAULT_CAROUSEL_ITEMS,
  title = "Luxe Art Work",
}: GalleryProps) {
  const activeItems = items && items.length > 0 ? items : DEFAULT_CAROUSEL_ITEMS;
  const containerRef = useRef<HTMLDivElement>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    gsap.registerPlugin(Observer);

    const track = trackRef.current;
    const items = itemsRef.current.filter(Boolean);

    let currentX = 0;
    let targetX = 0;
    let isDragging = false;
    let velocity = -1.0; // Auto scroll speed

    const update = () => {
      if (!isDragging) {
        targetX += velocity;
      }

      const maxScroll = -(track.scrollWidth - window.innerWidth);
      if (targetX > 0) targetX = 0;
      if (targetX < maxScroll) targetX = maxScroll;

      currentX += (targetX - currentX) * 0.1;
      gsap.set(track, { x: currentX });
    };

    gsap.ticker.add(update);

    const obs = Observer.create({
      target: containerRef.current,
      type: "pointer,touch",
      onPress: () => {
        isDragging = true;
        gsap.to(items, { scale: 0.95, duration: 0.3, ease: "power2.out" });
      },
      onDrag: (e) => {
        targetX += e.deltaX;
      },
      onRelease: () => {
        isDragging = false;
        gsap.to(items, { scale: 1, duration: 0.3, ease: "power2.out" });
      },
    });

    return () => {
      gsap.ticker.remove(update);
      obs.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="py-24 bg-brand-bg text-brand-black border-t border-brand-border overflow-hidden cursor-grab active:cursor-grabbing"
      data-cursor="DRAG"
    >
      <div className="px-4 md:px-8 mb-12 flex justify-center items-center text-center">
        <h2 className="font-helvetica text-[clamp(1.5rem,3.8vw,2.75rem)] font-normal uppercase tracking-[0.15em] text-brand-black">
          {title}
        </h2>
      </div>

      {/* Track */}
      <div 
        ref={trackRef} 
        className="flex gap-6 px-4 md:px-8 w-max"
      >
        {[...activeItems, ...activeItems].map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            ref={(el) => { itemsRef.current[idx] = el; }}
            className="relative w-[70vw] md:w-[35vw] aspect-[4/3] bg-transparent flex-shrink-0 overflow-hidden transform-gpu"
          >
            {item.mobileImage && item.mobileImage !== item.image ? (
              <picture className="absolute inset-0 w-full h-full">
                <source media="(max-width: 767px)" srcSet={item.mobileImage} />
                <source media="(min-width: 768px)" srcSet={item.image} />
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-500 hover:scale-105"
                  draggable={false}
                />
              </picture>
            ) : (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-500 hover:scale-105"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
