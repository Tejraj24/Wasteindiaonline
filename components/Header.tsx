"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenMenu: () => void;
  isDarkTheme?: boolean;
}

export function Header({ onOpenMenu, isDarkTheme = true }: HeaderProps) {
  const { itemCount } = useCart();
  const router = useRouter();
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
      className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-3.5 transition-all duration-300 pointer-events-auto sm:px-6 sm:py-5 md:px-12 md:py-8 ${textColorClass} ${
        isNearFooter ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Left: Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-xl font-black uppercase tracking-tighter select-none sm:text-2xl md:text-3xl"
          data-cursor="HOME"
        >
          Waste<span className="text-brand-blue">.</span>
        </Link>
      </div>

      {/* Right: Menu & Cart */}
      <div className="flex flex-1 items-center justify-end gap-1 sm:gap-4 md:gap-12">
        <button
          onClick={onOpenMenu}
          className="body-upper flex min-h-11 min-w-11 items-center justify-center px-2 text-sm transition-opacity hover:opacity-70 md:min-w-0 md:text-base"
          data-cursor="MENU"
          aria-label="Open menu"
        >
          <span className="sr-only md:not-sr-only">MENU</span>
          <span className="flex w-6 flex-col gap-1 md:hidden" aria-hidden="true">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>

        <button
          onClick={() => router.push("/cart")}
          className="body-upper relative flex min-h-11 min-w-11 items-center justify-center gap-1 px-2 text-sm transition-opacity hover:opacity-70 md:min-w-0 md:text-base"
          data-cursor="CART"
          aria-label="View cart"
        >
          <span className="hidden md:inline">CART</span>
          <span className="absolute right-0 top-1/2 flex h-4 min-w-4 -translate-y-1/2 items-center justify-center rounded-full bg-brand-blue px-1 text-[9px] leading-none text-white md:static md:top-auto md:h-auto md:min-w-0 md:translate-y-0 md:rounded-none md:bg-transparent md:px-0 md:text-xs md:text-current">[{itemCount}]</span>
        </button>
      </div>
    </header>
  );
}
