"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  onOpenMenu: () => void;
  isDarkTheme?: boolean;
}

export function Header({ onOpenMenu, isDarkTheme = true }: HeaderProps) {
  const { itemCount } = useCart();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const previousUserRef = useRef<typeof user>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const previousUser = previousUserRef.current;
    previousUserRef.current = user;

    if (!previousUser && user && !sessionStorage.getItem("waste-welcome-shown")) {
      setShowWelcome(true);
      sessionStorage.setItem("waste-welcome-shown", "true");
      const timeout = window.setTimeout(() => setShowWelcome(false), 4200);
      return () => window.clearTimeout(timeout);
    }
  }, [user]);

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    setAvatarImageFailed(false);
  }, [user?.photoURL]);

  // Determine active text color based on section
  const isLight = !isDarkTheme || isScrolledPastHero;
  const textColorClass = isLight ? "text-black" : "text-white";
  const accountName = user?.displayName?.trim().split(/\s+/)[0] || user?.email?.split("@")[0] || "ACCOUNT";
  const avatarLetter = (user?.displayName || user?.email || "W").trim().charAt(0).toUpperCase();

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

        <div ref={profileRef} className="relative hidden items-center md:flex">
          <button
            type="button"
            onClick={() => {
              if (user) {
                setIsProfileOpen((open) => !open);
              } else {
                router.push("/login");
              }
            }}
            className="body-upper flex min-h-11 min-w-11 items-center justify-center gap-2 px-1 text-[10px] transition-opacity hover:opacity-70 sm:px-2 md:min-w-0 md:text-base"
            data-cursor="ACCOUNT"
            aria-label={user ? "Open account" : "Log in"}
            aria-expanded={user ? isProfileOpen : undefined}
            aria-haspopup={user ? "menu" : undefined}
          >
            {loading ? (
              <span className="h-5 w-5 animate-pulse rounded-full border border-current/30 bg-current/10" aria-label="Checking account status" />
            ) : user ? (
              <>
                <span className="hidden max-w-[7rem] truncate md:inline">{accountName}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-current/35 text-[10px] leading-none transition-transform duration-300 hover:scale-105 md:h-8 md:w-8">
                  {user.photoURL && !avatarImageFailed ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      loading="lazy"
                      onError={() => setAvatarImageFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true">{avatarLetter}</span>
                  )}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 10 6"
                  className={`h-1.5 w-2.5 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                  fill="none"
                >
                  <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1" />
                </svg>
              </>
            ) : (
              <>
                <span className="hidden md:inline">LOGIN</span>
              </>
            )}
          </button>

          {user && !loading && (
            <nav
              className={`absolute right-0 top-[calc(100%+0.75rem)] z-20 min-w-44 origin-top-right border border-current/15 bg-black/95 p-2 text-white shadow-2xl backdrop-blur-md transition-all duration-300 ${isProfileOpen ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0"}`}
              aria-label="Profile menu"
              role="menu"
              aria-hidden={!isProfileOpen}
            >
              {[
                ["My Account", "/account"],
                ["Orders", "/account#orders"],
                ["Wishlist", "/account#wishlist"],
                ["Addresses", "/account#addresses"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-white/10 hover:text-brand-blue"
                  role="menuitem"
                >
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  void logout();
                }}
                className="block w-full px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.16em] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                role="menuitem"
              >
                Logout
              </button>
            </nav>
          )}
        </div>

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
      {showWelcome && user && (
        <div
          role="status"
          className="absolute right-4 top-full mt-3 border border-white/15 bg-black/90 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white shadow-2xl backdrop-blur-md sm:right-6 md:right-12"
        >
          Welcome back, {user.displayName?.split(" ")[0] || "member"}
        </div>
      )}
    </header>
  );
}
