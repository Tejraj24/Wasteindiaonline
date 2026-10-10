"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Preloader } from "./Preloader";
import { CustomCursor } from "./CustomCursor";
import { FullscreenMenu } from "./FullscreenMenu";
import { CartDrawer } from "./CartDrawer";
import { useLenis } from "@/hooks/useLenis";
import { AuthProvider } from "./auth/AuthProvider";
import { WishlistProvider } from "./WishlistProvider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  
  // Initialize Lenis smooth scroll
  const { lenis } = useLenis();

  // Track client-side navigation within the storefront session
  useEffect(() => {
    if (typeof window === "undefined" || isAdminRoute || !pathname) return;
    try {
      const rawCount = sessionStorage.getItem("waste_nav_count");
      const currentRecorded = sessionStorage.getItem("waste_current_path");

      if (rawCount === null) {
        sessionStorage.setItem("waste_nav_count", "0");
        sessionStorage.setItem("waste_current_path", pathname);
      } else if (currentRecorded !== pathname) {
        const nextCount = Number(rawCount) + 1;
        sessionStorage.setItem("waste_nav_count", String(nextCount));
        sessionStorage.setItem("waste_prev_path", currentRecorded || "");
        sessionStorage.setItem("waste_current_path", pathname);
      }
    } catch {
      // sessionStorage might be restricted in private browsing modes
    }
  }, [pathname, isAdminRoute]);

  return (
    <AuthProvider>
      <WishlistProvider>
        <Preloader onComplete={() => setIsPreloaderActive(false)} />
        <CustomCursor />
        
        {!isAdminRoute && (
          <>
            <CartDrawer />
            <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {!isPreloaderActive && (
              <Header
                onOpenMenu={() => setIsMenuOpen(true)}
                isDarkTheme={true}
              />
            )}
          </>
        )}

        <main className="w-full relative min-h-screen">
          {children}
        </main>
      </WishlistProvider>
    </AuthProvider>
  );
}
