import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/config/brand";

const FOOTER_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792943377/footer-section_wxyq9z.jpg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site Footer"
      className="relative w-full overflow-hidden border-t border-[#E5E1D8] bg-[#F6F3EC] text-[#111111] select-none"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20">
        {/* ==========================================================
            MAIN EDITORIAL STAGE (Wordmark & Nav on Left, Model Visual on Right)
           ========================================================== */}
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between min-h-[460px] sm:min-h-[520px] lg:min-h-[640px] xl:min-h-[720px] py-12 sm:py-16 lg:py-20">
          
          {/* Left Column: Oversized Brand Wordmark + Primary Navigation */}
          <div className="relative z-10 flex flex-col justify-center max-w-xl xl:max-w-2xl py-4 sm:py-6">
            {/* Bold Oversized WASTE® Wordmark */}
            <Link
              href="/"
              aria-label="WASTE® Homepage"
              className="inline-block transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <span className="font-anton text-[clamp(4.25rem,11vw,10.5rem)] leading-[0.82] tracking-[-0.03em] uppercase text-[#111111] block">
                WASTE
                <span className="text-[clamp(1.5rem,3.2vw,3rem)] font-sans font-normal align-super ml-1">
                  ®
                </span>
              </span>
            </Link>

            {/* Primary Navigation with Thin Vertical Dividers */}
            <nav
              aria-label="Footer Primary Navigation"
              className="mt-8 sm:mt-10 lg:mt-14 flex items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-[13px] md:text-sm font-semibold tracking-[0.22em] uppercase text-[#111111]"
            >
              <Link
                href="/shop"
                className="hover:opacity-50 transition-opacity focus-visible:outline-none focus-visible:underline underline-offset-4"
              >
                SHOP
              </Link>
              <span aria-hidden="true" className="h-3.5 w-px bg-black/25" />
              <Link
                href="/our-story"
                className="hover:opacity-50 transition-opacity focus-visible:outline-none focus-visible:underline underline-offset-4"
              >
                OUR STORY
              </Link>
              <span aria-hidden="true" className="h-3.5 w-px bg-black/25" />
              <Link
                href="/contact"
                className="hover:opacity-50 transition-opacity focus-visible:outline-none focus-visible:underline underline-offset-4"
              >
                CONTACT
              </Link>
            </nav>
          </div>

          {/* Right Column / Fashion Model Visual: Responsive Blended Backdrop */}
          <div className="mt-8 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-[54%] xl:w-[52%] 2xl:w-[50%] pointer-events-none flex items-center justify-end overflow-hidden">
            <div className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] lg:h-full">
              <img
                src={FOOTER_IMAGE_URL}
                alt="WASTE® contemporary fashion editorial model wearing leopard-print sweatshirt"
                className="w-full h-full object-cover object-[76%_center] md:object-[72%_center] lg:object-right select-none lg:[mask-image:linear-gradient(to_right,transparent_0%,black_16%,black_100%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_16%,black_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] sm:[mask-image:none]"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ==========================================================
            THIN HORIZONTAL DIVIDER
           ========================================================== */}
        <div className="w-full border-t border-[#E0DCD3]" />

        {/* ==========================================================
            BOTTOM FOOTER BAR: Copyright, Legal Links, Social Icons
           ========================================================== */}
        <div className="py-6 sm:py-7 flex flex-col md:flex-row items-center justify-between gap-5 text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6862]">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <p>© 2026 WASTE®. ALL RIGHTS RESERVED.</p>
          </div>

          {/* Right: Legal Links & Verified Social Icons */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 sm:gap-7">
            {/* Legal Links */}
            <div className="flex items-center gap-5 sm:gap-6">
              <Link
                href="/contact#privacy"
                className="hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:underline underline-offset-4"
              >
                PRIVACY POLICY
              </Link>
              <span aria-hidden="true" className="h-3 w-px bg-[#D5D0C6]" />
              <Link
                href="/contact#terms"
                className="hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:underline underline-offset-4"
              >
                TERMS &amp; CONDITIONS
              </Link>
            </div>

            {/* Separator Pipe */}
            <span aria-hidden="true" className="hidden sm:inline-block h-3.5 w-px bg-[#D5D0C6]" />

            {/* Verified Social Icons */}
            <div className="flex items-center gap-3 text-[#111111]">
              {/* Instagram */}
              <a
                href={BRAND_CONFIG.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE on Instagram"
                className="p-1 text-[#111111]/80 hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black rounded"
              >
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.8]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@wasteindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE on YouTube"
                className="p-1 text-[#111111]/80 hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black rounded"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* X (formerly Twitter) */}
              <a
                href="https://x.com/wasteindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WASTE on X"
                className="p-1 text-[#111111]/80 hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black rounded"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
