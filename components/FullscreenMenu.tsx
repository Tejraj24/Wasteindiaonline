"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useLenis } from "@/hooks/useLenis";
import { useAuth } from "./auth/AuthProvider";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const baseNavLinks = [
  { name: "SHOP", href: "/shop" },
  { name: "OUR STORY", href: "/our-story" },
  { name: "CONTACT", href: "/contact" },
];

export function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgPanelsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const { stopScroll, startScroll } = useLenis();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    if (!overlayRef.current || !bgPanelsRef.current || !linksRef.current) return;

    const overlay = overlayRef.current;
    const bgPanels = bgPanelsRef.current.children;
    const links = linksRef.current.children;

    if (isOpen) {
      stopScroll();
      
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
      
      tl.set(overlay, { autoAlpha: 1 })
        .fromTo(
          bgPanels,
          { yPercent: -101 },
          { yPercent: 0, stagger: 0.1, duration: 0.7 }
        )
        .fromTo(
          links,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.6 },
          "-=0.4"
        );
    } else {
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" }, onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0 });
        startScroll();
      }});
      
      tl.to(links, { yPercent: -50, opacity: 0, stagger: 0.05, duration: 0.4 })
        .to(bgPanels, { yPercent: 101, stagger: 0.1, duration: 0.6 }, "-=0.2");
    }
  }, [isOpen, stopScroll, startScroll]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99] invisible"
      aria-hidden={!isOpen}
    >
      {/* Background Panels */}
      <div ref={bgPanelsRef} className="absolute inset-0 flex">
        <div className="flex-1 bg-brand-dark h-full" />
        <div className="flex-1 bg-brand-dark h-full hidden md:block" />
        <div className="flex-1 bg-brand-dark h-full hidden lg:block" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-12 text-brand-light">
        <div className="flex justify-between items-center">
          <Link href="/" onClick={onClose} className="text-xl md:text-2xl font-black uppercase">
            Waste<span className="text-brand-blue">.</span>
          </Link>
          <button 
            onClick={onClose}
            className="body-upper tracking-wider hover:opacity-70 transition-opacity"
            data-cursor="CLOSE"
          >
            CLOSE
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center mt-12 md:mt-0">
          <ul ref={linksRef} className="flex flex-col gap-4 overflow-hidden group">
            {baseNavLinks.map((link, i) => (
              <li key={i} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block text-5xl md:text-7xl font-bold uppercase tracking-tighter hover:text-brand-light text-brand-light/80 transition-colors duration-300 group-hover:text-brand-faded"
                  data-cursor="EXPLORE"
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Unauthenticated User */}
            {!user && !loading && (
              <li className="overflow-hidden">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block text-5xl font-bold uppercase tracking-tighter text-brand-light/80 transition-colors duration-300 hover:text-brand-light md:text-7xl"
                  data-cursor="ACCOUNT"
                >
                  LOGIN
                </Link>
              </li>
            )}

            {/* ADMIN EXPERIENCE */}
            {user && !loading && isAdmin && (
              <>
                <li className="overflow-hidden">
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="block text-5xl font-bold uppercase tracking-tighter text-blue-400 transition-colors duration-300 hover:text-blue-300 md:text-7xl"
                    data-cursor="ADMIN"
                  >
                    ADMIN DASHBOARD
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    href="/"
                    onClick={onClose}
                    className="block text-5xl font-bold uppercase tracking-tighter text-brand-light/80 transition-colors duration-300 hover:text-brand-light md:text-7xl"
                    data-cursor="STORE"
                  >
                    VIEW STORE
                  </Link>
                </li>
              </>
            )}

            {/* CUSTOMER EXPERIENCE */}
            {user && !loading && !isAdmin && (
              <>
                <li className="overflow-hidden">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="block text-5xl font-bold uppercase tracking-tighter text-brand-light/80 transition-colors duration-300 hover:text-brand-light md:text-7xl"
                    data-cursor="ACCOUNT"
                  >
                    ACCOUNT
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    href="/account#wishlist"
                    onClick={onClose}
                    className="block text-5xl font-bold uppercase tracking-tighter text-brand-light/80 transition-colors duration-300 hover:text-brand-light md:text-7xl"
                    data-cursor="WISHLIST"
                  >
                    WISHLIST
                  </Link>
                </li>
              </>
            )}
          </ul>

          {user && !loading && (
            <button
              type="button"
              onClick={() => {
                onClose();
                void logout();
              }}
              className="mt-8 self-start text-[10px] uppercase tracking-[0.2em] text-brand-light/50 transition hover:text-brand-light"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
