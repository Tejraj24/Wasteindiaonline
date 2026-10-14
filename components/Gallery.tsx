"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

import { DEFAULT_CAROUSEL_ITEMS, CarouselSlideContent } from "@/lib/services/content.service";

interface GalleryProps {
  items?: CarouselSlideContent[];
}

export function Gallery({ items = DEFAULT_CAROUSEL_ITEMS }: GalleryProps) {
  const activeItems = items && items.length > 0 ? items : DEFAULT_CAROUSEL_ITEMS;
  const containerRef = useRef<HTMLDivElement>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    gsap.registerPlugin(Observer);

    const track = trackRef.current;
    const items = itemsRef.current.filter(Boolean);
    const itemWidth = items[0]?.offsetWidth || 300;
    const gap = 20; // 5rem in Tailwind usually 20px if custom, let's say 24px
    
    // We duplicate items for infinite wrap visual
    // Actually GSAP utils.wrap handles the translation value.
    // For a true infinite wrap, we need enough duplicated items or we wrap the position.
    
    // Simplification for draggable momentum with auto scroll
    let currentX = 0;
    let targetX = 0;
    let isDragging = false;
    let velocity = -1.0; // Auto scroll speed
    
    // The max distance we can scroll before wrapping (half the track if we duplicate)
    // To make it simple, let's just make it a bounds-based drag or a pseudo-wrap
    
    const update = () => {
      if (!isDragging) {
        targetX += velocity;
      }
      
      // Wrap logic (simplified bounds)
      // Assuming track is much wider than screen
      const maxScroll = -(track.scrollWidth - window.innerWidth);
      if (targetX > 0) targetX = 0; // Don't wrap positive for now
      if (targetX < maxScroll) targetX = maxScroll; // Don't wrap beyond max
      
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
      className="py-24 bg-brand-dark text-brand-light overflow-hidden cursor-grab active:cursor-grabbing"
      data-cursor="DRAG"
    >
      <div className="px-4 md:px-8 mb-12 flex justify-between items-end">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">
          ( ARCHIVE )
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
            className="relative w-[70vw] md:w-[35vw] aspect-[4/3] bg-neutral-800 flex-shrink-0 overflow-hidden transform-gpu"
          >
            <picture className="absolute inset-0 w-full h-full">
              {item.mobileImage && item.mobileImage !== item.image && (
                <source media="(max-width: 767px)" srcSet={item.mobileImage} />
              )}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                draggable={false}
              />
            </picture>
          </div>
        ))}
      </div>
    </section>
  );
}
