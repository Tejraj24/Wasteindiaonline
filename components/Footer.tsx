import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/config/brand";

// Top marquee sequence matching the reference image exactly
const MARQUEE_SEQUENCE = [
  { text: "MADE TO STAND APART", type: "phrase" },
  { text: "✳", type: "star" },
  { text: "WASTE", type: "brand" },
  { text: "│", type: "pipe" },
  { text: "NEW PERSPECTIVES ONLY", type: "phrase" },
  { text: "✳", type: "star" },
  { text: "WASTE", type: "brand" },
  { text: "│", type: "pipe" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site Footer"
      className="relative w-full border-t border-[#D5D0C6] bg-[#F5F1EA] text-[#111111] overflow-hidden select-none"
    >
      {/* -------------------------------------------------------------------------
          1. TOP ANIMATED MARQUEE STRIP
          ------------------------------------------------------------------------- */}
      <div className="w-full border-b border-[#D5D0C6] bg-[#F5F1EA] py-2 sm:py-2.5 md:py-3 overflow-hidden">
        <div
          className="flex w-max animate-ticker hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: "36s" }}
        >
          {/* Marquee Track 1 */}
          <div className="flex items-center gap-6 sm:gap-8 px-4 font-anton text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] uppercase tracking-[0.18em] text-[#111111]">
            {[...MARQUEE_SEQUENCE, ...MARQUEE_SEQUENCE].map((item, idx) => (
              <span key={`track-1-${idx}`} className="flex items-center gap-6 sm:gap-8">
                {item.type === "star" ? (
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] text-black">✳</span>
                ) : item.type === "pipe" ? (
                  <span className="text-black/30 font-sans text-sm sm:text-base">│</span>
                ) : (
                  <span>{item.text}</span>
                )}
              </span>
            ))}
          </div>

          {/* Marquee Track 2 (Accessible Duplicate for Continuous Seamless Loop) */}
          <div
            aria-hidden="true"
            className="flex items-center gap-6 sm:gap-8 px-4 font-anton text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] uppercase tracking-[0.18em] text-[#111111]"
          >
            {[...MARQUEE_SEQUENCE, ...MARQUEE_SEQUENCE].map((item, idx) => (
              <span key={`track-2-${idx}`} className="flex items-center gap-6 sm:gap-8">
                {item.type === "star" ? (
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] text-black">✳</span>
                ) : item.type === "pipe" ? (
                  <span className="text-black/30 font-sans text-sm sm:text-base">│</span>
                ) : (
                  <span>{item.text}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          2. MAIN FOOTER COMPOSITION
             Proportions:
             - Large WASTE logo area: ~46–48%
             - Handwritten statement + overlapping photos: ~31–33%
             - SHOP / SUPPORT navigation: ~20–22%
          ------------------------------------------------------------------------- */}
      <div className="mx-auto w-full max-w-[2048px] px-5 sm:px-8 md:px-10 lg:px-8 xl:px-12 2xl:px-14 py-8 sm:py-10 md:py-12 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-3 xl:gap-6 2xl:gap-8">
          
          {/* SECTION A: OVERSIZED WASTE WORDMARK + HANDWRITTEN STATEMENT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-start gap-3 sm:gap-4 lg:gap-3 xl:gap-5 2xl:gap-7 shrink min-w-0">
            {/* Giant WASTE Wordmark */}
            <Link
              href="/"
              aria-label="WASTE homepage"
              className="inline-flex items-start text-black transition-opacity hover:opacity-85 shrink-0"
            >
              <span className="font-anton text-[64px] sm:text-[80px] md:text-[96px] lg:text-[82px] xl:text-[120px] 2xl:text-[172px] leading-[0.8] tracking-[-0.03em] uppercase text-black">
                WASTE
              </span>
            </Link>

            {/* Handwritten Statement: SAME CULTURE. DIFFERENT PEOPLE. */}
            <div className="font-reenie text-[22px] sm:text-[24px] md:text-[26px] lg:text-[20px] xl:text-[28px] 2xl:text-[35px] leading-[0.88] text-black tracking-normal uppercase select-none shrink-0 pl-0.5 sm:pl-0 sm:pt-1">
              <p>SAME</p>
              <p>CULTURE.</p>
              <p>DIFFERENT</p>
              <p>PEOPLE.</p>
            </div>
          </div>

          {/* SECTION B: OVERLAPPING CAMPAIGN PHOTOGRAPHS (EXACT REPLICATION) */}
          <div className="relative flex items-center justify-center py-2 lg:py-0 shrink">
            {/* High-Resolution Archival Polaroid Asset */}
            <div className="relative w-[260px] sm:w-[320px] md:w-[360px] lg:w-[280px] xl:w-[390px] 2xl:w-[520px]">
              <img
                src="/images/footer-campaign-polaroids.png"
                alt="WASTE campaign lookbook archival photographs with model portraits"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-md"
                loading="eager"
              />
            </div>
          </div>

          {/* SECTION C: VERTICAL DIVIDER & NAVIGATION COLUMNS */}
          <div className="flex items-start lg:items-center justify-between sm:justify-start gap-4 sm:gap-6 lg:gap-3 xl:gap-6 shrink-0">
            {/* Hairline Vertical Divider (Desktop Only) */}
            <div
              aria-hidden="true"
              className="hidden lg:block w-px h-32 lg:h-34 xl:h-42 bg-[#D5D0C6] self-center mr-1 xl:mr-3"
            />

            {/* Navigation Grid (SHOP & SUPPORT) */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-5 xl:gap-8 2xl:gap-10 w-full sm:w-auto">
              {/* Column 1: SHOP */}
              <nav aria-label="Footer Shop Navigation" className="space-y-3">
                <p className="font-sans text-[11px] sm:text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.14em] text-black">
                  SHOP
                </p>
                <ul className="space-y-1.5 text-[10px] sm:text-[10.5px] xl:text-[11.5px] font-medium uppercase tracking-[0.06em] text-black/85">
                  <li>
                    <Link
                      href="/shop"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      ALL PRODUCTS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?sort=newest"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      NEW ARRIVALS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=t-shirts"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      T-SHIRTS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=sweatshirts"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      HOODIES
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=trousers"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      TROUSERS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      ACCESSORIES
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Column 2: SUPPORT */}
              <nav aria-label="Footer Support Navigation" className="space-y-3">
                <p className="font-sans text-[11px] sm:text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.14em] text-black">
                  SUPPORT
                </p>
                <ul className="space-y-1.5 text-[10px] sm:text-[10.5px] xl:text-[11.5px] font-medium uppercase tracking-[0.06em] text-black/85">
                  <li>
                    <Link
                      href="/our-story"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      OUR STORY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      CONTACT US
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact#shipping"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      SHIPPING &amp; RETURNS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact#faqs"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      TRACK ORDER
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact#size-guide"
                      className="block hover:text-black hover:underline underline-offset-3 transition-colors py-0.5"
                    >
                      SIZE GUIDE
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          3. BOTTOM LEGAL STRIP (HAIRLINE DIVIDER + COPYRIGHT + ORIGIN + SOCIALS)
          ------------------------------------------------------------------------- */}
      <div className="w-full border-t border-[#D5D0C6] py-4 sm:py-5">
        <div className="mx-auto w-full max-w-[2048px] px-5 sm:px-8 md:px-10 lg:px-8 xl:px-12 2xl:px-14 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-black font-medium">
          {/* Left: Copyright */}
          <div className="flex items-center text-center md:text-left">
            <span>© {currentYear} {BRAND_CONFIG.brandName}. ALL RIGHTS RESERVED.</span>
          </div>

          {/* Centre: Brand Origin */}
          <div className="flex items-center text-center">
            <span>INDIA &mdash; CONTEMPORARY STREETWEAR</span>
          </div>

          {/* Right: Verified Social Icons + Divider + Slogan */}
          <div className="flex items-center gap-3.5">
            {/* Social Icons matching reference */}
            <div className="flex items-center gap-3 text-black">
              {/* Instagram */}
              <a
                href={BRAND_CONFIG.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE Instagram"
                className="hover:opacity-60 transition-opacity"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              {/* <a
                href="https://youtube.com/@wasteindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE YouTube"
                className="hover:opacity-60 transition-opacity"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a> */}

              {/* Pinterest */}
              {/* <a
                href="https://pinterest.com/wasteindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE Pinterest"
                className="hover:opacity-60 transition-opacity"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.98-.13-2.48.03-3.55l1-4.22s-.26-.52-.26-1.28c0-1.2.7-2.1 1.56-2.1.74 0 1.1.55 1.1 1.22 0 .74-.47 1.85-.72 2.87-.2.86.43 1.56 1.28 1.56 1.53 0 2.7-1.62 2.7-3.96 0-2.07-1.48-3.52-3.6-3.52-2.63 0-4.17 1.97-4.17 4.01 0 .79.3 1.64.69 2.1a.3.3 0 0 1 .07.28c-.08.33-.26 1.05-.3 1.2-.05.2-.17.25-.4.15-1.5-.7-2.44-2.88-2.44-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.37 2.96 7.37 6.9 0 4.12-2.6 7.44-6.2 7.44-1.21 0-2.35-.63-2.74-1.38l-.75 2.85c-.27 1.04-1 2.35-1.5 3.14A12 12 0 1 0 12 0z" />
                </svg>
              </a> */}

              {/* Spotify */}
              {/* <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE Spotify"
                className="hover:opacity-60 transition-opacity"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </a> */}
            </div>

            {/* Separator Pipe */}
            <span aria-hidden="true" className="w-px h-3.5 bg-black/30" />

            {/* Slogan */}
            <span className="font-sans text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-black font-semibold">
              MADE TO STAND APART.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
