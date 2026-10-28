import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getProducts } from "@/lib/services/product.service";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Story — WASTE | More Than Clothing",
  description:
    "WASTE is a streetwear label born from real people, raw emotions and the beauty in everyday chaos. Rooted in Jaipur, India. Built for the ones who feel.",
  alternates: {
    canonical: "https://www.wasteluxe.in/our-story",
  },
  openGraph: {
    title: "Our Story — WASTE | More Than Clothing",
    description:
      "WASTE is a streetwear label born from real people, raw emotions and the beauty in everyday chaos. Rooted in Jaipur, India.",
    type: "website",
    url: "https://www.wasteluxe.in/our-story",
    images: [
      {
        url: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792962520/OUT-STORY_HEOR_twahsu.jpg",
        width: 1200,
        height: 800,
        alt: "WASTE — More Than Clothing",
      },
    ],
  },
};

// Verified Authentic Brand Assets
const ASSETS = {
  heroCampaign:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792962520/OUT-STORY_HEOR_twahsu.jpg",
  storyArtwork:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792946812/wasteindia/products/utkv0xbhqrjbinty5xkr.png",
  communityPortrait:
    "https://ik.imagekit.io/d8cunijto/lady-story.jpeg",
  craftSilhouette:
    "https://ik.imagekit.io/d8cunijto/02-IMAGE.jpeg",
  whiteArtTee:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934533/White_Art_of_Her5_o0r0zg.png",
};

export default async function OurStoryPage() {
  const products = await getProducts({ limit: 12 });
  // Select top 6 distinct products for Featured Silhouettes
  const featuredSilhouettes = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#111111] selection:bg-[#111111] selection:text-[#FAF8F5] overflow-x-hidden font-sans">
      {/* =========================================================================
          SECTION 01 — CINEMATIC HERO
          Full-width cinematic fashion photograph with model viewed from behind.
          Dark architectural environment with warm city architecture in background.
          Large, elegant white editorial serif heading aligned left: "More Than Clothing."
          ========================================================================= */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-end justify-center overflow-hidden bg-[#111111]">
        {/* Cinematic Campaign Photograph */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={ASSETS.heroCampaign}
            alt="WASTE Streetwear Campaign in Jaipur — More Than Clothing"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          {/* Subtle multi-stop gradient for readable text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />
        </div>

        {/* Right Vertical Accent Ticker (Desktop) */}
        <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="[writing-mode:vertical-rl] text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 flex items-center gap-6">
            <span>SAME PEOPLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
            <span>SAME PLACES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
            <span>DIFFERENT FORM</span>
          </div>
        </div>

        {/* Hero Narrative Content */}
        <div className="relative z-20 w-full mx-auto max-w-[1600px] px-6 sm:px-10 md:px-14 pb-14 sm:pb-20 md:pb-24 pt-36">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#B89A62]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
              <span>OUR STORY</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-instrument text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-normal leading-[0.92] text-white tracking-tight">
                More Than <br />
                <span className="italic">Clothing.</span>
              </h1>
              <p className="font-reenie text-2xl sm:text-3xl md:text-4xl text-[#B89A62] pt-1">
                Clothes as Expression.
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 font-light leading-relaxed max-w-xl">
              WASTE is a streetwear label born from real people, raw emotions and
              the beauty in everyday chaos. We create pieces that speak, question
              and express—because clothing can be more than just fashion.
            </p>

            {/* CTA */}
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="#manifesto"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 bg-white text-[#111111] text-xs font-mono uppercase tracking-[0.2em] font-semibold hover:bg-[#B89A62] hover:text-white transition-all duration-300"
              >
                EXPLORE OUR STORY
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL STORY — SECTION 01: THE MANIFESTO & ARTWORK
          Editorial 2-column layout pairing brand manifesto with the signature
          WASTE artwork, framed with handwritten annotations.
          ========================================================================= */}
      <section
        id="manifesto"
        className="w-full bg-[#FAF8F5] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: Story Artwork with Luxury Editorial Framing */}
            <div className="lg:col-span-6 order-1">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full bg-[#F4F2EB] border border-[#111111]/15 p-6 sm:p-10 flex items-center justify-center overflow-hidden shadow-sm group">
                {/* Archive Stamp */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-sm border border-[#111111]/15 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#111111]">
                  WASTE — ARCHIVE
                </div>

                {/* Floating Handwritten Script Overlay */}
                <div className="absolute top-6 right-4 sm:right-6 z-20 pointer-events-none">
                  <span className="font-reenie text-2xl sm:text-4xl text-[#111111] -rotate-6 block select-none drop-shadow-sm font-medium">
                    Same Chaos Different Form.
                  </span>
                </div>

                {/* Center Artwork Image */}
                <img
                  src={ASSETS.storyArtwork}
                  alt="WASTE Story Artwork — Same Chaos Different Form"
                  className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out z-10"
                  loading="lazy"
                />

                {/* Bottom Floating Handwritten Caption */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-none">
                  <p className="font-reenie text-xl sm:text-2xl text-[#706E68] rotate-2 select-none">
                    &ldquo;For the ones who feel different.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Brand Manifesto */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 order-2">
              <div className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#B89A62]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
                <span>01 / THE MANIFESTO</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-instrument text-4xl sm:text-6xl lg:text-7xl font-normal leading-[0.98] text-[#111111] tracking-tight">
                  More Than <br />
                  <span className="italic font-instrument">Clothing.</span>
                </h2>
                <p className="font-reenie text-2xl sm:text-3xl text-[#B89A62] select-none -rotate-1">
                  &ldquo;Where chaos meets intention.&rdquo;
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#111111]/80 font-light leading-relaxed max-w-xl">
                <p>
                  WASTE was born out of a refusal to follow the generic cycle.
                  Streetwear is not just cloth stitched together—it is personal
                  architecture, emotional resonance, and a quiet rebellion against mass
                  uniformity.
                </p>
                <p>
                  From the heart of Jaipur, India, we create garments that honor raw
                  human feeling, structural silhouettes, and everyday chaos. Designed
                  for those who live on their own terms.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#111111] text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.22em] font-semibold hover:bg-[#B89A62] hover:text-[#111111] transition-all duration-300 group"
                >
                  EXPLORE THE PIECES
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL STORY — SECTION 02: THE PEOPLE & COMMUNITY
          Golden hour community portrait paired with the manifesto for the
          thinkers, misfits, and dreamers wearing WASTE.
          ========================================================================= */}
      <section className="w-full bg-[#F4F2EB] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: People & Culture Narrative */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#B89A62]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
                <span>02 / THE PEOPLE & CULTURE</span>
              </div>

              <h2 className="font-instrument text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.02] text-[#111111] tracking-tight">
                From India, For The <br />
                <span className="italic font-instrument">Ones Who Feel.</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#111111]/80 font-light leading-relaxed max-w-xl">
                <p>
                  WASTE was never made for mannequins. It was forged for the people
                  walking the real streets—the artists, musicians, writers, night
                  owls, and creators navigating Jaipur, Delhi, Mumbai, and cultural
                  epicenters across the world.
                </p>
                <p>
                  Our community is not defined by conformity. It is bonded by a shared
                  appreciation for depth, authenticity, and non-conformist expression. A
                  piece of clothing becomes valuable only when it is lived in,
                  weathered, and woven into your personal journey.
                </p>
              </div>

              {/* Editorial Rule */}
              <div className="pt-4 border-t border-[#111111]/15 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#706E68]">
                <span>— DIFFERENT PEOPLE. SAME BELONGING.</span>
              </div>
            </div>

            {/* Right Column: Community Portrait with Handwritten Scripts */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#111111]/15 shadow-2xl group bg-[#111111]">
                {/* Top Floating Handwritten Annotation */}
                <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none">
                  <p className="font-reenie text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] -rotate-3 select-none leading-snug">
                    Art. People. Culture. A Better Tomorrow.
                  </p>
                </div>

                {/* Community Photograph */}
                <img
                  src={ASSETS.communityPortrait}
                  alt="WASTE Community and Culture"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Multi-stop gradient for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Bottom Editorial Badge */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/95 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/20">
                    MORE THAN A BRAND. A COMMUNITY.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL STORY — SECTION 03: THE SILHOUETTE & THE CODE
          Showcasing image 03 alongside the 4 creative pillars and the central
          WASTE archive manifesto quote.
          ========================================================================= */}
      <section className="w-full bg-[#FAF8F5] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1600px] space-y-16 lg:space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: Image 03 in Editorial Showcase Frame */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden border border-[#111111]/15 shadow-2xl group bg-[#111111]">
                {/* Top Archival Badge */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/95 backdrop-blur-sm border border-[#111111]/15 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#111111]">
                  03 // SILHOUETTE ARCHIVE
                </div>

                {/* Floating Handwritten Script Overlay */}
                <div className="absolute top-6 right-4 sm:right-6 z-20 pointer-events-none">
                  <p className="font-reenie text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] -rotate-3 select-none leading-snug">
                    Raw Form. True Weight.
                  </p>
                </div>

                {/* The Image */}
                <img
                  src={ASSETS.craftSilhouette}
                  alt="WASTE Silhouette 03 — Form & Architecture"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Multi-stop gradient for readable contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

                {/* Bottom Editorial Badge */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/95 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/20">
                    JAIPUR ATELIER · 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & 4 Code Pillars */}
            <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#B89A62]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
                  <span>03 / THE CODE &amp; SILHOUETTE</span>
                </div>
                <h2 className="font-instrument text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] text-[#111111] tracking-tight">
                  What Defines <span className="italic font-instrument">The Form</span>
                </h2>
                <p className="text-sm sm:text-base text-[#111111]/80 font-light leading-relaxed max-w-xl">
                  Every silhouette at WASTE begins from structural intention. We don&apos;t
                  chase fleeting seasonal trends; we build heavyweight garments that command
                  physical presence and carry personal meaning.
                </p>
              </div>

              {/* 4 Editorial Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                <div className="p-6 sm:p-7 bg-[#F4F2EB] border border-[#111111]/15 space-y-3 hover:border-[#B89A62] transition-colors duration-300">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B89A62]">
                    01 / UNAPOLOGETIC FORM
                  </span>
                  <h3 className="font-instrument text-xl text-[#111111]">
                    Architectural Cut
                  </h3>
                  <p className="text-xs sm:text-sm text-[#706E68] font-light leading-relaxed">
                    Oversized proportions cut from custom 280–400 GSM heavyweight cottons,
                    engineered to drape cleanly with natural movement.
                  </p>
                </div>

                <div className="p-6 sm:p-7 bg-[#F4F2EB] border border-[#111111]/15 space-y-3 hover:border-[#B89A62] transition-colors duration-300">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B89A62]">
                    02 / CLOTHING AS CANVAS
                  </span>
                  <h3 className="font-instrument text-xl text-[#111111]">
                    Raw Expression
                  </h3>
                  <p className="text-xs sm:text-sm text-[#706E68] font-light leading-relaxed">
                    Every print, graphic, and distressed edge is a medium for
                    thought-provoking art, never arbitrary corporate branding.
                  </p>
                </div>

                <div className="p-6 sm:p-7 bg-[#F4F2EB] border border-[#111111]/15 space-y-3 hover:border-[#B89A62] transition-colors duration-300">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B89A62]">
                    03 / COMMUNITY FIRST
                  </span>
                  <h3 className="font-instrument text-xl text-[#111111]">
                    Lived Connection
                  </h3>
                  <p className="text-xs sm:text-sm text-[#706E68] font-light leading-relaxed">
                    Built alongside our wearers. Real stories and lived realities gathered
                    from real streets, fostering belonging without conformity.
                  </p>
                </div>

                <div className="p-6 sm:p-7 bg-[#F4F2EB] border border-[#111111]/15 space-y-3 hover:border-[#B89A62] transition-colors duration-300">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B89A62]">
                    04 / CRAFTED FOR TOMORROW
                  </span>
                  <h3 className="font-instrument text-xl text-[#111111]">
                    Conscious Longevity
                  </h3>
                  <p className="text-xs sm:text-sm text-[#706E68] font-light leading-relaxed">
                    Ethically crafted in Rajasthan with longevity at its core. Silhouettes
                    constructed to outlast fleeting seasonal fads.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Editorial Quote */}
          <div className="p-8 sm:p-14 md:p-20 bg-[#F4F2EB] border border-[#111111]/15 text-center space-y-6 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#B89A62]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
              <span>THE ARCHIVE MANIFESTO</span>
            </div>
            <blockquote className="font-instrument text-2xl sm:text-4xl md:text-5xl italic text-[#111111] max-w-3xl mx-auto leading-snug">
              &ldquo;Clothes are just a medium. The real story is the people who wear them.&rdquo;
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68]">
              — WASTE ATELIER · JAIPUR, INDIA
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL STORY — SECTION 04: A NOTE FROM THE FOUNDER (SURYANSH)
          Positioned at the bottom of the story, a dedicated luxury letter
          section celebrating the founder's vision and philosophy — without photo.
          ========================================================================= */}
      <section
        id="founder"
        className="w-full bg-[#F4F2EB] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[1400px]">
          {/* Archival Letter Card with Double Hairline Framing */}
          <div className="relative bg-[#FAF8F5] border border-[#111111]/15 p-8 sm:p-14 lg:p-20 shadow-sm overflow-hidden">
            {/* Background Watermark Monogram */}
            <div
              className="absolute -right-8 -bottom-12 font-instrument text-[200px] sm:text-[320px] text-[#111111]/[0.03] select-none pointer-events-none leading-none"
              aria-hidden="true"
            >
              W
            </div>

            {/* Top Bar / Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/15 pb-6">
              <div className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#B89A62]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" aria-hidden="true" />
                <span>04 / A LETTER FROM THE FOUNDER</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#706E68] border border-[#111111]/15 px-3 py-1 bg-white">
                  FOUNDER: SURYANSH
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B89A62] border border-[#B89A62]/30 px-3 py-1 bg-white">
                  JAIPUR ATELIER
                </span>
              </div>
            </div>

            {/* Editorial Content Grid */}
            <div className="pt-10 sm:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">
              {/* Left Column: Vision Statement & Headline */}
              <div className="lg:col-span-6 space-y-6">
                <h2 className="font-instrument text-3xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[1.08] text-[#111111] tracking-tight">
                  &ldquo;We don&apos;t create to fit in. We build for the ones who feel{" "}
                  <span className="italic font-instrument">every rough edge.</span>&rdquo;
                </h2>

                <p className="font-reenie text-2xl sm:text-3xl text-[#B89A62] select-none -rotate-1">
                  &ldquo;Individuality is never wasted.&rdquo;
                </p>

                <div className="pt-4 hidden lg:block">
                  <div className="w-16 h-px bg-[#111111]/20" />
                </div>
              </div>

              {/* Right Column: Personal Narrative & Signature */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-4 text-sm sm:text-base text-[#111111]/85 font-light leading-relaxed">
                  <p>
                    When I started WASTE in Jaipur, the intention was never to churn
                    out graphic tees for seasonal algorithms. It began from a visceral
                    restlessness—a refusal to accept the soulless, disposable cycle that
                    modern fashion has become.
                  </p>
                  <p>
                    I wanted to craft clothing with weight—both physical and emotional.
                    Custom 280–400 GSM cottons, architectural silhouettes that hold
                    their shape without apology, and graphics born from real internal
                    dialogues, urban contradictions, and human vulnerability.
                  </p>
                  <p>
                    To everyone who wears WASTE: this isn&apos;t just fabric you put
                    on. It is a shared perspective. Wear it hard, live your truth in
                    it, and never let anyone dilute who you are.
                  </p>
                </div>

                {/* Founder Signature Lockup */}
                <div className="pt-6 border-t border-[#111111]/15 flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="font-reenie text-4xl sm:text-5xl text-[#111111] -rotate-2 select-none">
                      Suryansh
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] font-semibold text-[#111111]">
                      Suryansh
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#706E68]">
                      Founder &amp; Creative Director
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B89A62]">
                      WASTE ATELIER
                    </p>
                    <p className="font-mono text-[10px] text-[#706E68]">
                      Jaipur, Rajasthan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Archive Motto */}
            <div className="mt-12 pt-6 border-t border-[#111111]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.25em] text-[#706E68] relative z-10">
              <span>— SAME PEOPLE. NEW STORIES.</span>
              <span>JAIPUR · INDIA · 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — FEATURED SILHOUETTES
          Clean product strip with real database catalog items + prices + links.
          ========================================================================= */}
      <section className="w-full bg-[#FAF8F5] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-[1600px] space-y-10 sm:space-y-12">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#111111]/15 pb-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#111111]">
              07 / FEATURED SILHOUETTES
            </span>
            <Link
              href="/shop"
              className="font-mono text-xs uppercase tracking-[0.2em] font-medium text-[#111111] hover:text-[#B89A62] transition-colors inline-flex items-center gap-1.5"
            >
              EXPLORE COLLECTION
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Silhouettes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {featuredSilhouettes.map((product) => {
              const displayImage =
                product.images?.[0] ||
                ASSETS.whiteArtTee;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block space-y-3"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-[#111111]/10 transition-shadow duration-300 group-hover:shadow-md">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans text-xs uppercase font-medium tracking-wide text-[#111111] line-clamp-1 group-hover:text-[#B89A62] transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-mono text-xs text-[#706E68]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Existing shared Footer preserved */}
      <Footer />
    </main>
  );
}
