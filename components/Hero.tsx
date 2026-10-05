"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const slides = [
  {
    id: 1,
    title: "Luxury essentials",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "Quiet statement",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "Refined curation",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/w_1600,h_900,c_fill,q_80/v1790917475/WhatsApp_Image_2026-10-01_at_11.16.34_PM_kp2k1z.jpg",
  },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const isAnimating = useRef(false);

  const goToSlide = (newIndex: number) => {
    if (isAnimating.current || newIndex === activeIndex) return;
    isAnimating.current = true;

    const currentSlide = slidesRef.current[activeIndex];
    const currentImg = imagesRef.current[activeIndex];
    const nextSlide = slidesRef.current[newIndex];
    const nextImg = imagesRef.current[newIndex];

    const isForwards = newIndex > activeIndex;

    const tl = gsap.timeline({
      defaults: { duration: 1.0, ease: "power4.inOut" },
      onComplete: () => {
        setActiveIndex(newIndex);
        isAnimating.current = false;
        // Reset z-index
        slidesRef.current.forEach((el, i) => {
          if (el) el.style.zIndex = i === newIndex ? "2" : "1";
        });
      },
    });

    if (nextSlide && currentSlide && nextImg && currentImg) {
      nextSlide.style.zIndex = "3";

      if (isForwards) {
        // Next item wiping down from top
        tl.fromTo(
          nextSlide,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
        )
          // Current item wiping down to bottom
          .fromTo(
            currentSlide,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            "<"
          )
          // Parallax
          .fromTo(currentImg, { yPercent: 0 }, { yPercent: 10 }, "<")
          .fromTo(nextImg, { yPercent: -10 }, { yPercent: 0 }, "<");
      } else {
        // Backwards transition
        tl.fromTo(
          nextSlide,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
        )
          // Current item remains static as next slide uncovers it, or wipe it to top
          .fromTo(
            currentSlide,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
            "<"
          )
          // Parallax
          .fromTo(currentImg, { yPercent: 0 }, { yPercent: -10 }, "<")
          .fromTo(nextImg, { yPercent: 10 }, { yPercent: 0 }, "<");
      }
    }
  };

  const nextSlide = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((activeIndex - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] md:min-h-[700px] overflow-hidden bg-brand-dark">
      {/* Slides Container */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { slidesRef.current[i] = el; }}
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex: i === activeIndex ? 2 : 1,
              clipPath: i === activeIndex ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
            }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 z-10" />
              <img
                ref={(el) => { imagesRef.current[i] = el; }}
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4 pb-16 sm:p-6 md:p-12 md:pb-24">
                <div className="max-w-xl editorial-reveal">
                  <div className="mb-4 flex items-end justify-between gap-4 text-brand-light/90 sm:mb-5 sm:gap-6">
                    <span className="font-editorial text-[clamp(2.6rem,5vw,5rem)] leading-[0.84] tracking-[-0.045em]">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.62rem] font-light uppercase tracking-[0.5em] opacity-65 md:text-[0.7rem]">
                      01 / 03
                    </span>
                  </div>

                  <a
                    href="/shop"
                    className="pointer-events-auto inline-block text-[clamp(2rem,4.6vw,5rem)] font-light uppercase leading-[0.86] tracking-[0.055em] text-brand-light transition-opacity duration-300 hover:opacity-80"
                    data-cursor="SHOP NOW"
                  >
                    SHOP NOW
                  </a>

                  <div className="mt-3 flex flex-col gap-1 text-brand-light">
                    <span className="text-[0.62rem] font-light uppercase tracking-[0.48em] text-brand-light/70 md:text-[0.72rem]">
                      EXPLORE OUR FIRST
                    </span>
                    <span className="font-editorial text-[clamp(2.75rem,10vw,7rem)] leading-[0.72] tracking-[-0.065em] text-brand-light">
                      COLLECTION
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none flex justify-end items-end px-6 md:px-12 pb-8 md:pb-10">
        <div className="pointer-events-auto flex items-center gap-2 text-brand-light/80">
          <button
            onClick={nextSlide}
            className="text-[0.7rem] md:text-[0.75rem] uppercase tracking-[0.3em] font-medium hover:opacity-70 transition-opacity"
            data-cursor="NEXT"
          >
            NEXT
          </button>
        </div>
      </div>
    </section>
  );
}
