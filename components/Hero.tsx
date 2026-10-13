"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

const slides = [
  {
    id: 1,
    title: "Refined curation",
    alt: "WASTE® streetwear model seated on bench in front of architectural storefront",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797220/Picsart_26-10-12_14-49-47-646_ic3wwd.png",
    objectPositionMobile: "70% 12%",
    objectPositionDesktop: "70% center",
  },
  {
    id: 2,
    title: "Quiet statement",
    alt: "WASTE® model seated in oversized graphic t-shirt and relaxed trousers",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797197/file_000000005ed48208abf35f02392a64b3.jpg_ibwmtc.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791881073/file_0000000073748211bf37ba309647258e.jpg_ajebtr.jpg",
    objectPositionMobile: "center 15%",
    objectPositionDesktop: "center 20%",
  },
  {
    id: 3,
    title: "Luxury essentials",
    alt: "WASTE® contemporary streetwear model editorial in dark coat",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797163/Picsart_26-10-12_14-31-46-544_q6xzik.png",
    objectPositionMobile: "60% 12%",
    objectPositionDesktop: "60% center",
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

    const isForwards =
      activeIndex === slides.length - 1 && newIndex === 0
        ? true
        : activeIndex === 0 && newIndex === slides.length - 1
        ? false
        : newIndex > activeIndex;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const parallaxPercent = isMobile ? 4 : 10;

    const tl = gsap.timeline({
      defaults: { duration: 1.0, ease: "power4.inOut" },
      onComplete: () => {
        setActiveIndex(newIndex);
        isAnimating.current = false;
        slidesRef.current.forEach((el, i) => {
          if (el) el.style.zIndex = i === newIndex ? "2" : "1";
        });
        if (nextImg) {
          gsap.set(nextImg, { clearProps: "transform,yPercent,y" });
        }
        if (currentImg) {
          gsap.set(currentImg, { clearProps: "transform,yPercent,y" });
        }
      },
    });

    if (nextSlide && currentSlide && nextImg && currentImg) {
      nextSlide.style.zIndex = "3";

      if (isForwards) {
        tl.fromTo(
          nextSlide,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          0
        )
          .fromTo(
            currentSlide,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            0
          )
          .fromTo(currentImg, { yPercent: 0 }, { yPercent: parallaxPercent }, 0)
          .fromTo(nextImg, { yPercent: -parallaxPercent }, { yPercent: 0 }, 0);
      } else {
        tl.fromTo(
          nextSlide,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          0
        )
          .fromTo(
            currentSlide,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
            0
          )
          .fromTo(currentImg, { yPercent: 0 }, { yPercent: -parallaxPercent }, 0)
          .fromTo(nextImg, { yPercent: parallaxPercent }, { yPercent: 0 }, 0);
      }
    }
  };

  const nextSlide = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((activeIndex - 1 + slides.length) % slides.length);
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="WASTE Editorial Campaign"
      className="relative w-full h-[100svh] min-h-[560px] md:min-h-[700px] overflow-hidden select-none bg-brand-black"
    >
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full">
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
            <div className="relative w-full h-full overflow-hidden bg-brand-black">
              {/* Edge-to-edge Campaign Photograph filling the continuous rectangular hero */}
              {slide.mobileImage ? (
                <picture className="absolute inset-0 h-full w-full">
                  <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                  <source media="(min-width: 768px)" srcSet={slide.image} />
                  <img
                    ref={(el) => { imagesRef.current[i] = el; }}
                    src={slide.image}
                    alt={slide.alt || slide.title}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover hero-slide-img-${slide.id}`}
                  />
                </picture>
              ) : (
                <img
                  ref={(el) => { imagesRef.current[i] = el; }}
                  src={slide.image}
                  alt={slide.alt || slide.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover hero-slide-img-${slide.id}`}
                />
              )}

              {/* Minimal atmospheric gradient at the base for contrast */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 md:h-44 z-10 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Scoped CSS for responsive object-position across breakpoints */}
      <style jsx>{`
        .hero-slide-img-1 {
          object-position: 70% 12%;
        }
        .hero-slide-img-2 {
          object-position: center 15%;
        }
        .hero-slide-img-3 {
          object-position: 60% 12%;
        }
        @media (min-width: 768px) {
          .hero-slide-img-1 {
            object-position: 70% center;
          }
          .hero-slide-img-2 {
            object-position: center 20%;
          }
          .hero-slide-img-3 {
            object-position: 60% center;
          }
        }
      `}</style>

      {/* Restrained Luxury Navigation Controls (VASAAE inspired: minimal, elegant, accessible) */}
      <div className="absolute bottom-4 right-4 z-30 sm:bottom-6 sm:right-6 md:bottom-8 md:right-12">
        <div className="pointer-events-auto inline-flex items-center gap-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-none shadow-sm">
          <button
            type="button"
            onClick={prevSlide}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-white/75 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
            data-cursor="PREV"
            aria-label="Previous campaign slide"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-white/20 text-[10px] select-none" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={nextSlide}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-white/75 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
            data-cursor="NEXT"
            aria-label="Next campaign slide"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
