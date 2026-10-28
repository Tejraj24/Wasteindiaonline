"use client";

import Link from "next/link";

interface EditorialCollectionSectionProps {
  className?: string;
}

export function EditorialCollectionSection({ className = "" }: EditorialCollectionSectionProps) {
  const productImage =
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792916881/wasteindia/products/l8uw6qwinguh1pw6hzfm.png";

  return (
    <section
      aria-label="Editorial Collection — Drop 02"
      className={`relative w-full bg-[#FFFFFF] text-brand-black border-t border-[#E8E4DA] overflow-hidden select-none ${className}`}
    >
      {/* =========================================================================
          DESKTOP & TABLET VIEWPORT (md and up):
          Spacious editorial spread with balanced whitespace, oversized typography,
          central product showcase, and supporting artwork crop frame.
          ========================================================================= */}
      <div className="hidden md:flex flex-col justify-between min-h-[640px] max-h-[920px] h-[calc(100svh-5rem)] max-w-[1680px] mx-auto px-6 lg:px-12 xl:px-16 py-6 lg:py-8">
        
        {/* Top Minimal Editorial Bar */}
        <div className="w-full flex items-center pb-3 border-b border-[#E8E4DA]/80">
          <div className="flex items-center gap-4 text-[10px] lg:text-[11px] font-mono tracking-[0.26em] uppercase text-brand-muted">
            <span className="font-semibold text-brand-black">WASTE — DROP 02</span>
            <span className="w-8 h-[1px] bg-[#E8E4DA]" aria-hidden="true" />
            <span className="text-[#48533F] font-medium">LIMITED RELEASE</span>
          </div>
        </div>

        {/* Main 3-Zone Asymmetrical Grid */}
        <div className="flex-1 grid grid-cols-12 items-center gap-4 lg:gap-8 xl:gap-12 min-h-0 py-4">
          
          {/* ZONE 1: Left Editorial Storytelling & CTA (Col 1-4) */}
          <div className="col-span-4 flex flex-col justify-center gap-5 lg:gap-7 z-10">
            
            {/* Eyebrow Label with Olive Accent Tag */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[2px] bg-[#48533F]/10 border border-[#48533F]/20 text-[9px] font-mono tracking-[0.24em] uppercase text-[#3B4533] font-medium">
                DROP 02
              </span>
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-brand-muted">
                LOOKBOOK SPREAD
              </span>
            </div>

            {/* Oversized Editorial Serif Headline */}
            <div className="space-y-1">
              <h2 className="font-cormorant text-5xl lg:text-6xl xl:text-[4.75rem] 2xl:text-[5.25rem] font-light leading-[0.9] tracking-[-0.03em] text-brand-black">
                Wear<br />
                <span className="italic font-normal">Your Own</span><br />
                Reality.
              </h2>
            </div>

            {/* Subheading & Editorial Description */}
            <div className="space-y-2 border-l border-[#DCD6C9] pl-4 py-0.5">
              <p className="text-[11px] lg:text-xs font-semibold tracking-[0.22em] uppercase text-brand-black">
                ART MEETS STREETWEAR
              </p>
              <p className="text-xs lg:text-[13px] text-brand-muted leading-relaxed font-sans max-w-[290px]">
                Not made to blend in.<br />
                Made to express what words cannot.
              </p>
            </div>

            {/* Refined Black CTA with Small Arrow */}
            <div className="pt-1">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-4 bg-brand-black text-[#FAF8F3] px-6 lg:px-7 py-3.5 text-[11px] lg:text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 hover:bg-black/85 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2"
                aria-label="Discover the collection in the WASTE shop"
              >
                <span>DISCOVER THE COLLECTION</span>
                <span
                  className="text-sm font-sans transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            </div>

          </div>

          {/* ZONE 2: Central Featured Product Showcase (Col 5-9) */}
          <div className="col-span-5 xl:col-span-5 h-full relative flex items-center justify-center min-h-0 px-2">
            {/* Soft Ambient Depth Shadow */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[88%] h-8 bg-black/[0.04] blur-xl rounded-full pointer-events-none"
              aria-hidden="true"
            />
            {/* Prominent Garment Showcase */}
            <div className="relative w-full h-full max-h-[680px] lg:max-h-[770px] flex items-center justify-center">
              <img
                src={productImage}
                alt="WASTE Drop 02 Streetwear Edition"
                className="w-full h-full object-contain object-center drop-shadow-[0_22px_38px_rgba(0,0,0,0.09)] scale-[1.95] transition-transform duration-700 ease-out hover:scale-[1.98]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* ZONE 3: Right Supporting Frame & Macro Artwork Crop (Col 10-12) */}
          <div className="col-span-3 xl:col-span-3 h-full flex items-center justify-end z-10">
            <div className="relative flex flex-col items-end gap-5 max-w-[195px] xl:max-w-[220px] w-full">
              
              {/* Asymmetric Supporting Artwork Detail Frame */}
              <div className="relative w-full aspect-[4/5] bg-white border border-[#E4DEC3]/80 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.03)] group">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={productImage}
                    alt="Close-up detail of graphic artwork"
                    className="w-full h-full object-cover object-[center_40%] scale-[3.6] transition-transform duration-700 group-hover:scale-[3.8]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-sm border border-[#E8E4DA] text-[9px] font-mono tracking-[0.2em] uppercase text-brand-black">
                  CROP / 02
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[8px] font-mono tracking-[0.16em] uppercase text-[#48533F]">
                  RAW DETAIL
                </div>
              </div>

              {/* Supporting Minimal Caption Row */}
              <div className="w-full flex items-end justify-between border-t border-[#E8E4DA]/60 pt-3">
                <div className="font-mono text-[9px] xl:text-[10px] leading-[1.35] tracking-[0.22em] text-brand-muted uppercase flex flex-col">
                  <span>UNCOMPROMISED</span>
                  <span>HEAVYWEIGHT</span>
                  <span className="text-brand-black font-semibold">IDENTITY</span>
                </div>
                <div className="text-right font-mono text-[9px] tracking-[0.18em] uppercase text-brand-muted">
                  <span>LIMITED</span><br />
                  <span className="text-[#48533F] font-medium">RUN</span>
                </div>
              </div>

              {/* Vertical Fine Label */}
              <div className="hidden 2xl:block absolute -left-7 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[8px] font-mono tracking-[0.3em] uppercase text-brand-muted/60 select-none">
                WASTE ARCHIVE — CHAPTER 02
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MOBILE VIEWPORT (Under md / 768px):
          Intentional, seamless vertical storytelling crafted for handheld screens.
          Balanced typography, central focal garment, clear narrative, and direct CTA.
          ========================================================================= */}
      <div className="md:hidden flex flex-col w-full px-5 py-8 sm:px-8 space-y-7">
        
        {/* Mobile Header Metadata */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.24em] uppercase text-brand-muted pb-3 border-b border-[#E8E4DA]/80">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-black">WASTE — DROP 02</span>
            <span className="w-6 h-[1px] bg-[#E8E4DA]" aria-hidden="true" />
            <span className="text-[#48533F]">NEW DROP</span>
          </div>
          <span>VOL. 02</span>
        </div>

        {/* Mobile Editorial Headline */}
        <div className="space-y-1">
          <h2 className="font-cormorant text-4xl sm:text-5xl font-light leading-[0.92] tracking-[-0.03em] text-brand-black">
            Wear<br />
            <span className="italic font-normal">Your Own</span><br />
            Reality.
          </h2>
        </div>

        {/* Mobile Central Focal Garment */}
        <div className="relative w-full h-[375px] sm:h-[445px] flex items-center justify-center my-2">
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[88%] h-6 bg-black/[0.04] blur-lg rounded-full pointer-events-none"
            aria-hidden="true"
          />
          <img
            src={productImage}
            alt="WASTE Drop 02 Streetwear Edition"
            className="w-full h-full object-contain object-center drop-shadow-[0_16px_30px_rgba(0,0,0,0.09)] scale-[1.70]"
            loading="eager"
          />
        </div>

        {/* Mobile Subtitle & Narrative Copy */}
        <div className="space-y-2 border-l border-[#DCD6C9] pl-4">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-black">
            ART MEETS STREETWEAR
          </p>
          <p className="text-xs sm:text-[13px] text-brand-muted leading-relaxed font-sans max-w-sm">
            Not made to blend in.<br />
            Made to express what words cannot.
          </p>
        </div>

        {/* Mobile CTA */}
        <div>
          <Link
            href="/shop"
            className="group flex items-center justify-between w-full bg-brand-black text-[#FAF8F3] px-6 py-4 text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black"
            aria-label="Discover the collection in the WASTE shop"
          >
            <span>DISCOVER THE COLLECTION</span>
            <span className="text-sm font-sans" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>

        {/* Mobile Supporting Detail Collage & Technical Specs */}
        <div className="pt-4 border-t border-[#E8E4DA]/80 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-[9px] leading-[1.35] tracking-[0.22em] text-brand-muted uppercase flex flex-col">
              <span>UNCOMPROMISED</span>
              <span>HEAVYWEIGHT</span>
              <span className="text-brand-black font-semibold">IDENTITY</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Macro artwork detail thumbnail */}
            <div className="relative w-[52px] h-[66px] bg-white border border-[#E8E4DA] overflow-hidden flex-shrink-0">
              <img
                src={productImage}
                alt="Artwork crop detail"
                className="w-full h-full object-cover object-[center_40%] scale-[3.6]"
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
