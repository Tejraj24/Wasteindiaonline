import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ProductCollectionStrip } from "@/components/ProductCollectionStrip";
import { BRAND_CONFIG } from "@/lib/config/brand";
import { getProducts } from "@/lib/services/product.service";
import { getHomepageContent } from "@/lib/services/content.service";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Story | WASTE — Contemporary Indian Streetwear",
  description:
    "Founded in 2024 by Suryansh Meena in New Jaipur, WASTE is an independent Indian streetwear brand built around individuality, distinctive silhouettes, and raw graphic culture. Made in India. Built for the world.",
  openGraph: {
    title: "Our Story | WASTE — Contemporary Indian Streetwear",
    description:
      "Founded in 2024 by Suryansh Meena in New Jaipur, WASTE is an independent Indian streetwear brand built around individuality, distinctive silhouettes, and raw graphic culture.",
    type: "website",
    url: "https://wasteindiaonline.vercel.app/our-story",
    images: [
      {
        url: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797220/Picsart_26-10-12_14-49-47-646_ic3wwd.png",
        width: 1200,
        height: 800,
        alt: "WASTE Cinematic Streetwear Archive",
      },
    ],
  },
};

// Verified Authentic Brand Cloudinary Assets
const ASSETS = {
  heroCampaign: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797220/Picsart_26-10-12_14-49-47-646_ic3wwd.png",
  silhouetteModel: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797197/file_000000005ed48208abf35f02392a64b3.jpg_ibwmtc.jpg",
  cultureModel: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797163/Picsart_26-10-12_14-31-46-544_q6xzik.png",
  founderPortrait: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792045424/Suryansh_usdrdt.jpg",
  closingCampaign: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924402/WhatsApp_Image_2026-10-01_at_12.17.13_PM_ihlf30.jpg",
  graphicDetail: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791911772/White_Art_of_Her2_jgatn3.png",
  hoodieStructure: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933528/Waste_Black_Hoodie1_uzcz8v.png",
  nightMovement: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924498/WhatsApp_Image_2026-10-01_at_11.16.47_PM_ex9pkk.jpg",
  studioArchive: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924253/WhatsApp_Image_TOP_toocro.jpg",
  denimJeans: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934989/waste-jeans_gpvjh6.jpg",
  blackArtTee: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791935738/Waste_Black_Art_Tee5_uixmnj.png",
  whiteArtTee: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934533/White_Art_of_Her5_o0r0zg.png",
};

export default async function OurStoryPage() {
  const [products, homepageContent] = await Promise.all([
    getProducts({ limit: 12 }),
    getHomepageContent(),
  ]);

  // Apply visual overrides for featured silhouettes
  const resolvedProducts = products.map((p, idx) => {
    const override =
      homepageContent.featuredOverrides[p.id] ||
      homepageContent.featuredOverrides[`slot-${idx + 1}`];

    return {
      ...p,
      image1: override?.image1 || p.images[0] || "",
      image2: override?.image2 || p.images[1] || p.images[0] || "",
      carouselOverride1: override?.image1,
      carouselOverride2: override?.image2,
    };
  });

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#111111] selection:bg-[#111111] selection:text-[#FAF8F5] overflow-x-hidden">

      {/* =========================================================================
          SECTION 1 — CINEMATIC HERO
          Immersive full-screen campaign photo, bold typography, authentic lead,
          and restrained editorial metadata.
          ========================================================================= */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-end justify-center overflow-hidden bg-[#111111]">
        {/* Cinematic Campaign Photograph */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={ASSETS.heroCampaign}
            alt="WASTE Streetwear Campaign in Jaipur"
            className="w-full h-full object-cover object-[center_35%] grayscale contrast-[1.18] brightness-[0.78]"
            loading="eager"
            decoding="async"
          />
          {/* Subtle multi-stop gradient for readable text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-black/35" />
        </div>

        {/* Floating Top Editorial Metadata Bar */}
        <div className="absolute top-20 sm:top-24 left-0 right-0 z-20">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-[#FAF8F5]/75 border-b border-[#FAF8F5]/15 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-[#FAF8F5] font-semibold">WASTE® ARCHIVE</span>
              <span className="w-6 h-[1px] bg-[#FAF8F5]/30" aria-hidden="true" />
              <span>VOL. 2024</span>
            </div>
            <span>NEW JAIPUR, IN // 28°38&apos;N</span>
          </div>
        </div>

        {/* Hero Narrative Core */}
        <div className="relative z-20 w-full mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12 pb-14 sm:pb-20 md:pb-24 pt-36">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            {/* Tagline */}
            <div className="inline-flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#FAF8F5]/80">
              <span className="w-2 h-2 bg-[#B89A62]" aria-hidden="true" />
              <span>EDITORIAL DOSSIER</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-light uppercase leading-[0.86] tracking-[-0.03em] text-[#FAF8F5]">
                More Than <br />
                <span className="italic font-normal">Clothing.</span>
              </h1>
              <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-[#E8E6E1]/90 tracking-tight pt-1">
                A Point of View.
              </p>
            </div>

            {/* Short Authentic Brand Introduction */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#FAF8F5]/80 leading-relaxed max-w-xl font-normal">
              {BRAND_CONFIG.about.lead}
            </p>

            {/* Action CTA & Scroll Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-8">
              <a
                href="#manifesto"
                className="group inline-flex items-center gap-3 bg-[#FAF8F5] text-[#111111] px-7 py-3.5 text-xs font-mono tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#FFFFFF] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F5]"
              >
                <span>EXPLORE OUR STORY</span>
                <span className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">
                  ↓
                </span>
              </a>

              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FAF8F5]/60">
                SCROLL TO READ // 08 CHAPTERS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — BRAND MANIFESTO
          “Same Chaos. Different Form.” — Asymmetric split layout featuring
          garment craftsmanship and clothing as unfiltered self-expression.
          ========================================================================= */}
      <section
        id="manifesto"
        className="w-full border-b border-[#111111]/10 bg-[#FAF8F5] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

            {/* Left Column: Macro Artwork & Detail Study (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15 shadow-[0_16px_36px_rgba(0,0,0,0.04)] group">
                <img
                  src={ASSETS.graphicDetail}
                  alt="High density screenprint artwork detail"
                  className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 font-mono text-[9px] uppercase tracking-[0.2em] text-[#111111]">
                  STUDY // 01 — TACTILE INK
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#706E68] px-1">
                <span>HIGH-DENSITY SCREENPRINT</span>
                <span>400+ GSM WEAVE</span>
              </div>
            </div>

            {/* Right Column: Manifesto Narrative & Typography (7 cols) */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#706E68]">
                  <span className="text-[#111111] font-semibold">01 // MANIFESTO</span>
                  <span className="w-8 h-[1px] bg-[#111111]/20" aria-hidden="true" />
                  <span>THE PHILOSOPHY</span>
                </div>

                <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem] font-light leading-[0.9] tracking-[-0.03em] uppercase text-[#111111]">
                  Same Chaos. <br />
                  <span className="italic font-normal">Different Form.</span>
                </h2>
              </div>

              <div className="space-y-5 max-w-xl border-l-2 border-[#111111] pl-6 sm:pl-8 py-1">
                <p className="font-editorial text-2xl sm:text-3xl text-[#111111] leading-snug">
                  &ldquo;Clothing is more than just something you wear. It is a way to express who you are, what you believe in, and how you see the world.&rdquo;
                </p>
                <p className="font-sans text-sm sm:text-base text-[#706E68] leading-relaxed font-normal">
                  {BRAND_CONFIG.about.body[1]}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.24em] text-[#706E68]">
                <span className="border border-[#111111]/20 px-3.5 py-1.5 bg-[#FFFFFF]">
                  INDIVIDUALITY
                </span>
                <span className="border border-[#111111]/20 px-3.5 py-1.5 bg-[#FFFFFF]">
                  DISTINCTIVE SILHOUETTES
                </span>
                <span className="border border-[#111111]/20 px-3.5 py-1.5 bg-[#FFFFFF]">
                  RAW EXPRESSION
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — INDIAN ROOTS
          “From India, For the Ones Who Feel.” — Cinematic urban in situ photography
          connecting Jaipur origins to global streetwear consciousness.
          ========================================================================= */}
      <section className="w-full border-b border-[#111111]/10 bg-[#FFFFFF] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#111111]/10 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#706E68]">
                <span className="text-[#111111] font-semibold">02 // ROOTS</span>
                <span className="w-8 h-[1px] bg-[#111111]/20" aria-hidden="true" />
                <span>ORIGIN &amp; PLACE</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light leading-[0.9] tracking-[-0.03em] uppercase text-[#111111]">
                From India, <br />
                <span className="italic font-normal">For the Ones</span> Who Feel.
              </h2>
            </div>

            <div className="max-w-md space-y-2">
              <p className="font-sans text-sm sm:text-base text-[#706E68] leading-relaxed">
                {BRAND_CONFIG.ourStory.paragraphs[2]}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#111111]">
                FOUNDED IN NEW JAIPUR // EST. 2024
              </p>
            </div>
          </div>

          {/* Documentary Photography Spread */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Dominant Urban In-Situ Movement Image (8 cols) */}
            <div className="md:col-span-8 space-y-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF8F5] border border-[#111111]/15 shadow-sm group">
                <img
                  src={ASSETS.closingCampaign}
                  alt="WASTE Streetwear in urban motion"
                  className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  IN SITU // TRANSIT MOMENTUM
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#706E68] px-1">
                <span>STREET ARCHITECTURE</span>
                <span>28°38&apos;N 77°13&apos;E</span>
              </div>
            </div>

            {/* Accent Documentary Image & Origin Note (4 cols) */}
            <div className="md:col-span-4 space-y-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] border border-[#111111]/15 shadow-sm group">
                <img
                  src={ASSETS.nightMovement}
                  alt="Night Transit Movement"
                  className="w-full h-full object-cover grayscale contrast-120 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  NIGHT TRANSIT
                </span>
              </div>

              <div className="border-l border-[#111111]/20 pl-4 py-1 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111] font-semibold">
                  CULTURAL GEOGRAPHY
                </p>
                <p className="font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed">
                  {BRAND_CONFIG.ourStory.paragraphs[3]}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — THE MAKING OF WASTE
          “Art in Details.” — Curated process gallery showing graphic precision,
          hoodie architecture, denim drape, and fabric construction.
          ========================================================================= */}
      <section className="w-full border-b border-[#111111]/10 bg-[#FAF8F5] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#111111]/10 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#706E68]">
                <span className="text-[#111111] font-semibold">03 // PROCESS</span>
                <span className="w-8 h-[1px] bg-[#111111]/20" aria-hidden="true" />
                <span>MATERIAL &amp; EXECUTION</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-light leading-[0.9] tracking-[-0.03em] uppercase text-[#111111]">
                Art in <span className="italic font-normal">Details.</span>
              </h2>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed max-w-md">
              Every garment is an architectural composition. Heavyweight loopback cotton fleece, dropped shoulders, and multi-layered silk screenprints.
            </p>
          </div>

          {/* 4-Panel Process Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

            {/* Detail 1: Screenprint Ink Depth */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.whiteArtTee}
                  alt="High-density screenprint on combed cotton"
                  className="w-full h-full object-cover object-[center_35%] grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  STAGE 01
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Screenprint Architecture
                </p>
                <p className="font-mono text-[10px] text-[#706E68]">
                  MULTI-LAYERED INK / HIGH DENSITY
                </p>
              </div>
            </div>

            {/* Detail 2: Garment Structure */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15 shadow-sm p-4 flex items-center justify-center">
                <img
                  src={ASSETS.hoodieStructure}
                  alt="Heavyweight hoodie structure"
                  className="w-full h-full object-contain grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  STAGE 02
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Loopback Fleece Geometry
                </p>
                <p className="font-mono text-[10px] text-[#706E68]">
                  500 GSM / REINFORCED SEAMS
                </p>
              </div>
            </div>

            {/* Detail 3: Architectural Drape */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.silhouetteModel}
                  alt="Drop-shoulder silhouette drape"
                  className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  STAGE 03
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Drop-Shoulder Drape
                </p>
                <p className="font-mono text-[10px] text-[#706E68]">
                  BOX CUT / PROPORTIONAL DRAPE
                </p>
              </div>
            </div>

            {/* Detail 4: Street In Situ */}
            <div className="space-y-3 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15 shadow-sm">
                <img
                  src={ASSETS.cultureModel}
                  alt="Streetwear in motion"
                  className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  STAGE 04
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Everyday Permanence
                </p>
                <p className="font-mono text-[10px] text-[#706E68]">
                  TESTED FOR WEAR &amp; TRANSIT
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — THE FOUNDER (MANDATORY & PROMINENT)
          “A Different Perspective.” — Authentic, emotional, verified founder section.
          Features Suryansh Meena's portrait, real biography, handwritten note quote,
          and studio enquiry channel.
          ========================================================================= */}
      <section className="w-full border-b border-[#111111]/10 bg-[#FFFFFF] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

            {/* Left Column: Authentic Founder Portrait (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md mx-auto">
                {/* Photographic Print Paper Matting */}
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 pb-6 sm:pb-8 border border-[#111111]/20 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.12)]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15">
                    <img
                      src={ASSETS.founderPortrait}
                      alt="Suryansh Meena, Founder of WASTE"
                      className="h-full w-full object-cover object-[center_20%] grayscale contrast-[1.12] brightness-[0.98]"
                      loading="lazy"
                    />
                  </div>

                  {/* Caption underneath portrait */}
                  <div className="mt-4 pt-3 border-t border-[#111111]/15 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-[#111111]">
                    <span className="font-semibold">{BRAND_CONFIG.founder.name}</span>
                    <span className="text-[#706E68]">{BRAND_CONFIG.founder.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Founder Narrative & Handwritten Note (7 cols) */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#706E68]">
                  <span className="text-[#111111] font-semibold">04 // LEADERSHIP</span>
                  <span className="w-8 h-[1px] bg-[#111111]/20" aria-hidden="true" />
                  <span>THE FOUNDER</span>
                </div>

                <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light leading-[0.9] tracking-[-0.03em] uppercase text-[#111111]">
                  A Different <br />
                  <span className="italic font-normal">Perspective.</span>
                </h2>
              </div>

              {/* Verified Founder Narrative */}
              <div className="space-y-5 max-w-xl font-sans text-sm sm:text-base text-[#706E68] leading-relaxed">
                <p className="text-[#111111] font-medium leading-relaxed">
                  {BRAND_CONFIG.founder.bio}
                </p>
                <p>
                  {BRAND_CONFIG.ourStory.paragraphs[0]}
                </p>
                <p>
                  {BRAND_CONFIG.ourStory.paragraphs[1]}
                </p>
              </div>

              {/* Handwritten Note Callout */}
              <div className="border-l-2 border-[#111111] pl-6 py-2 bg-[#FAF8F5] p-6 max-w-xl border border-r-0 border-y-0 shadow-sm">
                <p className="font-reenie text-3xl sm:text-4xl text-[#111111] leading-tight select-none">
                  &ldquo;Wear what you feel. Stand out rather than fit in.&rdquo;
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#706E68]">
                  — {BRAND_CONFIG.founder.name}, NEW JAIPUR
                </p>
              </div>

              {/* Direct Studio Contact Channel */}
              <div className="pt-2 flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#706E68]">
                <div>
                  <span className="block text-[#111111] font-semibold">STUDIO ENQUIRIES</span>
                  <a
                    href={`mailto:${BRAND_CONFIG.founder.email}`}
                    className="underline lowercase text-xs text-[#111111] hover:text-[#B89A62] transition-colors"
                  >
                    {BRAND_CONFIG.founder.email}
                  </a>
                </div>
                <div className="border-l border-[#111111]/15 pl-6">
                  <span className="block text-[#111111] font-semibold">LOCATION</span>
                  <span className="text-xs text-[#111111]">NEW JAIPUR, INDIA 🇮🇳</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — BRAND VALUES
          Four concise values in a refined horizontal editorial layout:
          Creative Freedom, People First, Art in Everyday Life, A Global Perspective.
          ========================================================================= */}
      <section className="w-full border-b border-[#111111]/10 bg-[#FAF8F5] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#111111]/10 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#706E68]">
                <span className="text-[#111111] font-semibold">05 // VALUES</span>
                <span className="w-8 h-[1px] bg-[#111111]/20" aria-hidden="true" />
                <span>WHAT GUIDES US</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-light leading-[0.9] tracking-[-0.03em] uppercase text-[#111111]">
                Core <span className="italic font-normal">Principles.</span>
              </h2>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#706E68]">
              NO SHORTCUTS // NO COMPROMISE
            </p>
          </div>

          {/* 4 Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

            {/* Value 1 */}
            <div className="space-y-4 border-t border-[#111111] pt-6">
              <span className="font-mono text-xs font-semibold text-[#111111]">01</span>
              <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-tight text-[#111111]">
                Creative Freedom
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed">
                Refusing to fit into pre-existing boxes. Designing garments that prioritize distinctive silhouettes, bold graphic identity, and raw artistic autonomy.
              </p>
            </div>

            {/* Value 2 */}
            <div className="space-y-4 border-t border-[#111111] pt-6">
              <span className="font-mono text-xs font-semibold text-[#111111]">02</span>
              <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-tight text-[#111111]">
                People First
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed">
                Created for a community that chooses individuality over conformity. Clothing built to connect with the ones who find beauty in the unfiltered.
              </p>
            </div>

            {/* Value 3 */}
            <div className="space-y-4 border-t border-[#111111] pt-6">
              <span className="font-mono text-xs font-semibold text-[#111111]">03</span>
              <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-tight text-[#111111]">
                Art in Everyday Life
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed">
                Everyday streetwear treated as an authentic gallery canvas. High-density screenprinted graphics and tactile fabric permanence.
              </p>
            </div>

            {/* Value 4 */}
            <div className="space-y-4 border-t border-[#111111] pt-6">
              <span className="font-mono text-xs font-semibold text-[#111111]">04</span>
              <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-tight text-[#111111]">
                A Global Perspective
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed">
                Proudly conceived, tested, and crafted in India, built with the uncompromising ambition to stand tall on the global streetwear stage.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — WASTE IN REAL LIFE
          Streetwear campaign and documentary archive strip. Varied photographic
          crops celebrating the living garments in transit, light, and motion.
          ========================================================================= */}
      <section className="w-full border-b border-[#111111]/10 bg-[#FFFFFF] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#111111]/10 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#706E68]">
                <span className="text-[#111111] font-semibold">06 // ARCHIVE</span>
                <span className="w-8 h-[1px] bg-[#111111]/20" aria-hidden="true" />
                <span>IN REAL LIFE</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-light leading-[0.9] tracking-[-0.03em] uppercase text-[#111111]">
                Living <span className="italic font-normal">Archive.</span>
              </h2>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#706E68]">
              DELHI &bull; JAIPUR &bull; TRANSIT
            </p>
          </div>

          {/* Documentary Campaign Mosaic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Shot 1 (5 cols) */}
            <div className="lg:col-span-5 relative aspect-[3/4] overflow-hidden bg-[#FAF8F5] border border-[#111111]/15 group">
              <img
                src={ASSETS.silhouetteModel}
                alt="WASTE streetwear fit in natural light"
                className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                CAMPAIGN // 01A
              </span>
            </div>

            {/* Shot 2 & 3 Stack (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F5] border border-[#111111]/15 group">
                <img
                  src={ASSETS.cultureModel}
                  alt="Streetwear attitude"
                  className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  CULTURE // 02B
                </span>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F5] border border-[#111111]/15 group">
                <img
                  src={ASSETS.denimJeans}
                  alt="Architectural denim in motion"
                  className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                  DENIM // 03C
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — FEATURED SILHOUETTES
          Connected to live product catalogue. Frameless, pure white containers,
          actual product data, prices, and links.
          ========================================================================= */}
      <ProductCollectionStrip products={resolvedProducts} />

      {/* =========================================================================
          CLOSING EDITORIAL SPREAD & SHOP ACTION
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] px-6 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36 text-center border-t border-[#111111]/10">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-10">
          <div className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#706E68]">
            <span>END OF STORY</span>
            <span className="w-6 h-[1px] bg-[#111111]/20" aria-hidden="true" />
            <span>BEGINNING OF YOU</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[0.88] tracking-[-0.03em] uppercase text-[#111111]">
            Your Style. <br />
            Your World. <br />
            <span className="italic font-normal">Your WASTE.</span>
          </h2>

          <p className="mx-auto max-w-md font-sans text-xs sm:text-sm text-[#706E68] leading-relaxed">
            The 2024 archive is live. Heavyweight drop-shoulder cotton, loopback fleece hoodies, and screenprinted artworks designed for everyday life.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/shop"
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-3 bg-[#111111] px-9 py-3.5 text-xs font-mono tracking-[0.24em] uppercase text-[#FAF8F5] transition-all duration-300 hover:bg-black/85 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
            >
              <span>EXPLORE THE COLLECTION</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — FOOTER
          Reusing existing storefront footer.
          ========================================================================= */}
      <Footer />

    </main>
  );
}
