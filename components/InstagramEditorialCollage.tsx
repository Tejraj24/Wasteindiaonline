"use client";

import { BRAND_CONFIG } from "@/lib/config/brand";

export interface InstagramEditorialTile {
  id: string;
  title: string;
  image: string;
  postUrl?: string;
  sizeClass: string;
  aspectClass: string;
  tag: string;
}

// Configurable data-driven editorial social archive
const TRACK_ONE_TILES: InstagramEditorialTile[] = [
  {
    id: "ig-01",
    title: "Delhi Street Campaign Look 01",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797220/Picsart_26-10-12_14-49-47-646_ic3wwd.png",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[260px] sm:w-[320px] md:w-[380px]",
    aspectClass: "aspect-[3/4]",
    tag: "CAMPAIGN // LOOK 01",
  },
  {
    id: "ig-02",
    title: "Macro Screenprint Study",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791911772/White_Art_of_Her2_jgatn3.png",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[190px] sm:w-[230px] md:w-[270px]",
    aspectClass: "aspect-[1/1]",
    tag: "STUDY // HIGH-DENSITY INK",
  },
  {
    id: "ig-03",
    title: "Silhouette Study in Natural Light",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797197/file_000000005ed48208abf35f02392a64b3.jpg_ibwmtc.jpg",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[180px] sm:w-[220px] md:w-[260px]",
    aspectClass: "aspect-[9/16]",
    tag: "SILHOUETTE // FORM",
  },
  {
    id: "ig-04",
    title: "Urban Movement in Situ",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924402/WhatsApp_Image_2026-10-01_at_12.17.13_PM_ihlf30.jpg",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[290px] sm:w-[360px] md:w-[440px]",
    aspectClass: "aspect-[16/10]",
    tag: "IN SITU // TRANSIT",
  },
  {
    id: "ig-05",
    title: "Reflections Rear Panel Artwork",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791935738/Waste_Black_Art_Tee5_uixmnj.png",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[210px] sm:w-[260px] md:w-[310px]",
    aspectClass: "aspect-[4/5]",
    tag: "GRAPHIC // REAR PANEL",
  },
];

const TRACK_TWO_TILES: InstagramEditorialTile[] = [
  {
    id: "ig-06",
    title: "Delhi Streetscape Motion",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797163/Picsart_26-10-12_14-31-46-544_q6xzik.png",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[190px] sm:w-[230px] md:w-[270px]",
    aspectClass: "aspect-[9/16]",
    tag: "DELHI // 28°38'N",
  },
  {
    id: "ig-07",
    title: "Night Archive Transit Study",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924498/WhatsApp_Image_2026-10-01_at_11.16.47_PM_ex9pkk.jpg",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[300px] sm:w-[380px] md:w-[460px]",
    aspectClass: "aspect-[16/10]",
    tag: "NIGHT ARCHIVE // 024",
  },
  {
    id: "ig-08",
    title: "Architectural Hoodie Structure",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933532/Waste_Black_Hoodie2_fvgpja.png",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[190px] sm:w-[230px] md:w-[270px]",
    aspectClass: "aspect-[1/1]",
    tag: "FLEECE // HOOD ANATOMY",
  },
  {
    id: "ig-09",
    title: "Monochrome Editorial Portrait",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791881073/file_0000000073748211bf37ba309647258e.jpg_ajebtr.jpg",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[240px] sm:w-[300px] md:w-[360px]",
    aspectClass: "aspect-[3/4]",
    tag: "PORTRAIT // PERSPECTIVE",
  },
  {
    id: "ig-10",
    title: "Relaxed Wide-Leg Denim Cut",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791934989/waste-jeans_gpvjh6.jpg",
    postUrl: BRAND_CONFIG.socials.instagram.url,
    sizeClass: "w-[210px] sm:w-[260px] md:w-[310px]",
    aspectClass: "aspect-[4/5]",
    tag: "DRAPE // FOOTWEAR BREAK",
  },
];

interface InstagramEditorialCollageProps {
  customTilesTrack1?: InstagramEditorialTile[];
  customTilesTrack2?: InstagramEditorialTile[];
}

export function InstagramEditorialCollage({
  customTilesTrack1 = TRACK_ONE_TILES,
  customTilesTrack2 = TRACK_TWO_TILES,
}: InstagramEditorialCollageProps) {
  const instagramUrl = BRAND_CONFIG.socials.instagram.url;
  const instagramHandle = BRAND_CONFIG.socials.instagram.handle;

  return (
    <section
      aria-label="WASTE In Motion — Editorial Instagram Collage"
      className="relative w-full border-t border-brand-border bg-brand-surface py-20 sm:py-28 md:py-36 overflow-hidden"
    >
      {/* Editorial Header */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 mb-12 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brand-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-gold">
                SOCIAL ARCHIVE // {instagramHandle.toUpperCase()}
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl uppercase tracking-[-0.03em] text-brand-black">
              WASTE In Motion
            </h2>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-brand-black border border-brand-border bg-brand-bg px-4 py-2 hover:border-brand-black transition-colors"
          >
            <span>Follow {instagramHandle}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* Collage Ribbon Container */}
      <div className="relative w-full space-y-6 sm:space-y-8 overflow-hidden">
        {/* Subtle Side Fade Vignettes */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-brand-surface to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-brand-surface to-transparent" />

        {/* ----------------- TRACK 1: Slow Drift Forward (Leftwards) ----------------- */}
        <div className="relative w-full overflow-hidden group">
          <div
            className="flex w-max animate-ticker hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto"
            style={{ animationDuration: "55s" }}
          >
            {/* Primary Interactive Stream */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 pl-4 sm:pl-6">
              {customTilesTrack1.map((tile) => (
                <a
                  key={`track1-primary-${tile.id}`}
                  href={tile.postUrl || instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/tile relative shrink-0 overflow-hidden border border-brand-border bg-brand-surfaceSubtle ${tile.sizeClass} ${tile.aspectClass} focus:outline-hidden focus-visible:ring-1 focus-visible:ring-brand-black`}
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/tile:scale-105"
                    loading="lazy"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 flex flex-col justify-between p-4 text-white">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80">
                      {tile.tag}
                    </span>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                      <span>View On Instagram</span>
                      <span>↗</span>
                    </div>
                  </div>
                  {/* Subtle Static Badge in Corner */}
                  <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/90 bg-black/60 px-2 py-0.5 pointer-events-none group-hover/tile:opacity-0 transition-opacity">
                    {tile.tag}
                  </span>
                </a>
              ))}
            </div>

            {/* Seamless Duplicate Stream (Accessible) */}
            <div
              aria-hidden="true"
              className="flex items-center gap-4 sm:gap-6 md:gap-8 pl-4 sm:gap-6 md:pl-8"
            >
              {customTilesTrack1.map((tile) => (
                <a
                  key={`track1-duplicate-${tile.id}`}
                  href={tile.postUrl || instagramUrl}
                  tabIndex={-1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/tile relative shrink-0 overflow-hidden border border-brand-border bg-brand-surfaceSubtle ${tile.sizeClass} ${tile.aspectClass} focus:outline-hidden`}
                >
                  <img
                    src={tile.image}
                    alt=""
                    className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/tile:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 flex flex-col justify-between p-4 text-white">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80">
                      {tile.tag}
                    </span>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                      <span>View On Instagram</span>
                      <span>↗</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/90 bg-black/60 px-2 py-0.5 pointer-events-none group-hover/tile:opacity-0 transition-opacity">
                    {tile.tag}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------- TRACK 2: Counter-Drift (Rightwards) ----------------- */}
        <div className="relative w-full overflow-hidden group">
          <div
            className="flex w-max animate-ticker-reverse hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto"
            style={{ animationDuration: "65s" }}
          >
            {/* Primary Interactive Stream */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 pl-4 sm:pl-6">
              {customTilesTrack2.map((tile) => (
                <a
                  key={`track2-primary-${tile.id}`}
                  href={tile.postUrl || instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/tile relative shrink-0 overflow-hidden border border-brand-border bg-brand-surfaceSubtle ${tile.sizeClass} ${tile.aspectClass} focus:outline-hidden focus-visible:ring-1 focus-visible:ring-brand-black`}
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/tile:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 flex flex-col justify-between p-4 text-white">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80">
                      {tile.tag}
                    </span>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                      <span>View On Instagram</span>
                      <span>↗</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/90 bg-black/60 px-2 py-0.5 pointer-events-none group-hover/tile:opacity-0 transition-opacity">
                    {tile.tag}
                  </span>
                </a>
              ))}
            </div>

            {/* Seamless Duplicate Stream (Accessible) */}
            <div
              aria-hidden="true"
              className="flex items-center gap-4 sm:gap-6 md:gap-8 pl-4 sm:gap-6 md:pl-8"
            >
              {customTilesTrack2.map((tile) => (
                <a
                  key={`track2-duplicate-${tile.id}`}
                  href={tile.postUrl || instagramUrl}
                  tabIndex={-1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/tile relative shrink-0 overflow-hidden border border-brand-border bg-brand-surfaceSubtle ${tile.sizeClass} ${tile.aspectClass} focus:outline-hidden`}
                >
                  <img
                    src={tile.image}
                    alt=""
                    className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/tile:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 flex flex-col justify-between p-4 text-white">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80">
                      {tile.tag}
                    </span>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                      <span>View On Instagram</span>
                      <span>↗</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/90 bg-black/60 px-2 py-0.5 pointer-events-none group-hover/tile:opacity-0 transition-opacity">
                    {tile.tag}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
