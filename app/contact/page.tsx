import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { BRAND_CONFIG } from "@/lib/config/brand";

export const metadata: Metadata = {
  title: "Contact Us | WASTE",
  description:
    "Official communication channels for WASTE. Business enquiries, founder contact, and verified social channels.",
  alternates: {
    canonical: "https://www.wasteluxe.in/contact",
  },
  openGraph: {
    title: "Contact Us | WASTE",
    description: "Official business and founder enquiries for WASTE.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-black">
      {/* Top Header Spacing & Back Navigation */}
      <div className="mx-auto max-w-[1600px] px-6 pt-32 sm:px-8 md:px-12 md:pt-40">
        <div className="flex items-center justify-between border-b border-brand-border pb-5">
          <BackButton fallbackHref="/" label="Home" variant="default" />
          <p className="text-[10px] uppercase tracking-[0.28em] text-brand-muted">
            {BRAND_CONFIG.brandName} / Contact
          </p>
        </div>
      </div>

      {/* SECTION A & B — INTRO AND CONTACT FORM */}
      <section className="mx-auto max-w-[1600px] px-6 pt-12 pb-24 sm:px-8 md:px-12 md:pt-16 md:pb-36">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
          {/* Left Column: Headline, Brand Context & Verified Channels */}
          <div className="space-y-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                Direct Communication
              </span>
              <h1 className="mt-5 font-editorial text-[clamp(3.5rem,9vw,8rem)] leading-[0.82] tracking-[-0.05em] uppercase text-brand-black">
                We&apos;re Here
                <br />
                To <span className="text-brand-gold">Help.</span>
              </h1>
              <p className="mt-8 max-w-lg text-xs leading-relaxed text-brand-muted sm:text-sm sm:leading-7">
                For official business enquiries, collaborations, brand partnerships, or general
                questions regarding {BRAND_CONFIG.brandName}, please reach out through our official
                channels below.
              </p>
            </div>

            {/* SECTION C — VERIFIED CONTACT INFORMATION */}
            <div className="space-y-10 border-t border-brand-border pt-8">
              {/* Business Enquiries */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">
                  Official Business Enquiries
                </span>
                <p className="mt-1 text-xs text-brand-muted">General brand correspondence & partnerships</p>
                <a
                  href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                  className="mt-2 inline-block text-base font-light tracking-wide text-brand-black transition-colors hover:opacity-70 sm:text-lg underline"
                >
                  {BRAND_CONFIG.contact.officialBusinessEmail}
                </a>
              </div>

              {/* Founder Direct Contact */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  Founder &amp; Executive Office
                </span>
                <p className="mt-1 text-xs text-brand-muted">{BRAND_CONFIG.founder.name} &mdash; Founder</p>
                <a
                  href={`mailto:${BRAND_CONFIG.contact.founderEmail}`}
                  className="mt-2 inline-block text-sm font-light tracking-wide text-brand-black transition-colors hover:opacity-70 sm:text-base underline"
                >
                  {BRAND_CONFIG.contact.founderEmail}
                </a>
              </div>

              {/* Customer Support Notice */}
              <div className="border border-brand-border bg-brand-surface p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  Customer Support Channels
                </p>
                <p className="mt-2 text-xs leading-5 text-brand-muted">
                  Dedicated customer support infrastructure is currently being established. For all
                  immediate enquiries, please reach us directly at{" "}
                  <a
                    href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                    className="text-brand-black underline hover:opacity-70"
                  >
                    {BRAND_CONFIG.contact.officialBusinessEmail}
                  </a>
                  .
                </p>
              </div>

              {/* Social Channels */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  Official Social Channels
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs">
                  <a
                    href={BRAND_CONFIG.socials.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface px-4 py-2 text-brand-muted shadow-sm transition-colors hover:border-brand-black hover:text-brand-black"
                  >
                    <span>Instagram:</span>
                    <span className="font-medium text-brand-black">{BRAND_CONFIG.socials.instagram.handle}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={BRAND_CONFIG.socials.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface px-4 py-2 text-brand-muted shadow-sm transition-colors hover:border-brand-black hover:text-brand-black"
                  >
                    <span>Facebook:</span>
                    <span className="font-medium text-brand-black">{BRAND_CONFIG.socials.facebook.handle}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SECTION D — QUICK NAVIGATION DIRECTS */}
            <div className="border-t border-brand-border pt-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                Explore The Brand
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.2em]">
                <Link
                  href="/shop"
                  className="border border-brand-border bg-brand-surface px-4 py-2 text-brand-muted shadow-sm transition hover:border-brand-black hover:text-brand-black"
                >
                  Shop Catalog →
                </Link>
                <Link
                  href="/our-story"
                  className="border border-brand-border bg-brand-surface px-4 py-2 text-brand-muted shadow-sm transition hover:border-brand-black hover:text-brand-black"
                >
                  Our Story →
                </Link>
                <Link
                  href="/account"
                  className="border border-brand-border bg-brand-surface px-4 py-2 text-brand-muted shadow-sm transition hover:border-brand-black hover:text-brand-black"
                >
                  Your Account →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:pt-6">
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">
                Inquiry Form
              </span>
              <h2 className="mt-2 font-editorial text-3xl tracking-[-0.03em] text-brand-black sm:text-4xl">
                Send a message
              </h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
