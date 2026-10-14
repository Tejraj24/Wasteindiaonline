"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { DEFAULT_HERO_SLIDES, HeroSlideContent } from "@/lib/services/content.service";

interface HeroProps {
  slides?: HeroSlideContent[];
}

export function Hero({ slides = DEFAULT_HERO_SLIDES }: HeroProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;

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
    goToSlide((activeIndex + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    goToSlide((activeIndex - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] md:min-h-[700px] overflow-hidden bg-brand-dark">
      {/* Slides Container */}
      <div className="absolute inset-0">
        {activeSlides.map((slide, i) => (
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
              <picture className="absolute inset-0 w-full h-full">
                {slide.mobileImage && slide.mobileImage !== slide.image && (
                  <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                )}
                <img
                  ref={(el) => { imagesRef.current[i] = el; }}
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </picture>

              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4 pb-16 sm:p-6 md:p-12 md:pb-24">
                <div className="max-w-xl editorial-reveal">
                  <div className="mb-4 flex items-end justify-between gap-4 text-brand-light/90 sm:mb-5 sm:gap-6">
                    <span className="font-editorial text-[clamp(2.6rem,5vw,5rem)] leading-[0.84] tracking-[-0.045em]">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.62rem] font-light uppercase tracking-[0.5em] opacity-65 md:text-[0.7rem]">
                      01 / {String(activeSlides.length).padStart(2, "0")}
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
