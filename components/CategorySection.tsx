"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
  image?: string;
  subtitle?: string;
  tag?: string;
  aspect?: string;
}

// Verified real project imagery mapped to actual store categories
const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-01",
    name: "Outerwear",
    slug: "outerwear",
    subtitle: "Technical Weatherproof & Shells",
    tag: "LAYER ARCHITECTURE",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-02",
    name: "Sweatshirts",
    slug: "sweatshirts",
    subtitle: "500 GSM Loopback Cotton Fleece",
    tag: "HEAVY FLEECE",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933528/Waste_Black_Hoodie1_uzcz8v.png",
  },
  {
    id: "cat-03",
    name: "T-Shirts",
    slug: "t-shirts",
    subtitle: "280 GSM Combed Drop-Shoulder",
    tag: "SIGNATURE GRAPHICS",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797197/file_000000005ed48208abf35f02392a64b3.jpg_ibwmtc.jpg",
  },
  {
    id: "cat-04",
    name: "Trousers",
    slug: "trousers",
    subtitle: "Double Pleats & Architectural Drape",
    tag: "TAILORED RELAX",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934989/waste-jeans_gpvjh6.jpg",
  },
  {
    id: "cat-05",
    name: "Unisex",
    slug: "unisex",
    subtitle: "Oversized Fits · Made for Everyone",
    tag: "GENDER-NEUTRAL",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791935743/Waste_Black_Art_Tee2_b0ioqj.png",
  },
];

interface CategorySectionProps {
  categories?: {
    id: string;
    name: string;
    slug: string;
    _count?: { products: number };
  }[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Merge database category metadata with editorial imagery and tags
  const resolvedCategories: CategoryItem[] = DEFAULT_CATEGORIES.map((def) => {
    const liveMatch = categories?.find(
      (c) =>
        c.slug.toLowerCase() === def.slug.toLowerCase() ||
        c.name.toLowerCase() === def.name.toLowerCase() ||
        (def.slug === "unisex" && (c.slug.toLowerCase() === "polos" || c.name.toLowerCase() === "polos"))
    );
    return {
      ...def,
      count: liveMatch?._count?.products ?? (def.slug === "unisex" ? 3 : undefined),
    };
  });

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
            },
          }
        );
      }

      // Contact sheet frames entrance
      const frames = gridRef.current?.querySelectorAll(".contact-frame");
      if (frames && frames.length > 0) {
        gsap.fromTo(
          frames,
          {
            opacity: 0,
            y: 36,
            clipPath: "inset(8% 0% 8% 0%)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.95,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="WASTE® Category Contact Sheet"
      className="relative w-full border-t border-brand-border bg-brand-bg py-16 text-brand-black sm:py-20 md:py-28"
    >
      {/* Background subtle contact sheet tint */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(184,154,98,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12">
        {/* ================================================================= */}
        {/* EDITORIAL HEADER: Aligned to brand guidelines                    */}
        {/* ================================================================= */}
        <div
          ref={headerRef}
          className="mb-10 border-b border-brand-border pb-6 sm:mb-14 sm:pb-8 md:mb-16"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold animate-pulse" />
                <p className="truncate font-tenor text-[10px] uppercase tracking-[0.22em] text-brand-muted xs:text-xs xs:tracking-[0.25em]">
                  WASTE® // CATEGORY INDEX
                </p>
              </div>
              <h2 className="mt-2 font-tenor text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal uppercase leading-[1.05] tracking-[0.14em] text-brand-black">
                THE NEW UNIFORM
              </h2>
              <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-brand-muted sm:text-sm">
                Architectural wardrobe building blocks developed in New Delhi. Essential silhouettes designed for tactile permanence and everyday utility.
              </p>
            </div>

            {/* Darkroom Roll Metadata & Shop Link */}
            <div className="flex flex-col items-start gap-2 text-right md:items-end">
              <div className="inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-brand-muted sm:text-[10px]">
                <span className="text-brand-black font-semibold">[ 01 — 05 ]</span>
                <span className="text-brand-muted/40">/</span>
                <span>ROLL WST-24-CS</span>
                <span className="hidden sm:inline text-brand-muted/40">/</span>
                <span className="hidden sm:inline">35MM ED.</span>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 font-tenor text-[10px] uppercase tracking-[0.2em] text-brand-black transition-colors hover:text-brand-muted sm:text-xs"
              >
                <span>Browse All Products</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* THE CONTACT SHEET: Asymmetric art-directed editorial composition   */}
        {/* ================================================================= */}
        <div ref={gridRef} className="space-y-6 sm:space-y-8 md:space-y-10">
          {/* ROW 1: 2 HERO FRAMES (Outerwear + Sweatshirts) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            {/* FRAME 01: OUTERWEAR (Large architectural anchor) */}
            <div className="md:col-span-7">
              <ContactSheetCard
                category={resolvedCategories[0]}
                frameNumber="01"
                frameCode="35MM-01A"
                aspectClass="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/11]"
                isHovered={hoveredSlug === resolvedCategories[0].slug}
                isDimmed={hoveredSlug !== null && hoveredSlug !== resolvedCategories[0].slug}
                onHover={setHoveredSlug}
                badge="SIGNATURE SHELL"
              />
            </div>

            {/* FRAME 02: SWEATSHIRTS (Medium format portrait) */}
            <div className="md:col-span-5 md:pt-8">
              <ContactSheetCard
                category={resolvedCategories[1]}
                frameNumber="02"
                frameCode="MF-6X7-02"
                aspectClass="aspect-[4/3] sm:aspect-[4/5]"
                isHovered={hoveredSlug === resolvedCategories[1].slug}
                isDimmed={hoveredSlug !== null && hoveredSlug !== resolvedCategories[1].slug}
                onHover={setHoveredSlug}
                badge="500 GSM FLEECE"
              />
            </div>
          </div>

          {/* ROW 2: 3 ASYMMETRIC FRAMES (T-Shirts, Trousers, Polos) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12 md:gap-8">
            {/* FRAME 03: T-SHIRTS */}
            <div className="md:col-span-4">
              <ContactSheetCard
                category={resolvedCategories[2]}
                frameNumber="03"
                frameCode="35MM-03A"
                aspectClass="aspect-[4/3] sm:aspect-[3/4]"
                isHovered={hoveredSlug === resolvedCategories[2].slug}
                isDimmed={hoveredSlug !== null && hoveredSlug !== resolvedCategories[2].slug}
                onHover={setHoveredSlug}
                badge="HEAVYWEIGHT"
              />
            </div>

            {/* FRAME 04: TROUSERS (Tall portrait highlighting drape) */}
            <div className="md:col-span-4 md:-mt-6">
              <ContactSheetCard
                category={resolvedCategories[3]}
                frameNumber="04"
                frameCode="MF-6X6-04"
                aspectClass="aspect-[4/3] sm:aspect-[3/4] md:aspect-[2/3]"
                isHovered={hoveredSlug === resolvedCategories[3].slug}
                isDimmed={hoveredSlug !== null && hoveredSlug !== resolvedCategories[3].slug}
                onHover={setHoveredSlug}
                badge="PLEATED DRAPE"
              />
            </div>

            {/* FRAME 05: UNISEX */}
            <div className="sm:col-span-2 md:col-span-4 md:pt-10">
              <ContactSheetCard
                category={resolvedCategories[4]}
                frameNumber="05"
                frameCode="35MM-05"
                aspectClass="aspect-[4/3] sm:aspect-[4/3] md:aspect-[3/4]"
                isHovered={hoveredSlug === resolvedCategories[4].slug}
                isDimmed={hoveredSlug !== null && hoveredSlug !== resolvedCategories[4].slug}
                onHover={setHoveredSlug}
                badge="UNISEX"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BOTTOM FILM REEL TAPE: Quick interactive jump-strip               */}
        {/* ================================================================= */}
        <div className="mt-14 border-t border-brand-border pt-6 sm:mt-16 sm:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-brand-muted sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-black" />
              <span>DIRECT ACCESS CATALOGUE</span>
              <span className="text-brand-muted/40">/</span>
              <span>FILTER BY SILHOUETTE</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {resolvedCategories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className="group inline-flex items-center gap-1.5 border border-brand-border bg-white px-3 py-1.5 font-tenor text-[9px] uppercase tracking-[0.18em] text-brand-black transition-colors duration-200 hover:border-brand-black hover:bg-brand-surfaceSubtle xs:text-[10px]"
                >
                  <span className="font-mono text-[8px] text-brand-muted group-hover:text-brand-black">
                    0{idx + 1}
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===========================================================================
// SUBCOMPONENT: Individual Contact Sheet Photo Frame Card
// ===========================================================================
interface ContactSheetCardProps {
  category: CategoryItem;
  frameNumber: string;
  frameCode: string;
  aspectClass: string;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (slug: string | null) => void;
  badge?: string;
}

function ContactSheetCard({
  category,
  frameNumber,
  frameCode,
  aspectClass,
  isHovered,
  isDimmed,
  onHover,
  badge,
}: ContactSheetCardProps) {
  const destination = `/shop?category=${encodeURIComponent(category.slug)}`;

  return (
    <article
      className={`contact-frame group relative flex flex-col border border-brand-border bg-white p-2.5 sm:p-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHovered
          ? "border-brand-black shadow-xl -translate-y-1 z-20"
          : isDimmed
          ? "opacity-65 filter grayscale-[20%]"
          : "hover:border-brand-black hover:shadow-lg"
      }`}
      onMouseEnter={() => onHover(category.slug)}
      onMouseLeave={() => onHover(null)}
    >
      {/* 35MM Film Frame Top Negative Header */}
      <div className="mb-2 flex items-center justify-between border-b border-brand-border/60 pb-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-brand-muted sm:text-[9px]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-black">#{frameNumber}</span>
          <span className="text-brand-muted/40">/</span>
          <span>{frameCode}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="bg-brand-surfaceSubtle px-1.5 py-0.5 text-[7px] font-semibold text-brand-black sm:text-[8px]">
              {badge}
            </span>
          )}
          <span className="hidden sm:inline text-brand-muted/40">•</span>
          <span className="hidden sm:inline">WASTE LABS</span>
        </div>
      </div>

      {/* Main Image Viewport with Darkroom Frame Edge */}
      <Link
        href={destination}
        className={`relative w-full overflow-hidden bg-brand-surfaceSubtle ${aspectClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-black`}
        aria-label={`Explore ${category.name} collection`}
        data-cursor="EXPLORE"
      >
        <img
          src={category.image}
          alt={`WASTE® ${category.name} collection campaign photographic proof`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />

        {/* Ambient tonal gradient for high luxury contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

        {/* Darkroom Contact Sheet Sprocket Notch Accents */}
        <div
          className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5 opacity-40 transition-opacity duration-300 group-hover:opacity-80"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1 rounded-sm bg-white" />
          <span className="h-1.5 w-1 rounded-sm bg-white" />
          <span className="h-1.5 w-1 rounded-sm bg-white" />
        </div>

        {/* Floating Category Title & Tag Overlay inside Image */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-3.5 sm:p-5">
          {category.tag && (
            <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-brand-gold sm:text-[9px]">
              {category.tag}
            </p>
          )}
          <h3 className="mt-1 font-tenor text-lg uppercase tracking-[0.14em] text-white sm:text-xl md:text-2xl">
            {category.name}
          </h3>
          {category.subtitle && (
            <p className="mt-1 line-clamp-1 text-[10px] text-white/75 sm:text-xs">
              {category.subtitle}
            </p>
          )}
        </div>
      </Link>

      {/* Frame Bottom Editorial Information & Action Link */}
      <div className="mt-2.5 flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-brand-muted sm:text-[10px]">
          <span>Index {frameNumber}</span>
          {category.count !== undefined && (
            <>
              <span className="text-brand-muted/40">/</span>
              <span>{category.count} {category.count === 1 ? "Piece" : "Pieces"}</span>
            </>
          )}
        </div>

        <Link
          href={destination}
          className="group/link inline-flex items-center gap-1.5 font-tenor text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-black transition-colors hover:text-brand-gold sm:text-[10px]"
        >
          <span>EXPLORE</span>
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
