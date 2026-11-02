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

    let currentX = 0;
    let targetX = 0;
    let isDragging = false;
    let isInitialized = false;
    const velocity = -1.0; // Auto scroll speed (continuous luxury editorial crawl)

    const getSetWidth = () => {
      const first = itemsRef.current[0];
      const duplicate = itemsRef.current[activeItems.length];
      if (first && duplicate && duplicate.offsetLeft > first.offsetLeft) {
        return duplicate.offsetLeft - first.offsetLeft;
      }
      if (track.scrollWidth > 0) {
        return track.scrollWidth / 4;
      }
      return 0;
    };

    const update = () => {
      const setWidth = getSetWidth();

      // Initialize position to Set 1 buffer so drag and scroll work in both directions
      if (!isInitialized && setWidth > 0) {
        currentX = -setWidth;
        targetX = -setWidth;
        gsap.set(track, { x: currentX });
        isInitialized = true;
      }

      if (!isDragging) {
        targetX += velocity;
      }

      // Infinite loop wrap-around: seamlessly cycle without ever halting at the end
      if (setWidth > 0) {
        while (targetX <= -2 * setWidth) {
          targetX += setWidth;
          currentX += setWidth;
        }
        while (targetX >= -setWidth) {
          targetX -= setWidth;
          currentX -= setWidth;
        }
      }

      currentX += (targetX - currentX) * 0.1;
      gsap.set(track, { x: currentX });
    };

    gsap.ticker.add(update);

    const obs = Observer.create({
      target: containerRef.current,
      type: "pointer,touch",
      onPress: () => {
        isDragging = true;
        const validItems = itemsRef.current.filter(Boolean);
        gsap.to(validItems, { scale: 0.96, duration: 0.25, ease: "power2.out" });
      },
      onDrag: (e) => {
        targetX += e.deltaX;
      },
      onRelease: () => {
        isDragging = false;
        const validItems = itemsRef.current.filter(Boolean);
        gsap.to(validItems, { scale: 1, duration: 0.25, ease: "power2.out" });
      },
    });

    return () => {
      gsap.ticker.remove(update);
      obs.kill();
    };
  }, [activeItems]);

  // Duplicate items 4 times to create an infinite, seamless loop ribbon
  const repeatedItems = [
    ...activeItems,
    ...activeItems,
    ...activeItems,
    ...activeItems,
  ];

  return (
    <section 
      ref={containerRef} 
      className="py-24 bg-brand-bg text-brand-black border-t border-brand-border overflow-hidden cursor-grab active:cursor-grabbing select-none"
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
        className="flex gap-6 px-4 md:px-8 w-max will-change-transform"
      >
        {repeatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            ref={(el) => { itemsRef.current[idx] = el; }}
            className="relative w-[70vw] md:w-[35vw] aspect-[4/3] bg-transparent flex-shrink-0 overflow-hidden transform-gpu select-none"
          >
            {item.mobileImage && item.mobileImage !== item.image ? (
              <picture className="absolute inset-0 w-full h-full pointer-events-none">
                <source media="(max-width: 767px)" srcSet={item.mobileImage} />
                <source media="(min-width: 768px)" srcSet={item.image} />
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-500 hover:scale-105 pointer-events-none select-none"
                  draggable={false}
                />
              </picture>
            ) : (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-500 hover:scale-105 pointer-events-none select-none"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
