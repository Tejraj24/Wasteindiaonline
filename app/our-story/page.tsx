import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Users, Palette, Globe, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getProducts } from "@/lib/services/product.service";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Story — WASTE® | More Than Clothing",
  description:
    "WASTE is a streetwear label born from real people, raw emotions and the beauty in everyday chaos. Rooted in Jaipur, India. Built for the ones who feel.",
  openGraph: {
    title: "Our Story — WASTE® | More Than Clothing",
    description:
      "WASTE is a streetwear label born from real people, raw emotions and the beauty in everyday chaos. Rooted in Jaipur, India.",
    type: "website",
    url: "https://www.wasteluxe.in/our-story",
    images: [
      {
        url: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792962520/OUT-STORY_HEOR_twahsu.jpg",
        width: 1200,
        height: 800,
        alt: "WASTE® — More Than Clothing",
      },
    ],
  },
};

// Verified Authentic Brand Cloudinary Assets
const ASSETS = {
  heroCampaign:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792962520/OUT-STORY_HEOR_twahsu.jpg",
  graphicDetail:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791911772/White_Art_of_Her2_jgatn3.png",
  closingCampaign:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924402/WhatsApp_Image_2026-10-01_at_12.17.13_PM_ihlf30.jpg",
  nightMovement:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924498/WhatsApp_Image_2026-10-01_at_11.16.47_PM_ex9pkk.jpg",
  cultureModel:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797163/Picsart_26-10-12_14-31-46-544_q6xzik.png",
  whiteArtTee:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934533/White_Art_of_Her5_o0r0zg.png",
  blackArtTee:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791935738/Waste_Black_Art_Tee5_uixmnj.png",
  hoodieStructure:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933528/Waste_Black_Hoodie1_uzcz8v.png",
  silhouetteModel:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797197/file_000000005ed48208abf35f02392a64b3.jpg_ibwmtc.jpg",
  founderPortrait:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792962916/FOUNDER-S_ezqclt.jpg",
  studioArchive:
    "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924253/WhatsApp_Image_TOP_toocro.jpg",
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
            alt="WASTE® Streetwear Campaign in Jaipur — More Than Clothing"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          {/* Subtle multi-stop gradient for readable text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />
        </div>

        {/* Top Floating Editorial Metadata Bar */}
        <div className="absolute top-20 sm:top-24 left-0 right-0 z-20">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 md:px-14 flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/75 border-b border-white/15 pb-3">
            <span className="font-semibold text-white">OUR STORY</span>
            <span>JAIPUR, INDIA</span>
          </div>
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
          SECTION 02 — MANIFESTO
          "Same Chaos. Different Form."
          Asymmetrical layout: Wide fabric/graphic print photograph on left,
          warm cream text panel on right with 3 pillars: People, Places, Art.
          ========================================================================= */}
      <section
        id="manifesto"
        className="w-full bg-[#F4F2EB] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
            {/* Left: Wide graphic-print photograph */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full overflow-hidden bg-black/5 border border-[#111111]/15 shadow-sm group">
                <img
                  src={ASSETS.graphicDetail}
                  alt="WASTE Graphic Art & Fabric Detail"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-[#111111]/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#111111]">
                  PRINT 01 // TEXTILE &amp; GRAPHIC FORM
                </div>
              </div>
            </div>

            {/* Right: Warm cream text panel */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-8 sm:space-y-10">
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68] block">
                  01 / MANIFESTO
                </span>
                <h2 className="font-instrument text-4xl sm:text-6xl md:text-7xl font-normal leading-[0.98] tracking-tight text-[#111111]">
                  Same Chaos. <br />
                  <span className="italic">Different Form.</span>
                </h2>
                <p className="text-base sm:text-lg text-[#111111]/80 font-light leading-relaxed max-w-xl pt-2">
                  We create pieces for the ones who feel everything deeper — the
                  late night thinkers, the daydreamers, the ones who find beauty
                  in the unfiltered.
                </p>
              </div>

              {/* Three Information Groups */}
              <div className="space-y-5 pt-4 border-t border-[#111111]/15">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 pb-4 border-b border-[#111111]/10">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                    PEOPLE
                  </span>
                  <span className="text-sm sm:text-base text-[#706E68] font-light">
                    Real stories, real perspectives.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 pb-4 border-b border-[#111111]/10">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                    PLACES
                  </span>
                  <span className="text-sm sm:text-base text-[#706E68] font-light">
                    Cities, streets, and spaces that inspire.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                    ART
                  </span>
                  <span className="text-sm sm:text-base text-[#706E68] font-light">
                    Design that turns thoughts into form.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — OUR ROOTS
          "From India, For the Ones Who Feel."
          Editorial text column on left, large landscape fashion photo in center,
          and two stacked supporting photographs on the right.
          ========================================================================= */}
      <section
        id="roots"
        className="w-full bg-[#FAF8F5] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Editorial Text Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68] block">
                02 / OUR ROOTS
              </span>

              <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-normal leading-[1.0] tracking-tight text-[#111111]">
                From India, <br />
                For the Ones <br />
                <span className="italic">Who Feel.</span>
              </h2>

              <p className="text-base sm:text-lg text-[#111111]/80 font-light leading-relaxed max-w-lg">
                Born in India, built for those who see the world differently.
                Jaipur&apos;s streets, colors, people and contrasts inspire
                everything we create. WASTE is a space where art, streetwear and
                real life collide.
              </p>

              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111] hover:text-[#B89A62] group transition-colors"
                >
                  EXPLORE OUR ROOTS
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Multi-Image Editorial Cluster (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
              {/* Large Landscape Photograph (8 cols of 12) */}
              <div className="sm:col-span-8 relative aspect-[4/5] sm:aspect-[4/5] overflow-hidden bg-black/5 border border-[#111111]/15 group shadow-sm">
                <img
                  src={ASSETS.closingCampaign}
                  alt="WASTE Model on Jaipur Rooftop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <p className="absolute bottom-4 left-4 right-4 font-reenie text-2xl sm:text-3xl text-white drop-shadow-md">
                  Same People Different Stories.
                </p>
              </div>

              {/* Two Stacked Photos (4 cols of 12) */}
              <div className="sm:col-span-4 flex flex-col gap-4 sm:gap-6">
                <div className="relative aspect-square w-full overflow-hidden bg-black/5 border border-[#111111]/15 group shadow-sm">
                  <img
                    src={ASSETS.nightMovement}
                    alt="Jaipur Architecture & Night Shadows"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                    JAIPUR // 01
                  </div>
                </div>

                <div className="relative aspect-square w-full overflow-hidden bg-black/5 border border-[#111111]/15 group shadow-sm">
                  <img
                    src={ASSETS.cultureModel}
                    alt="WASTE Street Culture and Silhouette"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                    STREET // 02
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — THE MAKING
          "Art in Details."
          Text block on left, 4 editorial image panels showing:
          1. Design sketches
          2. Graphic-print / artwork development
          3. Fabric and branding details
          4. Finished garments in studio
          ========================================================================= */}
      <section className="w-full bg-[#F4F2EB] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#111111]/15 pb-8">
            <div className="space-y-3 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68] block">
                03 / THE MAKING
              </span>
              <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.0] tracking-tight text-[#111111]">
                Art in Details.
              </h2>
            </div>

            <div className="max-w-md space-y-4">
              <p className="text-sm sm:text-base text-[#111111]/80 font-light leading-relaxed">
                From concept to final piece, every design is a result of ideas,
                moods, collected references and iterations. Our graphics are
                inspired by the world around us — people, cities, art and the
                contradictions we live in.
              </p>
              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111] hover:text-[#B89A62] group transition-colors"
                >
                  INSIDE THE PROCESS
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Four Process Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Panel 1 */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.whiteArtTee}
                  alt="Design Sketches and Conceptual Drafts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                  01 // SKETCHES
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Concept &amp; Ideation
                </p>
                <p className="text-xs text-[#706E68] font-light">
                  Raw ideas, typography experiments, and reference sketches.
                </p>
              </div>
            </div>

            {/* Panel 2 */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.blackArtTee}
                  alt="Graphic Print and Artwork Development"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                  02 // GRAPHICS
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Print Development
                </p>
                <p className="text-xs text-[#706E68] font-light">
                  Screenprint tests, pigment experiments, and tactile artwork.
                </p>
              </div>
            </div>

            {/* Panel 3 */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.hoodieStructure}
                  alt="Fabric and Structural Texture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                  03 // FABRIC
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Fabric &amp; Details
                </p>
                <p className="text-xs text-[#706E68] font-light">
                  Heavyweight 400+ GSM cotton terry and reinforced seams.
                </p>
              </div>
            </div>

            {/* Panel 4 */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.silhouetteModel}
                  alt="Finished Garments on Studio Rack"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                  04 // SILHOUETTES
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Studio Silhouettes
                </p>
                <p className="text-xs text-[#706E68] font-light">
                  Drop-shoulder box cuts engineered for effortless daily drape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — FOUNDER STORY
          "A Different Perspective."
          Monochrome founder portrait on left with handwritten script accent.
          Editorial copy, handwritten quote, signature, and CTA on right.
          ========================================================================= */}
      <section className="w-full bg-[#FAF8F5] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
            {/* Left: Founder Monochrome Portrait */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 border border-[#111111]/15 shadow-sm group">
                <img
                  src={ASSETS.founderPortrait}
                  alt="Suryansh Meena — Founder of WASTE"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                  <p className="font-reenie text-3xl sm:text-4xl text-white/95 drop-shadow-md">
                    The Person Behind WASTE.
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                    FOUNDER &amp; CREATIVE DIRECTOR
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Founder Narrative & Handwritten Quote */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10">
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68] block">
                  04 / THE FOUNDER
                </span>
                <h2 className="font-instrument text-4xl sm:text-6xl md:text-7xl font-normal leading-[0.98] tracking-tight text-[#111111]">
                  A Different <br />
                  <span className="italic">Perspective.</span>
                </h2>
                <p className="text-base sm:text-lg text-[#111111]/80 font-light leading-relaxed max-w-xl pt-2">
                  WASTE started with a simple idea — to create clothing that
                  speaks. It&apos;s about building a brand for people who think
                  differently, feel deeply and see the world with their own
                  perspective.
                </p>
              </div>

              {/* Handwritten Quote Card */}
              <div className="p-6 sm:p-8 bg-white border border-[#111111]/10 shadow-sm space-y-4 max-w-xl">
                <p className="font-reenie text-2xl sm:text-3xl text-[#111111] leading-snug">
                  “Clothes are just a medium. The real story is the people who
                  wear them.”
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#111111]/10">
                  <div>
                    <p className="font-reenie text-xl text-[#111111]">
                      — Suryansh Meena
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#706E68]">
                      FOUNDER &amp; CREATIVE DIRECTOR, WASTE®
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <a
                  href="mailto:suryanshmeena.in@gmail.com"
                  className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111] hover:text-[#B89A62] group transition-colors"
                >
                  MEET THE FOUNDER
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — OUR VALUES
          "What Drives Us."
          Four equal columns separated by thin vertical dividers:
          1. CREATIVE FREEDOM
          2. PEOPLE FIRST
          3. ART IN EVERYDAY LIFE
          4. A GLOBAL PERSPECTIVE
          ========================================================================= */}
      <section className="w-full bg-[#F4F2EB] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68] block">
              05 / OUR VALUES
            </span>
            <h2 className="font-instrument text-3xl sm:text-4xl md:text-5xl font-normal text-[#111111] tracking-tight">
              What Drives Us.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#111111]/15 pt-4">
            {/* Value 1 */}
            <div className="py-6 sm:py-0 sm:px-6 lg:first:pl-0 space-y-4">
              <div className="w-10 h-10 rounded-full border border-[#111111]/20 flex items-center justify-center text-[#111111]">
                <Sparkles className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                  CREATIVE FREEDOM
                </h3>
                <p className="text-sm text-[#706E68] font-light leading-relaxed">
                  We believe in self-expression without limits.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="py-6 sm:py-0 sm:px-6 space-y-4">
              <div className="w-10 h-10 rounded-full border border-[#111111]/20 flex items-center justify-center text-[#111111]">
                <Users className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                  PEOPLE FIRST
                </h3>
                <p className="text-sm text-[#706E68] font-light leading-relaxed">
                  Inspired by real people and their stories.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="py-6 sm:py-0 sm:px-6 space-y-4">
              <div className="w-10 h-10 rounded-full border border-[#111111]/20 flex items-center justify-center text-[#111111]">
                <Palette className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                  ART IN EVERYDAY LIFE
                </h3>
                <p className="text-sm text-[#706E68] font-light leading-relaxed">
                  Finding beauty in the ordinary and the overlooked.
                </p>
              </div>
            </div>

            {/* Value 4 */}
            <div className="py-6 sm:py-0 sm:px-6 lg:last:pr-0 space-y-4">
              <div className="w-10 h-10 rounded-full border border-[#111111]/20 flex items-center justify-center text-[#111111]">
                <Globe className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                  A GLOBAL PERSPECTIVE
                </h3>
                <p className="text-sm text-[#706E68] font-light leading-relaxed">
                  Rooted in India, made for the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — WASTE IN REAL LIFE
          Horizontal visual strip + "Real People. Real Places. Real Stories. →"
          4 photo tiles + 1 dark contrast card with direct Instagram link.
          ========================================================================= */}
      <section className="w-full bg-[#FAF8F5] border-b border-[#111111]/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-[1600px] space-y-10 sm:space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#706E68] block">
              06 / IN REAL LIFE
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="font-instrument text-3xl sm:text-4xl md:text-5xl font-normal text-[#111111] tracking-tight">
                WASTE in Real Life.
              </h2>
              <p className="text-xs sm:text-sm text-[#706E68] font-light">
                Seen on the streets, worn by the community.
              </p>
            </div>
          </div>

          {/* 5-Tile Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Tile 1 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white border border-[#111111]/15 group">
              <img
                src={ASSETS.hoodieStructure}
                alt="WASTE Lifestyle Street Detail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Tile 2 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white border border-[#111111]/15 group">
              <img
                src={ASSETS.closingCampaign}
                alt="WASTE Model Rooftop Perspective"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Tile 3 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white border border-[#111111]/15 group">
              <img
                src={ASSETS.studioArchive}
                alt="WASTE Community Models"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Tile 4 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white border border-[#111111]/15 group">
              <img
                src={ASSETS.nightMovement}
                alt="WASTE Street Attitude"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Tile 5: Dark Contrast Card */}
            <a
              href="https://instagram.com/wasteindiaonline"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[3/4] bg-[#111111] text-white p-6 sm:p-7 flex flex-col justify-between group border border-black hover:border-[#B89A62] transition-colors"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                COMMUNITY ARCHIVE
              </span>

              <div className="space-y-1">
                <p className="font-reenie text-3xl sm:text-4xl text-white leading-tight group-hover:text-[#B89A62] transition-colors">
                  Real People. <br />
                  Real Places. <br />
                  Real Stories. →
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#B89A62]">
                  @wasteindiaonline
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 group-hover:text-[#B89A62] transition-all" />
              </div>
            </a>
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
