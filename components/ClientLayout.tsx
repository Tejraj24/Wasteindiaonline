"use client";

import { useState } from "react";
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
