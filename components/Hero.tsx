"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);
  const isMounted = useRef(true);

  // Preload all hero images on mount so slides never flash blank
  useEffect(() => {
    isMounted.current = true;
    if (typeof window === "undefined") return;

    activeSlides.forEach((slide) => {
      const urls = [slide.image, slide.mobileImage].filter(Boolean) as string[];
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    });

    return () => {
      isMounted.current = false;
      if (activeTimeline.current) {
        activeTimeline.current.kill();
      }
    };
  }, [activeSlides]);

  // Helper to ensure an image is decoded and ready before fading in
  const ensureImageReady = (imgEl: HTMLImageElement | null): Promise<void> => {
    if (!imgEl || imgEl.complete) return Promise.resolve();
    return new Promise((resolve) => {
      const onDone = () => {
        imgEl.removeEventListener("load", onDone);
        imgEl.removeEventListener("error", onDone);
        resolve();
      };
      imgEl.addEventListener("load", onDone);
      imgEl.addEventListener("error", onDone);
      setTimeout(onDone, 600); // Safety timeout so transitions never block indefinitely
    });
  };

  const goToSlide = useCallback(
    async (newIndex: number) => {
      if (isAnimating.current || newIndex === activeIndex || !isMounted.current) return;
      isAnimating.current = true;

      const currentSlide = slidesRef.current[activeIndex];
      const currentImg = imagesRef.current[activeIndex];
      const nextSlide = slidesRef.current[newIndex];
      const nextImg = imagesRef.current[newIndex];

      if (!nextSlide || !currentSlide) {
        isAnimating.current = false;
        return;
      }

      // Pre-flight: make sure the next image is decoded
      await ensureImageReady(nextImg);
      if (!isMounted.current) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Bring incoming slide above current, initially invisible
      nextSlide.style.zIndex = "3";
      nextSlide.style.visibility = "visible";
      currentSlide.style.zIndex = "2";
      currentSlide.style.visibility = "visible";

      if (activeTimeline.current) {
        activeTimeline.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (!isMounted.current) return;
          setActiveIndex(newIndex);
          isAnimating.current = false;
          activeTimeline.current = null;

          // Re-index layers: new slide is active at z-2, previous goes to z-1 hidden
          slidesRef.current.forEach((el, i) => {
            if (el) {
              el.style.zIndex = i === newIndex ? "2" : "1";
              el.style.opacity = i === newIndex ? "1" : "0";
              el.style.visibility = i === newIndex ? "visible" : "hidden";
            }
          });

          if (nextImg) {
            gsap.set(nextImg, { scale: 1, clearProps: "transform" });
          }
          if (currentImg) {
            gsap.set(currentImg, { scale: 1, clearProps: "transform" });
          }
        },
      });

      activeTimeline.current = tl;

      if (prefersReducedMotion) {
        // Simple fast opacity dissolve without scale
        tl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, 0)
          .fromTo(currentSlide, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, 0);
      } else {
        // Seamless cross-dissolve: incoming image dissolves smoothly over 1.5s
        // with ease: "power2.inOut"
        tl.fromTo(
          nextSlide,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: "power2.inOut" },
          0
        );

        // Subtle cinematic zoom drift: incoming image settles from 1.025 to 1.00
        if (nextImg) {
          tl.fromTo(
            nextImg,
            { scale: 1.025 },
            { scale: 1.00, duration: 1.6, ease: "power2.out" },
            0
          );
        }

        // Outgoing slide dissolves smoothly after a brief overlap anchor, ensuring zero flash/darkening
        tl.fromTo(
          currentSlide,
          { opacity: 1 },
          { opacity: 0, duration: 1.4, ease: "power2.inOut" },
          0.15
        );

        // Outgoing image drifts from 1.00 to 1.015, giving continuous living depth
        if (currentImg) {
          tl.fromTo(
            currentImg,
            { scale: 1.00 },
            { scale: 1.015, duration: 1.5, ease: "power2.inOut" },
            0
          );
        }
      }
    },
    [activeIndex, isMounted]
  );

  const nextSlide = useCallback(() => {
    goToSlide((activeIndex + 1) % activeSlides.length);
  }, [activeIndex, activeSlides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeIndex - 1 + activeSlides.length) % activeSlides.length);
  }, [activeIndex, activeSlides.length, goToSlide]);

  // Autoplay intervals:
  // - Mobile: 4500ms
  // - Desktop: 4000ms
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const getSlideDuration = () => (mediaQuery.matches ? 4500 : 4000);

    let currentDuration = getSlideDuration();
    let timer = setInterval(() => {
      goToSlide((activeIndex + 1) % activeSlides.length);
    }, currentDuration);

    const handleResize = () => {
      const newDuration = getSlideDuration();
      if (newDuration !== currentDuration) {
        currentDuration = newDuration;
        clearInterval(timer);
        timer = setInterval(() => {
          goToSlide((activeIndex + 1) % activeSlides.length);
        }, newDuration);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleResize);
    } else {
      mediaQuery.addListener(handleResize);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleResize);
      } else {
        mediaQuery.removeListener(handleResize);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndex, activeSlides.length, goToSlide]);

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
        {activeSlides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { slidesRef.current[i] = el; }}
            className="absolute inset-0 w-full h-full will-change-[opacity]"
            style={{
              zIndex: i === activeIndex ? 2 : 1,
              opacity: i === activeIndex ? 1 : 0,
              visibility: i === activeIndex ? "visible" : "hidden",
            }}
          >
            <div className="relative w-full h-full overflow-hidden bg-brand-black">
              {/* Edge-to-edge Campaign Photograph filling the continuous rectangular hero */}
              {slide.mobileImage && slide.mobileImage !== slide.image ? (
                <picture className="absolute inset-0 h-full w-full">
                  <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                  <source media="(min-width: 768px)" srcSet={slide.image} />
                  <img
                    ref={(el) => { imagesRef.current[i] = el; }}
                    src={slide.image}
                    alt={slide.title}
                    loading="eager"
                    fetchPriority={i === 0 ? "high" : "low"}
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover hero-slide-img-${slide.id} will-change-transform origin-center`}
                  />
                </picture>
              ) : (
                <img
                  ref={(el) => { imagesRef.current[i] = el; }}
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "low"}
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover hero-slide-img-${slide.id} will-change-transform origin-center`}
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
          object-position: center 15%;
        }
        .hero-slide-img-2 {
          object-position: center 15%;
        }
        .hero-slide-img-3 {
          object-position: center 15%;
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
    </section>
  );
}
