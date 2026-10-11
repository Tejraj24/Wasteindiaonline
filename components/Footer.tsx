import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/config/brand";

const navigationLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Our Story", href: "/our-story" },
  { name: "Collections", href: "/shop" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    name: `Instagram (${BRAND_CONFIG.socials.instagram.handle})`,
    href: BRAND_CONFIG.socials.instagram.url,
  },
  {
    name: `Facebook (${BRAND_CONFIG.socials.facebook.handle})`,
    href: BRAND_CONFIG.socials.facebook.url,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-bg px-4 py-16 text-brand-black sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-16 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4 lg:gap-x-16 lg:gap-y-24">
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="WASTE home"
              className="inline-block font-sans text-[clamp(3.5rem,16vw,6rem)] font-semibold uppercase leading-none tracking-[-0.08em] transition-colors duration-500 hover:text-brand-gold md:text-8xl"
            >
              WASTE<span className="text-brand-gold">®</span>
            </Link>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
              {BRAND_CONFIG.tagline}
            </p>
            <p className="mt-12 max-w-xl font-serif text-[clamp(2.25rem,8vw,3.75rem)] leading-[0.95] tracking-[-0.04em] text-brand-black md:mt-20 md:text-6xl">
              Born in India.
              <br />
              Created for a generation
              <br />
              that refuses to fit into a box.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
              Explore
            </p>
            <ul className="space-y-3">
              {navigationLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-block text-sm text-brand-black/85 transition-colors duration-300 hover:text-brand-black hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-12 md:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:gap-10">
            <nav aria-label="Social channels">
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                Connect
              </p>
              <ul className="space-y-3">
                {socialLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WASTE on ${item.name}`}
                      className="inline-block text-xs text-brand-black/85 transition-colors duration-300 hover:text-brand-black"
                    >
                      {item.name} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-8">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                  Enquiries
                </p>
                <Link
                  href="/contact"
                  className="block text-sm text-brand-black/85 transition-colors duration-300 hover:text-brand-black hover:underline"
                >
                  Contact Us →
                </Link>
                <a
                  href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                  className="mt-1 block text-xs text-brand-muted transition-colors duration-300 hover:text-brand-black"
                >
                  {BRAND_CONFIG.contact.officialBusinessEmail}
                </a>
              </div>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                  Brand
                </p>
                <p className="text-xs text-brand-muted leading-5">
                  Founded in {BRAND_CONFIG.foundingYear} by {BRAND_CONFIG.founder.name}.
                  <br />
                  {BRAND_CONFIG.origin} 🇮🇳
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-brand-border pt-6 text-[10px] uppercase tracking-[0.25em] text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{BRAND_CONFIG.tagline}</p>
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
