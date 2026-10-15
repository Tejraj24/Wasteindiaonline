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
    CustomEase.create("ease-3", "0.65, 0.01, 0.05, 0.99");
  }
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [isActive, setIsActive] = useState(true);

  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

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
    const logo = logoRef.current;

    if (!wrap || !logo) {
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
    gsap.set(logo, {
      opacity: 0,
      scale: 0.96,
    });

    // 5. Overall preloader duration matching previous luxury timing (1.8s)
    const preloaderTl = gsap.timeline({
      defaults: {
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

    // STAGE 1 — Elegant logo fade in & settle
    preloaderTl.to(logo, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });

    // STAGE 2 — Editorial hold for brand presentation
    preloaderTl.to({}, { duration: 0.5 });

    // STAGE 3 — Subtle logo fade out and seamless curtain reveal of the storefront
    preloaderTl.to(logo, {
      opacity: 0,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.in",
    });

    preloaderTl.to(
      wrap,
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "ease-3",
      },
      "-=0.2"
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden pointer-events-auto select-none"
    >
      {/* Centered WASTE Brand Logo Only */}
      <div
        ref={logoRef}
        style={{ opacity: 0 }}
        className="flex items-center justify-center p-6 sm:p-8"
      >
        <img
          src="https://res.cloudinary.com/dom7a6zlx/image/upload/v1791873242/waste_yl29iy.jpg"
          alt="WASTE"
          fetchPriority="high"
          decoding="async"
          className="w-44 sm:w-56 md:w-64 max-w-[80vw] h-auto object-contain select-none"
        />
      </div>
    </div>
  );
}
