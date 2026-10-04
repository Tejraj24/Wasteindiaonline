"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const slides = [
  {
    id: 1,
    title: "MODERN HERITAGE",
    subtitle: "COLLECTION 01",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "ELEVATED ESSENTIALS",
    subtitle: "SS26 LINEUP",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "REFINED VISION",
    subtitle: "EDITORIAL",
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
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-dark">
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
              <div className="absolute inset-0 bg-black/30 z-10" />
              <img
                ref={(el) => { imagesRef.current[i] = el; }}
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Text Content - Positioned Bottom Left */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 pb-16 md:pb-24 pointer-events-none">
                <div className="max-w-4xl">
                  <span className="text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6 block opacity-90 font-medium text-brand-light">
                    {slide.subtitle}
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-[90px] lg:text-[120px] leading-[0.9] font-bold tracking-tighter uppercase text-brand-light pointer-events-auto mix-blend-difference">
                    {slide.title}
                  </h2>

                  {/* CTA under heading */}
                  <a href="/shop" className="inline-block mt-8 md:mt-12 text-sm md:text-base font-bold uppercase tracking-widest text-brand-light border-b border-brand-light/50 pb-1 hover:border-brand-light transition-colors pointer-events-auto" data-cursor="EXPLORE">
                    EXPLORE COLLECTION
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls - Extreme Edges Middle */}
      <div className="absolute inset-0 z-30 pointer-events-none flex justify-between items-center px-6 md:px-12">
        {/* Left Side: Current Index */}
        <div className="pointer-events-auto flex items-center">
          <span className="font-serif italic text-2xl md:text-4xl text-brand-light opacity-90 select-none mix-blend-difference">
            0{activeIndex + 1}
          </span>
        </div>

        {/* Right Side: Next Button */}
        <div className="pointer-events-auto flex items-center">
          <button
            onClick={nextSlide}
            className="font-serif italic text-2xl md:text-4xl text-brand-light hover:opacity-70 transition-opacity mix-blend-difference"
            data-cursor="NEXT"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
