const navigationLinks = ["Shop", "Collections", "About", "Journal", "Contact"];
const socialLinks = ["Instagram", "YouTube", "LinkedIn"];

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-black px-4 py-16 text-[#f5f5f5] sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-16 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4 lg:gap-x-16 lg:gap-y-24">
          <div className="lg:col-span-2">
            <a
              href="/"
              aria-label="WASTE home"
              className="inline-block font-sans text-[clamp(3.5rem,16vw,6rem)] font-semibold uppercase leading-none tracking-[-0.08em] transition-colors duration-500 hover:text-brand-blue md:text-8xl"
            >
              WASTE<span className="text-brand-blue">.</span>
            </a>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#8b8b8b]">
              A Modern Expression of Heritage
            </p>
            <p className="mt-12 max-w-xl font-serif text-[clamp(2.25rem,8vw,3.75rem)] leading-[0.95] tracking-[-0.04em] md:mt-20 md:text-6xl">
              Crafted for the next generation.
              <br />
              Rooted in heritage.
              <br />
              Designed for modern culture.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#8b8b8b]">
              Explore
            </p>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link}>
                  <a
                    href={link === "Shop" ? "/shop" : `/#${link.toLowerCase()}`}
                    className="inline-block text-sm transition-colors duration-500 hover:text-brand-blue"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-12 md:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:gap-10">
            <nav aria-label="Social links">
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#8b8b8b]">
                Connect
              </p>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      aria-label={`WASTE on ${link}`}
                      className="inline-block text-sm transition-colors duration-500 hover:text-brand-blue"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-8">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#8b8b8b]">
                  Contact
                </p>
                <a
                  href="mailto:hello@waste.in"
                  className="text-sm transition-colors duration-500 hover:text-brand-blue"
                >
                  hello@waste.in
                </a>
              </div>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#8b8b8b]">
                  Studio
                </p>
                <address className="text-sm not-italic leading-6">
                  Jaipur, Rajasthan
                  <br />
                  India
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.25em] text-[#8b8b8b] sm:flex-row sm:items-center sm:justify-between">
          <p>WASTE. / Modern heritage</p>
          <p>© {new Date().getFullYear()} WASTE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
