"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [isActive, setIsActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if visited in current session
    if (sessionStorage.getItem("studio_visited") === "true") {
      setIsActive(false);
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    const inner = innerRef.current;
    const logo = logoRef.current;
    const imageWrap = imageWrapRef.current;
    const image = imageRef.current;

    if (!container || !inner || !logo || !imageWrap || !image) {
      setIsActive(false);
      return;
    }

    // Lock body scroll
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        document.body.style.overflow = "";
        sessionStorage.setItem("studio_visited", "true");
        setIsActive(false);
        onComplete?.();
      },
    });

    // 1. Logo & image entrance
    tl.fromTo(logo, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7 })
      .fromTo(
        imageWrap,
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.8 },
        "<0.2"
      )
      .fromTo(image, { yPercent: -20, scale: 1.1 }, { yPercent: 0, scale: 1, duration: 0.8 }, "<")
      // Hold for editorial rhythm
      .to({}, { duration: 0.4 })
      // 2. Exit wipe upwards
      .to(inner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power4.inOut",
      })
      .to(
        container,
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "power4.inOut",
        },
        "<0.1"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[120] bg-black text-white flex flex-col justify-center items-center overflow-hidden"
    >
      <div ref={innerRef} className="w-full h-full flex flex-col justify-between p-6 md:p-12 relative">
        {/* Top Header */}
        <div className="flex justify-between items-center text-xs tracking-widest uppercase opacity-60">
          <span>STUDIO ARCHIVE</span>
          <span>EST. 2026</span>
        </div>

        {/* Center Editorial Logo & Image Montage */}
        <div className="flex flex-col items-center justify-center my-auto gap-8">
          <div ref={imageWrapRef} className="w-64 md:w-80 h-80 md:h-96 relative overflow-hidden bg-neutral-900">
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80"
              alt="Studio Introduction"
              className="w-full h-full object-cover grayscale brightness-90"
            />
          </div>

          <div ref={logoRef} className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              WASTE<span className="text-brand-blue">.</span>
            </h1>
            <p className="font-editorial italic text-lg md:text-xl text-neutral-400 mt-2">
              A Modern Expression of Heritage
            </p>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex justify-between items-center text-xs tracking-widest uppercase opacity-60">
          <span>COLLECTION 01 / SS26</span>
          <span className="animate-pulse">LOADING</span>
        </div>
      </div>
    </div>
  );
}
