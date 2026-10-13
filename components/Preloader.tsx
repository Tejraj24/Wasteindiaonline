"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

interface PreloaderProps {
  onComplete?: () => void;
  imageUrl?: string;
}

// Register GSAP CustomEase plugin in browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get("ease-3")) {
    // Exact cubic-bezier from https://oddritualgolf.com/ (scripts-2026.js)
    CustomEase.create("ease-3", "0.65, 0.01, 0.05, 0.99");
  }
}

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85";
const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85";

export function Preloader({ onComplete, imageUrl = DEFAULT_PRODUCT_IMAGE }: PreloaderProps) {
  const [isActive, setIsActive] = useState(true);
  const [currentImage, setCurrentImage] = useState(imageUrl);

  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const innerBgRef = useRef<HTMLDivElement>(null);
  const imgContainRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 1. Check for reduced motion preferences or repeated session visits
    let forcePreloader = false;
    let hasVisited = false;
    let prefersReducedMotion = false;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      forcePreloader = searchParams.get("preloader") === "true" || searchParams.get("preloader") === "1";
      hasVisited = sessionStorage.getItem("waste_preloader_seen") === "true";
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // sessionStorage / window access fallback
    }

    if (prefersReducedMotion || (hasVisited && !forcePreloader)) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const logo = logoRef.current;
    const innerBg = innerBgRef.current;
    const imgContain = imgContainRef.current;
    const img = imgRef.current;

    if (!wrap || !inner || !logo || !innerBg || !imgContain || !img) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    // 2. Lock body scroll during preloader sequence
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Safety fallback timer to prevent infinite loading state
    const safetyTimeout = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setIsActive(false);
      onComplete?.();
    }, 4500);

    // 4. Initial GSAP positioning
    gsap.set(wrap, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
    });
    gsap.set(inner, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
    });
    gsap.set(logo, {
      opacity: 0,
    });
    gsap.set(innerBg, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(imgContain, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(img, {
      yPercent: -30,
    });

    // 5. Build choreography matching https://oddritualgolf.com/
    // loaderDuration is scaled to 1.8s for balanced, luxury editorial rhythm
    const loaderDuration = 1.8;
    const stepDuration = loaderDuration / 2; // 0.9s per major phase

    const preloaderTl = gsap.timeline({
      defaults: {
        duration: stepDuration,
        ease: "ease-3",
      },
      onComplete: () => {
        window.clearTimeout(safetyTimeout);
        document.body.style.overflow = previousOverflow;
        try {
          sessionStorage.setItem("waste_preloader_seen", "true");
        } catch {
          // ignore storage error
        }
        setIsActive(false);
        onComplete?.();
      },
    });

    // STAGE 1 — Centered wordmark entrance
    preloaderTl.fromTo(
      logo,
      { opacity: 0 },
      {
        delay: 0.35,
        ease: "sine.in",
        duration: stepDuration,
        opacity: 1,
      }
    );

    // STAGE 2 — Product photograph unmasks downwards to cover the wordmark completely
    // Champagne gold accent leading layer begins wipe down from top
    preloaderTl.fromTo(
      innerBg,
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: stepDuration }
    );

    // Image container wipes down from top 15% later, with champagne gold leading layer
    preloaderTl.fromTo(
      imgContain,
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: stepDuration },
      "<15%"
    );

    // Concurrently, image inside descends from -30% to 0% (editorial parallax)
    preloaderTl.fromTo(
      img,
      { yPercent: -30 },
      { yPercent: 0, duration: stepDuration },
      "<"
    );

    // Subtle editorial hold before exit wipe
    preloaderTl.to({}, { duration: 0.2 });

    // STAGE 3 — Seamless downward reveal of the homepage
    // Product stage card wipes downwards
    preloaderTl.to(inner, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: stepDuration,
    });

    // Concurrently, product image drifts slightly downwards
    preloaderTl.to(
      img,
      {
        yPercent: 12,
        duration: stepDuration,
      },
      "<"
    );

    // At 30% into the stage wipe, the entire fullscreen curtain wipes down
    preloaderTl.to(
      wrap,
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: stepDuration,
      },
      "<30%"
    );

    return () => {
      window.clearTimeout(safetyTimeout);
      preloaderTl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-black overflow-hidden pointer-events-auto select-none"
    >
      {/* Centered stage container with responsive 4:5 aspect ratio */}
      <div
        ref={innerRef}
        className="relative flex items-center justify-center w-[280px] sm:w-[320px] md:w-[360px] aspect-[4/5] overflow-hidden"
      >
        {/* STAGE 1 — Centered WASTE® brand logo */}
        <div
          ref={logoRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 z-0 flex items-center justify-center p-6 pointer-events-none"
        >
          <img
            src="https://res.cloudinary.com/dom7a6zlx/image/upload/v1791873242/waste_yl29iy.jpg"
            alt="WASTE®"
            fetchPriority="high"
            decoding="async"
            className="w-48 sm:w-56 md:w-64 max-w-[80%] h-auto object-contain select-none"
          />
        </div>

        {/* STAGE 2 (A) — Champagne gold (#B89A62) leading background layer */}
        <div
          ref={innerBgRef}
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
          className="absolute inset-0 z-10 bg-brand-gold pointer-events-none"
        />

        {/* STAGE 2 (B) — Centered product photograph that completely covers the wordmark */}
        <div
          ref={imgContainRef}
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
          className="relative z-20 w-full h-full overflow-hidden bg-brand-black"
        >
          <img
            ref={imgRef}
            src={currentImage}
            alt="WASTE Collection"
            fetchPriority="high"
            onError={() => setCurrentImage(FALLBACK_PRODUCT_IMAGE)}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-110"
          />
        </div>
      </div>
    </div>
  );
}
