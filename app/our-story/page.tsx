import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { ProductCollectionStrip } from "@/components/ProductCollectionStrip";
import { InstagramEditorialCollage } from "@/components/InstagramEditorialCollage";
import { BRAND_CONFIG } from "@/lib/config/brand";
import { getProducts } from "@/lib/services/product.service";
import { getHomepageContent } from "@/lib/services/content.service";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Story | WASTE — Contemporary Streetwear",
  description:
    "Founded in 2024 by Suryansh Meena in New Jaipur, WASTE is an independent Indian streetwear brand built around individuality, distinctive silhouettes, and raw graphic culture. Made in India. Built for the world.",
  openGraph: {
    title: "Our Story | WASTE — Contemporary Streetwear",
    description:
      "Founded in 2024 by Suryansh Meena in New Jaipur, WASTE is an independent Indian streetwear brand built around individuality, distinctive silhouettes, and raw graphic culture.",
    type: "website",
    url: "https://wasteindiaonline.vercel.app/our-story",
    images: [
      {
        url: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797220/Picsart_26-10-12_14-49-47-646_ic3wwd.png",
        width: 1200,
        height: 800,
        alt: "WASTE 90s Editorial Archive",
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
    <main className="min-h-screen bg-[#F5F0E6] text-[#111111] selection:bg-[#111111] selection:text-[#FFFFFF] overflow-x-hidden">
      {/* =========================================================================
          MAGAZINE MASTHEAD & REGISTRATION HEADER
          ========================================================================= */}
      <div className="w-full pt-20 sm:pt-24 border-b-2 border-[#111111] bg-[#FFFFFF]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 py-3 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#111111]">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/" label="Home" variant="breadcrumb" />
            <span>/</span>
            <span className="font-bold">EDITORIAL // ISSUE 01</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span>VOL. 2024</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">NEW Jaipur, IN</span>
            <span>|</span>
            <span>PRICE: UNAPOLOGETIC</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO — THE MAGAZINE COVER
          Oversized WASTE wordmark, headline “BEYOND THE FIT.”, supporting copy:
          “Not made to fit in.”, large framed campaign photograph, archival metadata.
          ========================================================================= */}
      <section className="relative w-full border-b-2 border-[#111111] bg-[#F5F0E6] px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1600px]">
          {/* Top Registration Bar */}
          <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#111111] pb-6 border-b-2 border-[#111111] mb-8 sm:mb-12">
            <span>[+] 28°38&apos;N 77°13&apos;E</span>
            <span className="font-bold">WASTE / INDIA / EST. {BRAND_CONFIG.foundingYear}</span>
            <span>PLATE NO. 001 [+]</span>
          </div>

          {/* Magazine Cover Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Typography Block (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Massive Brand Name */}
              <div className="inline-block border-2 border-[#111111] bg-[#FFFFFF] px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#111111] shadow-[3px_3px_0px_#111111]">
                WASTE MAGAZINE ARCHIVE
              </div>

              <div>
                <h1 className="font-editorial text-[clamp(3.5rem,11vw,9rem)] leading-[0.84] tracking-[-0.04em] uppercase text-[#111111]">
                  BEYOND <br />
                  <span className="italic font-normal">THE</span> FIT.
                </h1>
              </div>

              {/* Supporting Editorial Statement */}
              <div className="border-l-4 border-[#111111] pl-6 py-2 space-y-3">
                <p className="font-editorial text-2xl sm:text-3xl md:text-4xl text-[#111111] leading-tight">
                  &ldquo;Not made to fit in.&rdquo;
                </p>
                <p className="font-sans text-xs sm:text-sm font-medium leading-relaxed text-[#111111] max-w-lg">
                  {BRAND_CONFIG.about.lead}
                </p>
              </div>

              {/* Call to action & Print specs */}
              <div className="pt-2 flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111]">
                <a
                  href="#chapter-01"
                  className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#111111] text-[#FFFFFF] px-5 py-2.5 shadow-[3px_3px_0px_#111111] hover:bg-[#FFFFFF] hover:text-[#111111] transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span>READ ARCHIVE</span>
                  <span>↓</span>
                </a>
                <span className="border border-[#111111] px-3 py-2 bg-[#FFFFFF]">
                  PAPER SPEC: 180 GSM UNCOATED
                </span>
              </div>
            </div>

            {/* Right: Large Framed Campaign Photo (5 cols) */}
            <div className="lg:col-span-5">
              {/* Neo-Brutalist Framed Print Plate */}
              <div className="relative border-2 border-[#111111] bg-[#FFFFFF] p-3 sm:p-5 shadow-[6px_6px_0px_#111111] md:shadow-[10px_10px_0px_#111111] md:-rotate-1 transition-transform hover:rotate-0 duration-300">
                {/* Photo Matting Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-[#111111] bg-[#F5F0E6]">
                  <img
                    src={ASSETS.heroCampaign}
                    alt="WASTE Campaign Cover Look"
                    className="h-full w-full object-cover grayscale contrast-125"
                    loading="eager"
                  />
                  {/* Stamp in Photo Corner */}
                  <div className="absolute top-3 left-3 border border-[#111111] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#111111]">
                    COVER / FIG. 01
                  </div>
                </div>

                {/* Archival Caption Strip */}
                <div className="mt-4 pt-3 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[#111111]">
                  <span>Jaipur STREETSCAPE // 2024</span>
                  <span>ORIGINAL PRINT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 01 — THE IDEA
          Headline: “NOT HERE TO BLEND IN.”
          Dominant campaign image with thick visible frame and small archival caption.
          One or two short sentences from verified content.
          ========================================================================= */}
      <section
        id="chapter-01"
        className="w-full border-b-2 border-[#111111] bg-[#FFFFFF] px-4 py-16 sm:px-6 sm:py-24 md:px-12 md:py-32"
      >
        <div className="mx-auto max-w-[1600px]">
          {/* Chapter Label */}
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#111111] mb-6 flex items-center gap-3">
            <span className="inline-block w-4 h-4 bg-[#111111]" />
            <span>CHAPTER 01 // THE IDEA</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Headline & Short Statement (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-editorial text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.88] tracking-[-0.04em] uppercase text-[#111111]">
                Not Here <br />
                To Blend In.
              </h2>

              {/* Exact Verified Copy: 1-2 Sentences */}
              <div className="border-2 border-[#111111] bg-[#F5F0E6] p-6 shadow-[5px_5px_0px_#111111] space-y-4">
                <p className="font-sans text-xs sm:text-sm font-medium leading-relaxed text-[#111111]">
                  WASTE was created with a clear intention: to build an Indian streetwear brand that represents a new generation refusing to fit into a box.
                </p>
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#111111]">
                  We believe clothing is more than just something you wear—it is a way to express who you are, what you believe in, and how you see the world.
                </p>
              </div>

              <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#111111] pt-2">
                STATEMENT ARCHIVE // FILE REF: 2024-WST
              </div>
            </div>

            {/* Right Dominant Framed Image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="border-2 border-[#111111] bg-[#F5F0E6] p-4 sm:p-6 shadow-[8px_8px_0px_#111111]">
                <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-[#111111] bg-[#FFFFFF]">
                  <img
                    src={ASSETS.cultureModel}
                    alt="WASTE The Idea — Campaign Image"
                    className="h-full w-full object-cover grayscale contrast-125"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 right-3 border border-[#111111] bg-[#F5F0E6] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#111111]">
                    PLATE // CH-01
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#111111]">
                  <span>FIG. 02 // ATTITUDE IN SITU</span>
                  <span>Jaipur ARCHIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02 — THE UNIFORM
          Headline: “WEAR YOUR POINT OF VIEW.”
          Asymmetrical photo collage inspired by vintage contact sheets and 90s zines.
          Mix large portrait photographs with smaller framed details and streetwear looks.
          ========================================================================= */}
      <section className="w-full border-b-2 border-[#111111] bg-[#F5F0E6] px-4 py-16 sm:px-6 sm:py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#111111] pb-6 mb-12 sm:mb-16 gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#111111] block mb-2">
                CHAPTER 02 // CONTACT SHEET
              </span>
              <h2 className="font-editorial text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-[#111111]">
                Wear Your <br />
                Point Of View.
              </h2>
            </div>

            <div className="border border-[#111111] bg-[#FFFFFF] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#111111] shadow-[3px_3px_0px_#111111]">
              PROOF SHEET // 04 PRINTS
            </div>
          </div>

          {/* Contact Sheet Asymmetrical Collage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Frame 1: Tall Streetwear Look (5 cols, slightly rotated) */}
            <div className="lg:col-span-5 border-2 border-[#111111] bg-[#FFFFFF] p-4 shadow-[6px_6px_0px_#111111] md:-rotate-1 transition-transform hover:rotate-0 duration-300">
              <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-[#111111] bg-[#F5F0E6]">
                <img
                  src={ASSETS.silhouetteModel}
                  alt="WASTE Silhouette Fit"
                  className="h-full w-full object-cover grayscale contrast-125"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 border border-[#111111] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[8px] tracking-widest text-[#111111]">
                  SHOT 01A
                </span>
              </div>
              <div className="mt-3 pt-2 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                <span>SILHOUETTE DRAPE</span>
                <span>400+ GSM</span>
              </div>
            </div>

            {/* Frame 2 & 3: Right Side Stack (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Print Detail Card */}
                <div className="border-2 border-[#111111] bg-[#FFFFFF] p-4 shadow-[6px_6px_0px_#111111] md:rotate-1 transition-transform hover:rotate-0 duration-300">
                  <div className="relative aspect-square w-full overflow-hidden border-2 border-[#111111] bg-[#F5F0E6]">
                    <img
                      src={ASSETS.graphicDetail}
                      alt="High Density Screenprint Macro"
                      className="h-full w-full object-cover grayscale contrast-125"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 border border-[#111111] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[8px] tracking-widest text-[#111111]">
                      SHOT 02B
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                    <span>MACRO SCREENPRINT</span>
                    <span>DETAIL</span>
                  </div>
                </div>

                {/* Hoodie Structure Card */}
                <div className="border-2 border-[#111111] bg-[#FFFFFF] p-4 shadow-[6px_6px_0px_#111111]">
                  <div className="relative aspect-square w-full overflow-hidden border-2 border-[#111111] bg-[#F5F0E6] p-2">
                    <img
                      src={ASSETS.hoodieStructure}
                      alt="Heavyweight Hoodie Structure"
                      className="h-full w-full object-contain grayscale contrast-125"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 border border-[#111111] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[8px] tracking-widest text-[#111111]">
                      SHOT 03C
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                    <span>HOOD ANATOMY</span>
                    <span>STRUCTURE</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Wide Contact Frame */}
              <div className="border-2 border-[#111111] bg-[#FFFFFF] p-4 shadow-[6px_6px_0px_#111111]">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-[#111111] bg-[#F5F0E6]">
                  <img
                    src={ASSETS.nightMovement}
                    alt="Night Transit Jaipur"
                    className="h-full w-full object-cover grayscale contrast-125"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 border border-[#111111] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[8px] tracking-widest text-[#111111]">
                    SHOT 04D
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#111111]">
                  <span>NIGHT MOVEMENT // AFTER HOURS</span>
                  <span>Jaipur METRO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03 — ROOTED HERE
          Headline: “MADE IN INDIA. BUILT FOR THE WORLD.”
          Real WASTE imagery and verified brand information.
          Editorial manifesto statement, not a corporate mission page.
          ========================================================================= */}
      <section className="w-full border-b-2 border-[#111111] bg-[#FFFFFF] px-4 py-16 sm:px-6 sm:py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Framed Spread (5 cols) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="border-2 border-[#111111] bg-[#F5F0E6] p-4 sm:p-6 shadow-[8px_8px_0px_#111111] md:rotate-1 transition-transform hover:rotate-0 duration-300">
                <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-[#111111] bg-[#FFFFFF]">
                  <img
                    src={ASSETS.closingCampaign}
                    alt="WASTE Urban In Situ Movement"
                    className="h-full w-full object-cover grayscale contrast-125"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 border border-[#111111] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#111111]">
                    PLATE // CH-03
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[#111111]">
                  <span>IN SITU // TRANSIT MOMENTUM</span>
                  <span>28°38&apos;N</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Manifesto (7 cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 sm:space-y-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#111111] flex items-center gap-3">
                <span className="inline-block w-4 h-4 bg-[#111111]" />
                <span>CHAPTER 03 // CULTURAL ROOTS</span>
              </div>

              <h2 className="font-editorial text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-[#111111]">
                Made In India. <br />
                <span className="italic font-normal">Built For The World.</span>
              </h2>

              <div className="border-2 border-[#111111] bg-[#F5F0E6] p-6 sm:p-8 shadow-[6px_6px_0px_#111111] space-y-4">
                <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#111111]">
                  {BRAND_CONFIG.tagline}
                </p>
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#111111]">
                  {BRAND_CONFIG.ourStory.paragraphs[2]}
                </p>
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#111111]">
                  {BRAND_CONFIG.ourStory.paragraphs[3]}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] uppercase tracking-[0.24em] text-[#111111]">
                <span className="border border-[#111111] px-3 py-1.5 bg-[#FFFFFF]">
                  FOUNDED: {BRAND_CONFIG.foundingYear}
                </span>
                <span className="border border-[#111111] px-3 py-1.5 bg-[#FFFFFF]">
                  ORIGIN: Jaipur, INDIA
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04 — THE PEOPLE BEHIND IT
          Include existing founder/origin story only using verified facts.
          Founder name: Suryansh Meena. Est. 2024. New Jaipur.
          Never invent claims. Display in strong framed composition.
          ========================================================================= */}
      <section className="w-full border-b-2 border-[#111111] bg-[#F5F0E6] px-4 py-16 sm:px-6 sm:py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Founder Portrait & Details (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center py-4 sm:py-6 lg:py-8">
              {/* Single Tilted Editorial Photo Frame (Printed Photographic Paper Aesthetic) */}
              <div className="mx-auto w-[220px] sm:w-[250px] md:w-[265px] lg:w-[260px] xl:w-[280px] -rotate-[2.5deg] motion-reduce:rotate-0 transition-transform duration-300 hover:rotate-0">
                <div className="bg-[#FAF8F5] p-3 sm:p-3.5 pb-4 sm:pb-5 border border-[#111111]/20 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.18),0_6px_16px_-4px_rgba(0,0,0,0.08)]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#111111]/15">
                    <img
                      src={ASSETS.founderPortrait}
                      alt="Suryansh Meena, founder of WASTE"
                      className="h-full w-full object-cover object-[center_20%] grayscale contrast-[1.12] brightness-[0.98] select-none"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Founder Name, Role, Location directly on Warm Cream Canvas */}
              <div className="mt-6 sm:mt-7 space-y-1">
                <h3 className="font-editorial text-3xl sm:text-4xl uppercase tracking-tight text-[#111111]">
                  {BRAND_CONFIG.founder.name}
                </h3>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#111111]">
                  {BRAND_CONFIG.founder.role} &mdash; {BRAND_CONFIG.brandName}
                </p>
                <p className="font-mono text-xs text-[#111111]/75">
                  NEW Jaipur, INDIA
                </p>
              </div>
            </div>

            {/* Right Verified Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#111111] flex items-center gap-3">
                <span className="inline-block w-4 h-4 bg-[#111111]" />
                <span>CHAPTER 04 // LEADERSHIP</span>
              </div>

              <h2 className="font-editorial text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-[#111111]">
                The People Behind It.
              </h2>

              <div className="border-l-4 border-[#111111] pl-6 py-2 space-y-3 bg-[#FFFFFF] border-2 border-r-2 border-y-2 p-6 shadow-[5px_5px_0px_#111111]">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#111111] font-bold">
                  DIRECT STATEMENT
                </p>
                <p className="font-editorial text-xl sm:text-2xl leading-snug text-[#111111]">
                  &ldquo;{BRAND_CONFIG.founder.bio}&rdquo;
                </p>
              </div>

              <div className="border-2 border-[#111111] bg-[#FFFFFF] p-6 shadow-[5px_5px_0px_#111111] space-y-3 font-sans text-xs sm:text-sm text-[#111111] leading-relaxed">
                <p>
                  {BRAND_CONFIG.ourStory.lead}
                </p>
                <p>
                  {BRAND_CONFIG.ourStory.paragraphs[1]}
                </p>
              </div>

              {/* Verified Contact Details in Brutalist Box */}
              <div className="border-2 border-[#111111] bg-[#FFFFFF] p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#111111]">
                <div>
                  <span className="block font-bold">STUDIO ENQUIRIES</span>
                  <a
                    href={`mailto:${BRAND_CONFIG.founder.email}`}
                    className="underline text-xs lowercase mt-0.5 block hover:opacity-75 transition-opacity"
                  >
                    {BRAND_CONFIG.founder.email}
                  </a>
                </div>
                <div>
                  <span className="block font-bold">LOCATION</span>
                  <span className="text-xs mt-0.5 block">NEW Jaipur, INDIA 🇮🇳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CHAPTER — THE MAGAZINE SPREAD
          Bold final magazine-spread layout with the WASTE identity,
          one strong photograph, and a clear EXPLORE THE COLLECTION link to shop.
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] px-4 py-20 sm:px-6 sm:py-28 md:px-12 md:py-36 text-center">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
          {/* Issue Sign-Off Badge */}
          <div className="inline-block border-2 border-[#111111] bg-[#F5F0E6] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#111111] shadow-[3px_3px_0px_#111111]">
            ISSUE 01 // CLOSING SPREAD
          </div>

          <h2 className="font-editorial text-[clamp(3rem,9vw,8rem)] leading-[0.84] tracking-[-0.04em] uppercase text-[#111111]">
            Your Style. <br />
            Your World. <br />
            <span className="italic font-normal">Your WASTE.</span>
          </h2>

          <p className="mx-auto max-w-md font-sans text-xs sm:text-sm font-medium leading-relaxed text-[#111111]">
            The 2024 archive is live. Distinctive heavyweight silhouettes and screenprinted artworks designed for everyday life.
          </p>

          {/* Hard-Edged Physical Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/shop"
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-3 border-2 border-[#111111] bg-[#111111] px-10 text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#FFFFFF] shadow-[5px_5px_0px_#111111] hover:bg-[#FFFFFF] hover:text-[#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <span>EXPLORE THE COLLECTION</span>
              <span>→</span>
            </Link>
          </div>

          {/* Registration Footer Marker */}
          <div className="pt-12 border-t-2 border-[#111111] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[#111111]">
            <span>END OF ISSUE 01</span>
            <span>&bull;</span>
            <span>WASTE EDITORIAL PRINT // Jaipur</span>
            <span>&bull;</span>
            <span>[+] REG. OK</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED SILHOUETTES CAROUSEL
          ========================================================================= */}
      <ProductCollectionStrip products={resolvedProducts} />

      {/* =========================================================================
          SOCIAL ARCHIVE — @WASTEINDIA
          ========================================================================= */}
      <InstagramEditorialCollage />

      {/* Shared Storefront Footer */}
      <Footer />
    </main>
  );
}
