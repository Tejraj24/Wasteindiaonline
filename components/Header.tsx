"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenMenu: () => void;
  isDarkTheme?: boolean;
}

export function Header({ onOpenMenu, isDarkTheme = true }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.9;
      setIsScrolledPastHero(scrollY > heroHeight);

      // Check footer proximity
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      if (scrollY + windowHeight > docHeight - 400) {
        setIsNearFooter(true);
      } else {
        setIsNearFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine active text color based on section
  const isLight = !isDarkTheme || isScrolledPastHero;
  const textColorClass = isLight ? "text-black" : "text-white";
  const lineColorClass = isLight ? "bg-black/20" : "bg-white/40";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-8 flex items-center justify-between pointer-events-auto ${textColorClass} ${
        isNearFooter ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Left: Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter uppercase select-none inline-block"
          data-cursor="HOME"
        >
          Waste<span className="text-brand-blue">.</span>
        </Link>
      </div>

      {/* Right: Menu & Cart */}
      <div className="flex items-center gap-8 md:gap-12 justify-end flex-1">
        <button
          onClick={onOpenMenu}
          className="body-upper hover:opacity-70 transition-opacity text-sm md:text-base"
          data-cursor="MENU"
        >
          MENU
        </button>

        <button
          onClick={openCart}
          className="body-upper flex items-center gap-1 hover:opacity-70 transition-opacity text-sm md:text-base"
          data-cursor="CART"
          aria-label="Open cart drawer"
        >
          <span>CART</span>
          <span className="text-[10px] md:text-xs tracking-tighter align-top">[{itemCount}]</span>
        </button>
      </div>
    </header>
  );
}
