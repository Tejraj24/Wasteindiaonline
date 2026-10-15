"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StorefrontProduct } from "@/lib/services/product.service";
import { WishlistButton } from "@/components/WishlistButton";
import { DEFAULT_CAROUSEL_ITEMS, CarouselSlideContent } from "@/lib/services/content.service";

interface StackedProductCarouselProps {
  products: (StorefrontProduct & {
    image1?: string;
    image2?: string;
    carouselOverride1?: string;
    carouselOverride2?: string;
    adminProductOverride1?: string;
    adminProductOverride2?: string;
  })[];
  title?: string;
  tagline?: string;
  overrides?: Record<string, { image1?: string; image2?: string }>;
  silhouettes?: CarouselSlideContent[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function StackedProductCarousel({
  products = [],
  title = "FEATURED SILHOUETTES",
  tagline = "2024 DROP // THE 3D LOOKBOOK",
  overrides,
  silhouettes,
}: StackedProductCarouselProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(1200);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Touch tracking for swipe navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const total = products.length;

  // Track document visibility to pause autoplay when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Responsive breakpoints detection
  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
    };

    const mediaQueryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQueryMotion.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    mediaQueryMotion.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      mediaQueryMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const isNarrowMobile = screenWidth < 360; // e.g. 312px Galaxy Fold
  const isMobile = screenWidth < 768; // e.g. 375px, 390px, 414px

  const goToNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) {
        setActiveIndex(index);
      }
    },
    [total]
  );

  // Automatic rotation: 5000ms interval with pause on hover/focus/interaction/visibility
  const AUTOPLAY_INTERVAL = 5000;

  useEffect(() => {
    // Respect prefers-reduced-motion or static single piece collections
    if (prefersReducedMotion || total <= 1) {
      return;
    }

    // Pause autoplay while hovering, focusing, swiping/interacting, or when tab is hidden
    if (isHovered || isFocused || isDocumentHidden || isInteracting) {
      return;
    }

    // Schedule next transition; any manual change to activeIndex resets the timer
    const timer = setTimeout(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => {
      clearTimeout(timer);
    };
  }, [
    activeIndex,
    total,
    prefersReducedMotion,
    isHovered,
    isFocused,
    isDocumentHidden,
    isInteracting,
    goToNext,
  ]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goToIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToIndex(total - 1);
    }
  };

  // Touch handlers for fluid swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isSwiping.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current || touchStartX.current === null || touchStartY.current === null) {
      return;
    }
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Detect predominantly horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      // Swiping horizontally
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsInteracting(false);
    if (!isSwiping.current || touchStartX.current === null) {
      isSwiping.current = false;
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const swipeThreshold = 35; // minimum pixels for swipe

    if (deltaX < -swipeThreshold) {
      goToNext();
    } else if (deltaX > swipeThreshold) {
      goToPrev();
    }

    isSwiping.current = false;
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleTouchCancel = () => {
    setIsInteracting(false);
    isSwiping.current = false;
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!products || products.length === 0) {
    return null;
  }

  const activeProduct = products[activeIndex] || products[0];

  // Helper to compute circular distance from active index
  const getDiff = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // 3D positioning calculation tuned for mobile and desktop
  const getCardTransform = (diff: number) => {
    if (prefersReducedMotion) {
      if (diff === 0) {
        return {
          transform: "translate3d(-50%, -50%, 0)",
          opacity: 1,
          zIndex: 30,
          pointerEvents: "auto" as const,
          visibility: "visible" as const,
        };
      }
      return {
        transform: `translate3d(${diff > 0 ? 50 : -150}%, -50%, 0)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
        visibility: "hidden" as const,
      };
    }

    // On mobile (< 768px), keep only center (0) and immediate neighbors (-1, +1) to avoid clutter
    if (isMobile && Math.abs(diff) > 1) {
      return {
        transform: `translate3d(${diff > 0 ? 70 : -170}%, -50%, -250px) scale(0.6)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
        visibility: "hidden" as const,
      };
    }

    // On desktop, keep up to 2 layers behind
    if (Math.abs(diff) > 2) {
      return {
        transform: `translate3d(${diff > 0 ? 90 : -190}%, -50%, -400px) scale(0.6)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
        visibility: "hidden" as const,
      };
    }

    // ACTIVE CENTER CARD (diff === 0)
    if (diff === 0) {
      return {
        transform: "translate3d(-50%, -50%, 0px) rotateY(0deg) scale(1)",
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
        visibility: "visible" as const,
        filter: "brightness(1) contrast(1.02)",
      };
    }

    const sign = Math.sign(diff);
    const absDiff = Math.abs(diff);

    // IMMEDIATE NEIGHBOR CARDS (diff === -1 or +1)
    if (absDiff === 1) {
      let translateX: number;
      let translateZ: number;
      let rotateY: number;
      let scale: number;
      let opacity: number;

      if (isNarrowMobile) {
        // Narrow screens (e.g. 312px)
        translateX = sign * 46;
        translateZ = -75;
        rotateY = -sign * 10;
        scale = 0.82;
        opacity = 0.55;
      } else if (isMobile) {
        // Standard mobile (e.g. 375px, 390px, 414px)
        translateX = sign * 52;
        translateZ = -95;
        rotateY = -sign * 13;
        scale = 0.84;
        opacity = 0.65;
      } else {
        // Desktop
        translateX = sign * 68;
        translateZ = -145;
        rotateY = -sign * 18;
        scale = 0.87;
        opacity = 0.75;
      }

      return {
        transform: `translate3d(${-50 + translateX}%, -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: 20,
        pointerEvents: "auto" as const,
        visibility: "visible" as const,
        filter: "brightness(0.65) grayscale(0.2)",
        cursor: "pointer",
      };
    }

    // DESKTOP SECONDARY NEIGHBORS (diff === -2 or +2)
    const translateX = sign * 122;
    const translateZ = -280;
    const rotateY = -sign * 26;
    const scale = 0.73;
    const opacity = 0.3;

    return {
      transform: `translate3d(${-50 + translateX}%, -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10,
      pointerEvents: "auto" as const,
      visibility: "visible" as const,
      filter: "brightness(0.4) grayscale(0.4)",
      cursor: "pointer",
    };
  };

  return (
    <section
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="WASTE Featured Collection 3D Carousel"
      className="relative w-full overflow-hidden bg-brand-bg py-14 text-brand-black focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-black sm:py-20 md:py-28"
    >
      {/* Background ambient subtle warmth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(184,154,98,0.06),rgba(250,250,248,0))]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12">
        {/* Section Header: Consistent with WASTE navbar & editorial headings */}
        <div className="mb-8 border-b border-brand-border pb-6 sm:mb-12 sm:pb-8 md:mb-16">
          <div className="min-w-0 -ml-0 sm:-ml-2 md:-ml-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold animate-pulse" />
              <p className="truncate font-tenor text-[10px] uppercase tracking-[0.22em] text-brand-muted xs:text-xs xs:tracking-[0.25em]">
                {tagline}
              </p>
            </div>
            <h2 className="mt-2 font-tenor text-[clamp(1.25rem,3.2vw,2.25rem)] font-normal uppercase tracking-[0.15em] text-brand-black">
              {title}
            </h2>
          </div>
        </div>

        {/* 3D STAGE CONTAINER: Height balanced responsively to prevent dominant screen takeover */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          className="relative mx-auto flex h-[330px] xs:h-[370px] sm:h-[430px] md:h-[490px] lg:h-[540px] w-full items-center justify-center overflow-visible"
          style={{
            perspective: isNarrowMobile ? "750px" : isMobile ? "900px" : "1200px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {products.map((product, index) => {
            const diff = getDiff(index);
            const style = getCardTransform(diff);
            const isCenter = diff === 0;
            const fallbackImage =
              "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791887490/file_000000006cb88208b63fe025ad85bfcc_zham6r.png";

            // Resolve matching silhouette by stable slot ID (1-based), product ID/slot, or array index
            const targetSlotId = index + 1;
            const matchingSilhouette =
              silhouettes?.find(
                (s) =>
                  s.id === targetSlotId ||
                  (s as any).slot === targetSlotId ||
                  String(s.id) === String(product.id) ||
                  (s as any).productId === product.id
              ) || silhouettes?.[index];

            const defaultSilhouette =
              DEFAULT_CAROUSEL_ITEMS.find((d) => d.id === matchingSilhouette?.id) ||
              DEFAULT_CAROUSEL_ITEMS[index];

            const hasAdminSilhouetteOverride = Boolean(
              matchingSilhouette?.image &&
                (
                  matchingSilhouette.isCustom === true ||
                  (defaultSilhouette && matchingSilhouette.image !== defaultSilhouette.image)
                )
            );

            // Strict Priority Order for 2024 DROP // THE 3D LOOKBOOK — FEATURED SILHOUETTES:
            // 1. Explicitly saved admin override for this carousel card/slot
            // 2. Existing default image used by this carousel item
            // 3. Existing fallback image
            const adminCardOverride1 =
              product.carouselOverride1 ||
              overrides?.[product.id]?.image1 ||
              overrides?.[`slot-${targetSlotId}`]?.image1 ||
              (hasAdminSilhouetteOverride ? matchingSilhouette?.image : undefined);

            const existingDefaultImage =
              (product.images && product.images[0]) ||
              product.image1;

            const primaryImage =
              adminCardOverride1 ||
              existingDefaultImage ||
              fallbackImage;

            const adminCardOverride2 =
              product.carouselOverride2 ||
              overrides?.[product.id]?.image2 ||
              overrides?.[`slot-${targetSlotId}`]?.image2 ||
              (hasAdminSilhouetteOverride && matchingSilhouette?.mobileImage && matchingSilhouette.mobileImage !== matchingSilhouette.image
                ? matchingSilhouette.mobileImage
                : undefined);

            const existingSecondaryImage =
              (product.images && product.images[1]) ||
              product.image2;

            const secondaryImage =
              adminCardOverride2 ||
              existingSecondaryImage ||
              primaryImage;

            return (
              <div
                key={product.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}: ${product.name}`}
                aria-hidden={!isCenter}
                onClick={() => {
                  if (diff === 0) {
                    router.push(`/product/${product.slug}`);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute top-1/2 left-1/2 w-[215px] xs:w-[245px] sm:w-[290px] md:w-[340px] lg:w-[380px] aspect-[3/4] select-none ${
                  prefersReducedMotion
                    ? "transition-none"
                    : "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                }`}
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* CARD BODY */}
                <div
                  className={`group relative h-full w-full overflow-hidden border bg-white shadow-2xl transition-all duration-500 ${
                    isCenter
                      ? "border-brand-border shadow-[0_24px_50px_-12px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-brand-border/60"
                      : "border-brand-border shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:border-brand-black/40"
                  }`}
                >
                  {/* Category & Badge Header Overlay */}
                  <div className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between p-2.5 sm:p-3.5">
                    <span className="bg-white/90 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-brand-black backdrop-blur-md border border-brand-border sm:text-[9px] sm:tracking-[0.22em] sm:py-1">
                      {product.category || "Streetwear"}
                    </span>
                    {product.compareAtPrice && (
                      <span className="bg-brand-gold px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-brand-black sm:text-[9px] sm:py-1">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Primary & Secondary Images */}
                  <div className="relative h-full w-full overflow-hidden bg-brand-surfaceSubtle">
                    <img
                      src={primaryImage}
                      alt={product.name}
                      loading={Math.abs(diff) <= 1 ? "eager" : "lazy"}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />

                    {/* Secondary image crossfade on center card hover */}
                    {secondaryImage !== primaryImage && isCenter && (
                      <img
                        src={secondaryImage}
                        alt={`${product.name} alternate view`}
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                      />
                    )}

                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Non-center card interactive tap hint */}
                    {!isCenter && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="border border-brand-border bg-white/95 px-2.5 py-1 text-[8px] uppercase tracking-[0.22em] text-brand-black shadow-md backdrop-blur-sm sm:text-[9px]">
                          Tap to View
                        </span>
                      </div>
                    )}

                    {/* Minimal bottom card identifier */}
                    <div className="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/70">
                        {product.sku}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-white font-mono">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Wishlist Button Overlay on Center Card */}
                  {isCenter && (
                    <div
                      className="absolute top-2.5 right-2.5 z-30 sm:top-3.5 sm:right-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WishlistButton
                        item={{
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          image: primaryImage,
                          price: product.price,
                          category: product.category || "Featured",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTIVE PRODUCT EDITORIAL DETAIL DOCK: Clearly separated section below stage to prevent overlaps */}
        <div className="mt-8 border-t border-brand-border pt-6 sm:mt-12 sm:pt-8 md:mt-14">
          <div className="grid gap-6 sm:grid-cols-2 md:items-end lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-tenor text-[10px] uppercase tracking-[0.2em] text-brand-gold xs:text-xs">
                <span>Active Piece</span>
                <span className="text-brand-muted/40">/</span>
                <span className="text-brand-muted">{activeProduct.category || "Essential"}</span>
                {activeProduct.compareAtPrice && (
                  <span className="ml-1 border border-brand-gold/40 bg-brand-goldMuted px-1.5 py-0.5 text-[8px] font-bold text-brand-black xs:text-[9px]">
                    {Math.round(
                      ((activeProduct.compareAtPrice - activeProduct.price) /
                        activeProduct.compareAtPrice) *
                        100
                    )}
                    % Off
                  </span>
                )}
              </div>

              <h3 className="mt-2 line-clamp-2 font-editorial text-2xl leading-[1.05] tracking-tight xs:text-3xl sm:text-4xl md:text-5xl text-brand-black">
                {activeProduct.name}
              </h3>

              {activeProduct.description && (
                <p className="mt-2.5 line-clamp-2 max-w-xl text-xs leading-relaxed text-brand-muted sm:line-clamp-3 sm:text-sm">
                  {activeProduct.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3.5 sm:items-end sm:text-right">
              <div className="flex items-baseline gap-2.5">
                <span className="font-editorial text-2xl tracking-tight text-brand-black xs:text-3xl sm:text-4xl">
                  {formatPrice(activeProduct.price)}
                </span>
                {activeProduct.compareAtPrice && (
                  <span className="text-xs text-brand-muted line-through sm:text-sm">
                    {formatPrice(activeProduct.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Action Buttons: Stack nicely on narrow screens (312px) without clipping */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full sm:w-auto">
                <Link
                  href={`/product/${activeProduct.slug}`}
                  className="group inline-flex min-h-11 xs:min-h-12 flex-1 sm:flex-initial items-center justify-center bg-brand-black px-5 xs:px-7 font-tenor text-[10px] xs:text-xs font-normal uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-brand-black/85"
                >
                  <span>Inspect Piece</span>
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex min-h-11 xs:min-h-12 items-center justify-center border border-brand-border bg-white px-4 xs:px-5 font-tenor text-[10px] xs:text-xs font-normal uppercase tracking-[0.18em] text-brand-black shadow-sm transition-colors duration-300 hover:border-brand-black hover:bg-brand-surfaceSubtle"
                >
                  Shop All →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
