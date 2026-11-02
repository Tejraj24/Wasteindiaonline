"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  onOpenMenu: () => void;
  isDarkTheme?: boolean;
}

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "SHOP", href: "/shop" },
  { name: "JOURNAL", href: "/blog" },
  { name: "OUR STORY", href: "/our-story" },
  { name: "CONTACT", href: "/contact" },
];

export function Header({ onOpenMenu, isDarkTheme = false }: HeaderProps) {
  const { itemCount, openCart, isOpen } = useCart();
  const { user, isAdmin, loading, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const previousUserRef = useRef<typeof user>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isScrolledRef = useRef(false);
  const isNearFooterRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const nextScrolled = scrollY > 50;
      if (nextScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      // Check footer proximity
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const nextNearFooter = scrollY + windowHeight > docHeight - 400;
      if (nextNearFooter !== isNearFooterRef.current) {
        isNearFooterRef.current = nextNearFooter;
        setIsNearFooter(nextNearFooter);
      }
    };

    // Evaluate immediately on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Re-evaluate scroll state on route changes
  useEffect(() => {
    const handleCheck = () => {
      if (typeof window === "undefined") return;
      const scrollY = window.scrollY;
      const nextScrolled = scrollY > 50;
      if (nextScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const nextNearFooter = scrollY + windowHeight > docHeight - 400;
      if (nextNearFooter !== isNearFooterRef.current) {
        isNearFooterRef.current = nextNearFooter;
        setIsNearFooter(nextNearFooter);
      }
    };

    handleCheck();
    const timeout = setTimeout(handleCheck, 80);
    return () => clearTimeout(timeout);
  }, [pathname]);

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

  const accountName = user?.displayName?.trim().split(/\s+/)[0] || user?.email?.split("@")[0] || "ACCOUNT";
  const avatarLetter = (user?.displayName || user?.email || "W").trim().charAt(0).toUpperCase();

  // Dark hero top appearance applies to homepage campaign Hero or explicit dark theme
  const hasDarkHero = isHome || isDarkTheme;
  const isTransparent = hasDarkHero && !isScrolled;

  const headerBgClass = isTransparent
    ? "bg-transparent text-[#000000] border-b border-transparent shadow-none"
    : isScrolled
    ? "bg-white/95 backdrop-blur-md text-[#000000] border-b border-brand-border/60 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
    : "bg-brand-bg/85 backdrop-blur-md text-[#000000] border-b border-transparent shadow-none";

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full pointer-events-auto transition-all duration-300 ease-in-out motion-reduce:transition-none ${headerBgClass} ${
        isNearFooter ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 md:h-20 md:px-12">
        {/* Left: Brand Logo (clean WASTE without any dot) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-tenor text-xl font-normal uppercase tracking-[0.2em] select-none text-[#000000] transition-colors duration-300 ease-in-out hover:text-[#E8DCC8] sm:text-2xl"
            data-cursor="HOME"
            aria-label="WASTE homepage"
          >
            WASTE
          </Link>
        </div>

        {/* Center: Horizontal Navigation (VASAAE inspired) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-8 xl:space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative py-2 text-xs font-tenor font-medium tracking-widest text-[#000000] transition-colors duration-300 ease-in-out hover:text-[#E8DCC8]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Utility Actions & Mobile Menu */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Wishlist Link (Quick Access) */}
          <Link
            href="/account#wishlist"
            className="relative flex h-10 w-10 items-center justify-center text-[#000000] transition-colors duration-300 ease-in-out hover:text-[#E8DCC8]"
            aria-label={`${wishlistItems.length} saved wishlist items`}
            data-cursor="WISHLIST"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[9px] font-medium leading-none text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* User Account Button & Dropdown */}
          <div ref={profileRef} className="relative flex items-center">
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setIsProfileOpen((open) => !open);
                } else {
                  router.push("/login");
                }
              }}
              className="flex h-10 items-center justify-center gap-1.5 px-2 text-xs font-tenor tracking-wider text-[#000000] transition-colors duration-300 ease-in-out hover:text-[#E8DCC8]"
              data-cursor="ACCOUNT"
              aria-label={user ? (isAdmin ? "Open admin menu" : "Open customer account menu") : "Sign in"}
              aria-expanded={user ? isProfileOpen : undefined}
              aria-haspopup={user ? "menu" : undefined}
            >
              {loading ? (
                <span className={`h-4 w-4 animate-pulse rounded-full border border-[#000000]/30 bg-[#000000]/10`} aria-label="Checking account status" />
              ) : user ? (
                <>
                  <span className="hidden max-w-[6rem] truncate sm:inline text-xs font-tenor tracking-wider">
                    {isAdmin ? "ADMIN" : accountName}
                  </span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-current text-[9px] leading-none transition-all duration-300 hover:scale-105">
                    {user.photoURL && !avatarImageFailed ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        loading="lazy"
                        onError={() => setAvatarImageFailed(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span aria-hidden="true">{isAdmin ? "A" : avatarLetter}</span>
                    )}
                  </span>
                </>
              ) : (
                <span className="text-xs font-tenor tracking-wider">SIGN IN</span>
              )}
            </button>

            {user && !loading && (
              <nav
                className={`absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-48 origin-top-right border border-brand-border bg-white p-2 text-brand-black shadow-xl transition-all duration-300 ${
                  isProfileOpen ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0"
                }`}
                aria-label={isAdmin ? "Admin Navigation Menu" : "Customer Profile Menu"}
                role="menu"
                aria-hidden={!isProfileOpen}
              >
                {isAdmin ? (
                  <>
                    <div className="border-b border-brand-border px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-brand-muted">
                      Enterprise Admin
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-xs font-tenor tracking-wider text-brand-black transition-colors hover:bg-brand-surfaceSubtle"
                      role="menuitem"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-xs font-tenor tracking-wider text-brand-muted transition-colors hover:bg-brand-surfaceSubtle hover:text-brand-black"
                      role="menuitem"
                    >
                      View Store
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-xs font-tenor tracking-wider transition-colors hover:bg-brand-surfaceSubtle hover:text-brand-black"
                      role="menuitem"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account#orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-xs font-tenor tracking-wider transition-colors hover:bg-brand-surfaceSubtle hover:text-brand-black"
                      role="menuitem"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/account#wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-xs font-tenor tracking-wider transition-colors hover:bg-brand-surfaceSubtle hover:text-brand-black"
                      role="menuitem"
                    >
                      Wishlist
                    </Link>
                    <Link
                      href="/account#addresses"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-xs font-tenor tracking-wider transition-colors hover:bg-brand-surfaceSubtle hover:text-brand-black"
                      role="menuitem"
                    >
                      Addresses
                    </Link>
                  </>
                )}

                <div className="my-1 border-t border-brand-border" />

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    void logout();
                  }}
                  className="block w-full px-3 py-2 text-left text-xs font-tenor tracking-wider text-brand-muted transition-colors hover:bg-brand-surfaceSubtle hover:text-brand-black"
                  role="menuitem"
                >
                  Logout
                </button>
              </nav>
            )}
          </div>

          {/* Cart Icon / Drawer Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center text-[#000000] transition-colors duration-300 ease-in-out hover:text-[#E8DCC8]"
            data-cursor="CART"
            aria-label={`Open cart (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#000000] px-1 text-[9px] font-medium leading-none text-white transition-colors duration-300">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Fullscreen Menu Toggle (Hamburger) */}
          <button
            onClick={onOpenMenu}
            className="flex h-10 w-10 items-center justify-center text-[#000000] transition-colors duration-300 ease-in-out hover:text-[#E8DCC8] lg:hidden"
            data-cursor="MENU"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {showWelcome && user && (
        <div
          role="status"
          className="absolute right-4 top-full mt-2 border border-brand-border bg-white px-4 py-2.5 text-xs font-tenor tracking-wider text-brand-black shadow-lg sm:right-6 md:right-12"
        >
          Welcome back, {isAdmin ? "Administrator" : (user.displayName?.split(" ")[0] || "member")}
        </div>
      )}
    </header>
  );
}
