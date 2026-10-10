import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { BRAND_CONFIG } from "@/lib/config/brand";

export const metadata: Metadata = {
  title: "Our Story | WASTE®",
  description:
    "Founded in 2024 by Suryansh Meena, WASTE® is an Indian streetwear brand built around individuality, self-expression and modern Indian culture. Made in India. Built for the world.",
  openGraph: {
    title: "Our Story | WASTE®",
    description:
      "WASTE® is an Indian streetwear brand founded in 2024 by Suryansh Meena. Made in India. Built for the world.",
  },
};

const editorialImages = {
  hero: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85",
  craftsmanship: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
  silhouette: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=85",
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Header Spacing & Back Navigation */}
      <div className="mx-auto max-w-[1600px] px-6 pt-32 sm:px-8 md:px-12 md:pt-40">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <BackButton fallbackHref="/" label="Home" variant="default" />
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
            {BRAND_CONFIG.brandName} / Our Story
          </p>
        </div>
      </div>

      {/* SECTION 1 — CINEMATIC HERO */}
      <section className="relative mx-auto max-w-[1600px] px-6 pt-12 pb-20 sm:px-8 md:px-12 md:pt-16 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Est. {BRAND_CONFIG.foundingYear} / India
            </span>
            <h1 className="mt-6 font-editorial text-[clamp(3.5rem,10.5vw,9rem)] leading-[0.84] tracking-[-0.05em] uppercase">
              Made In India.
              <br />
              Built For The
              <br />
              <span className="text-brand-blue">World.</span>
            </h1>
          </div>

          <div className="lg:max-w-md lg:pb-3">
            <p className="text-xs font-light leading-relaxed tracking-wide text-white/75 sm:text-sm sm:leading-7">
              {BRAND_CONFIG.about.lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 border-b border-white pb-2 text-[10px] uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-70"
              >
                <span>Explore the Collection</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                {BRAND_CONFIG.origin} 🇮🇳
              </span>
            </div>
          </div>
        </div>

        {/* Hero Imagery Banner */}
        <div className="relative mt-12 aspect-[16/9] max-h-[700px] w-full overflow-hidden bg-[#111] md:mt-20">
          <img
            src={editorialImages.hero}
            alt="WASTE brand editorial imagery"
            className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/70 md:bottom-10 md:left-10">
            <span>WASTE® Streetwear</span>
            <span className="text-white/30">/</span>
            <span>Est. {BRAND_CONFIG.foundingYear}</span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ABOUT WASTE® */}
      <section className="border-t border-white/15 bg-black py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                01 / About {BRAND_CONFIG.brandName}
              </p>
              <h2 className="mt-6 font-editorial text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.88] tracking-[-0.04em]">
                Refusing to fit into a box.
              </h2>
            </div>

            <div className="space-y-8 text-sm leading-7 text-white/70 md:text-base md:leading-8">
              <p className="font-editorial text-2xl leading-snug text-white/95 md:text-3xl">
                {BRAND_CONFIG.about.body[0]}
              </p>
              <p>{BRAND_CONFIG.about.body[1]}</p>
              <p className="border-l border-brand-blue pl-6 text-white/85">
                {BRAND_CONFIG.about.mission}
              </p>
            </div>
          </div>

          {/* Asymmetric Image Composition */}
          <div className="mt-20 grid gap-6 sm:grid-cols-2 md:mt-28 md:gap-10">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                <img
                  src={editorialImages.craftsmanship}
                  alt="Garment craft and structural fit detail"
                  className="h-full w-full object-cover grayscale transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                Distinctive designs & calculated fits
              </p>
            </div>

            <div className="space-y-4 sm:pt-16 md:pt-24">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                <img
                  src={editorialImages.silhouette}
                  alt="Raw, modern approach to contemporary streetwear"
                  className="h-full w-full object-cover grayscale transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                Strong silhouettes designed for everyday wear
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR STORY */}
      <section className="border-t border-white/15 bg-[#080808] py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                02 / The Genesis
              </p>
              <h2 className="mt-6 font-editorial text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.88] tracking-[-0.04em]">
                Created to feel different.
              </h2>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
                Founded in {BRAND_CONFIG.foundingYear} by {BRAND_CONFIG.founder.name}
              </p>
            </div>

            <div className="space-y-8 text-sm leading-7 text-white/70 md:text-base md:leading-8">
              <p className="font-editorial text-2xl leading-relaxed text-white/90 md:text-3xl">
                {BRAND_CONFIG.ourStory.lead}
              </p>
              {BRAND_CONFIG.ourStory.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — BRAND PHILOSOPHY */}
      <section className="border-t border-white/15 bg-black py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12">
          <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-10 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                03 / Design Philosophy
              </p>
              <h2 className="mt-4 font-editorial text-5xl leading-none tracking-[-0.04em] md:text-7xl">
                The Core Principles.
              </h2>
            </div>
            <p className="max-w-xs text-xs uppercase tracking-[0.18em] text-white/50">
              Individuality, distinctive designs, and modern Indian culture.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-16">
            {BRAND_CONFIG.philosophyPillars.map((pillar) => (
              <div
                key={pillar.number}
                className="flex flex-col justify-between border-t border-white/15 pt-8"
              >
                <div>
                  <span className="font-editorial text-3xl text-brand-blue md:text-4xl">
                    {pillar.number}
                  </span>
                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-white md:text-sm">
                    {pillar.title}
                  </h3>
                  <p className="mt-6 text-xs leading-6 text-white/65 md:text-sm md:leading-7">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-10 text-[9px] uppercase tracking-[0.25em] text-white/30">
                  {pillar.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — MEET THE FOUNDER */}
      <section className="border-t border-white/15 bg-[#080808] py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12">
          <div className="mb-12 border-b border-white/15 pb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
              04 / Leadership
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
            {/* Founder Portrait: Clean, editorial frame without misleading stock photos */}
            <div className="space-y-4">
              {BRAND_CONFIG.founder.portraitUrl ? (
                <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                  <img
                    src={BRAND_CONFIG.founder.portraitUrl}
                    alt={`${BRAND_CONFIG.founder.name} — Founder of WASTE®`}
                    className="h-full w-full object-cover grayscale contrast-110"
                  />
                </div>
              ) : (
                <div className="relative aspect-[3/4] overflow-hidden border border-white/15 bg-[#111] p-8 flex flex-col justify-between text-white/80">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
                    <span>Founder Portrait</span>
                    <span>Est. {BRAND_CONFIG.foundingYear}</span>
                  </div>
                  <div className="text-center py-12">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 font-editorial text-4xl text-brand-blue">
                      SM
                    </div>
                    <p className="mt-6 font-editorial text-2xl tracking-[-0.02em] text-white">
                      {BRAND_CONFIG.founder.name}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
                      {BRAND_CONFIG.founder.role} &mdash; {BRAND_CONFIG.brandName}
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-4 text-center text-[9px] uppercase tracking-[0.2em] text-white/35">
                    Official Portrait Asset To Be Provided
                  </div>
                </div>
              )}
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                {BRAND_CONFIG.founder.name} &mdash; {BRAND_CONFIG.founder.role}
              </p>
            </div>

            {/* Founder Biography */}
            <div className="space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-blue">
                  Founder
                </span>
                <h2 className="mt-3 font-editorial text-4xl leading-tight tracking-[-0.03em] sm:text-5xl md:text-6xl">
                  {BRAND_CONFIG.founder.name}
                </h2>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {BRAND_CONFIG.founder.role} &mdash; {BRAND_CONFIG.brandName}
                </p>
              </div>

              <div className="border-l-2 border-brand-blue pl-6 font-editorial text-2xl leading-relaxed text-white/95 sm:text-3xl sm:leading-snug">
                &ldquo;With a vision to create a distinctive Indian fashion label, leading WASTE®
                with a focus on creativity, individuality and modern streetwear culture.&rdquo;
              </div>

              <div className="space-y-6 text-sm leading-7 text-white/70">
                <p>{BRAND_CONFIG.founder.bio}</p>
                <p>
                  Guided by the conviction that clothing is personal and unapologetic, Suryansh
                  directs the collections with a relentless commitment to silhouette, graphic
                  intensity, and modern cultural relevance.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/50">
                <span>Direct Enquiries:</span>
                <a
                  href={`mailto:${BRAND_CONFIG.founder.email}`}
                  className="text-white hover:text-brand-blue transition-colors underline"
                >
                  {BRAND_CONFIG.founder.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CLOSING CTA */}
      <section className="relative overflow-hidden border-t border-white/15 bg-black py-28 text-center md:py-44">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
            {BRAND_CONFIG.tagline}
          </p>
          <h2 className="mt-6 font-editorial text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.88] tracking-[-0.05em] uppercase">
            This is more than
            <br />
            a clothing brand.
            <br />
            <span className="text-brand-blue">This is WASTE®.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-xs leading-6 tracking-wide text-white/60 md:text-sm">
            Explore the latest drops, bold graphics, and strong silhouettes designed for everyday wear.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center bg-white px-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition-colors duration-300 hover:bg-brand-blue hover:text-white"
            >
              Explore the Collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center border border-white/25 px-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:border-white hover:bg-white/5"
            >
              Contact WASTE®
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
