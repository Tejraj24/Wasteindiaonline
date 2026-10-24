"use client";

import Link from "next/link";

interface ObjectsOfExpressionHeroProps {
  className?: string;
}

export function ObjectsOfExpressionHero({ className = "" }: ObjectsOfExpressionHeroProps) {
  const greenTeeUrl =
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792828909/waste-green-tshrit_gq4mwm.png";
  const monochromeMoodUrl =
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791881073/file_0000000073748211bf37ba309647258e.jpg_ajebtr.jpg";

  return (
    <section
      aria-label="Objects of Expression Collection Showcase"
      className={`relative w-full bg-brand-bg text-brand-black border-t border-brand-border overflow-hidden select-none ${className}`}
    >
      {/* =========================================================================
          DESKTOP & TABLET VIEWPORT (md and up):
          Strict single-screen layout engineered to fit exactly within the viewport
          below the header (100svh - 5rem) without vertical scrolling.
          ========================================================================= */}
      <div className="hidden md:flex flex-col justify-between h-[calc(100svh-5rem)] min-h-[640px] max-h-[920px] max-w-[1680px] mx-auto px-6 lg:px-12 xl:px-16 py-6 lg:py-8">
        
        {/* Top Minimal Editorial Bar */}
        <div className="w-full flex items-center pb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-4 text-[10px] lg:text-[11px] font-mono tracking-[0.26em] uppercase text-brand-muted">
            <span className="font-medium text-brand-black">NEW COLLECTION</span>
            <span className="w-8 h-[1px] bg-brand-border" aria-hidden="true" />
            <span>VOL. 01</span>
          </div>
        </div>

        {/* Main 3-Zone Asymmetrical Grid */}
        <div className="flex-1 grid grid-cols-12 items-center gap-4 lg:gap-8 xl:gap-12 min-h-0 py-4">
          
          {/* ZONE A: Left Editorial Storytelling & CTA (Col 1-4) */}
          <div className="col-span-4 flex flex-col justify-center gap-5 lg:gap-7 z-10">
            {/* Editorial Serif Headline */}
            <div className="space-y-1">
              <h1 className="font-cormorant text-5xl lg:text-6xl xl:text-[4.75rem] 2xl:text-[5.25rem] font-light leading-[0.9] tracking-[-0.03em] text-brand-black">
                Objects<br />
                <span className="italic font-normal">of</span><br />
                Expression
              </h1>
            </div>

            {/* Subtitle & Story Copy */}
            <div className="space-y-2 border-l border-brand-border/80 pl-4 py-0.5">
              <p className="text-[11px] lg:text-xs font-semibold tracking-[0.22em] uppercase text-brand-black">
                ART MEETS STREETWEAR
              </p>
              <p className="text-xs lg:text-[13px] text-brand-muted leading-relaxed font-sans max-w-[290px]">
                Wear what you feel.<br />
                A collection for the ones<br />
                who find beauty in the unfiltered.
              </p>
            </div>

            {/* Dark Rectangular CTA */}
            <div className="pt-1">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-4 bg-brand-black text-brand-bg px-6 lg:px-7 py-3.5 text-[11px] lg:text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 hover:bg-black/85 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2"
                aria-label="Explore the collection in the WASTE shop"
              >
                <span>EXPLORE THE COLLECTION</span>
                <span
                  className="text-sm font-sans transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>

          {/* ZONE B: Central Hero Product (Col 5-9 / 5-8 on compact screens) */}
          <div className="col-span-5 xl:col-span-5 h-full relative flex items-center justify-center min-h-0 px-2">
            {/* Subtle ambient floor depth */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/[0.04] blur-xl rounded-full pointer-events-none"
              aria-hidden="true"
            />
            {/* The Olive-Green T-Shirt Garment */}
            <div className="relative w-full h-full max-h-[580px] lg:max-h-[660px] flex items-center justify-center">
              <img
                src={greenTeeUrl}
                alt="WASTE Olive Green Graphic Streetwear T-shirt"
                className="w-full h-full object-contain object-center drop-shadow-[0_20px_35px_rgba(0,0,0,0.08)] transition-transform duration-700 ease-out hover:scale-[1.015]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* ZONE C: Right Editorial Image Collage & Details (Col 10-12 / 9-12) */}
          <div className="col-span-3 xl:col-span-3 h-full flex items-center justify-end z-10">
            <div className="relative flex flex-col items-end gap-5 max-w-[240px] xl:max-w-[270px] w-full">
              
              {/* Primary Collage Card: Focused Close-Up of Garment Artwork */}
              <div className="relative w-full aspect-[4/5] bg-brand-surface border border-brand-border/70 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.03)] group">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={greenTeeUrl}
                    alt="Close-up detail of chest graphic artwork"
                    className="w-full h-full object-cover object-[center_36%] scale-[2.2] transition-transform duration-700 group-hover:scale-[2.35]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-brand-surface/90 backdrop-blur-sm border border-brand-border/50 text-[9px] font-mono tracking-[0.2em] uppercase text-brand-black">
                  DETAIL / 01
                </div>
              </div>

              {/* Secondary Subordinate Card & Caption Row */}
              <div className="w-full flex items-end justify-between gap-4">
                {/* Editorial Caption */}
                <div className="font-mono text-[9px] xl:text-[10px] leading-[1.35] tracking-[0.22em] text-brand-muted uppercase flex flex-col">
                  <span>SAME</span>
                  <span>CHAOS</span>
                  <span>DIFFERENT</span>
                  <span className="text-brand-black font-semibold">FORM</span>
                </div>

                {/* Smaller Overlapping Monochrome Mood Shot */}
                <div className="relative w-24 xl:w-28 aspect-[3/4] bg-brand-surface border border-brand-border/70 overflow-hidden shadow-sm flex-shrink-0 group">
                  <img
                    src={monochromeMoodUrl}
                    alt="Monochrome archive editorial shot"
                    className="w-full h-full object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1 right-1.5 text-[8px] font-mono tracking-widest text-white/90 drop-shadow-sm uppercase">
                    ARCHIVE
                  </div>
                </div>
              </div>

              {/* Vertical Fine Label */}
              <div className="hidden 2xl:block absolute -left-7 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[8px] font-mono tracking-[0.3em] uppercase text-brand-muted/60 select-none">
                WASTE® EDITION — 2024
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MOBILE VIEWPORT (Under md / 768px):
          Intentional, graceful vertical storytelling tailored for 375px - 430px screens.
          Keeps headline, garment, copy, and CTA perfectly balanced without clutter.
          ========================================================================= */}
      <div className="md:hidden flex flex-col w-full px-5 py-8 sm:px-8 space-y-7">
        
        {/* Mobile Header Metadata */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.24em] uppercase text-brand-muted pb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <span className="font-medium text-brand-black">NEW COLLECTION</span>
            <span className="w-6 h-[1px] bg-brand-border" aria-hidden="true" />
            <span>VOL. 01</span>
          </div>
          <span>WASTE® IN</span>
        </div>

        {/* Mobile Editorial Headline */}
        <div className="space-y-1">
          <h1 className="font-cormorant text-4xl sm:text-5xl font-light leading-[0.92] tracking-[-0.03em] text-brand-black">
            Objects<br />
            <span className="italic font-normal">of</span><br />
            Expression
          </h1>
        </div>

        {/* Mobile Central Focal Garment */}
        <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center my-2">
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/[0.04] blur-lg rounded-full pointer-events-none"
            aria-hidden="true"
          />
          <img
            src={greenTeeUrl}
            alt="WASTE Olive Green Graphic Streetwear T-shirt"
            className="w-full h-full object-contain object-center drop-shadow-[0_16px_28px_rgba(0,0,0,0.08)]"
            loading="eager"
          />
        </div>

        {/* Mobile Subtitle & Copy */}
        <div className="space-y-2 border-l border-brand-border pl-4">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-black">
            ART MEETS STREETWEAR
          </p>
          <p className="text-xs sm:text-[13px] text-brand-muted leading-relaxed font-sans max-w-sm">
            Wear what you feel.<br />
            A collection for the ones who find beauty in the unfiltered.
          </p>
        </div>

        {/* Mobile CTA */}
        <div>
          <Link
            href="/shop"
            className="group flex items-center justify-between w-full bg-brand-black text-brand-bg px-6 py-4 text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black"
            aria-label="Explore the collection in the WASTE shop"
          >
            <span>EXPLORE THE COLLECTION</span>
            <span className="text-sm font-sans" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>

        {/* Mobile Supporting Collage & Editorial Caption */}
        <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-[9px] leading-[1.35] tracking-[0.22em] text-brand-muted uppercase flex flex-col">
              <span>SAME</span>
              <span>CHAOS</span>
              <span>DIFFERENT</span>
              <span className="text-brand-black font-semibold">FORM</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Macro detail thumbnail */}
            <div className="relative w-16 h-20 bg-brand-surface border border-brand-border/70 overflow-hidden flex-shrink-0">
              <img
                src={greenTeeUrl}
                alt="Detail close-up"
                className="w-full h-full object-cover object-[center_36%] scale-[2.4]"
                loading="lazy"
              />
            </div>
            {/* Monochrome archive thumbnail */}
            <div className="relative w-16 h-20 bg-brand-surface border border-brand-border/70 overflow-hidden flex-shrink-0">
              <img
                src={monochromeMoodUrl}
                alt="Monochrome archive"
                className="w-full h-full object-cover grayscale"
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
