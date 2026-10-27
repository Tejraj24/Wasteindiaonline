import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { BRAND_CONFIG } from "@/lib/config/brand";
import { Scale, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | WASTE® — Contemporary Indian Streetwear",
  description:
    "Official Terms and Conditions of WASTE®. Review our store terms, preorder allocations, intellectual property rights, and customer purchase conditions.",
  alternates: {
    canonical: "https://www.wasteluxe.in/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | WASTE®",
    description:
      "Review the terms governing the use of the WASTE® website and the purchase of our limited streetwear collections.",
    url: "https://www.wasteluxe.in/terms-and-conditions",
    type: "website",
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 2024";

  return (
    <main className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between selection:bg-brand-black selection:text-brand-bg">
      <div>
        {/* Top Header Spacing & Back Navigation */}
        <div className="mx-auto max-w-[1400px] px-6 pt-32 sm:px-8 md:px-12 md:pt-40">
          <div className="flex items-center justify-between border-b border-brand-border pb-5">
            <BackButton fallbackHref="/" label="Home" variant="default" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-brand-muted">
              {BRAND_CONFIG.brandName} / Legal &amp; Compliance
            </p>
          </div>
        </div>

        {/* Editorial Hero Header */}
        <section className="mx-auto max-w-[1400px] px-6 pt-12 pb-10 sm:px-8 md:px-12 md:pt-16">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-medium">
              Client Agreement &bull; Store Policies
            </span>
            <h1 className="mt-4 font-editorial text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-brand-black">
              Terms &amp; <span className="text-brand-gold italic">Conditions</span>
            </h1>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-brand-muted">
              Last Updated: {lastUpdated} &bull; Applicable across wasteluxe.in and affiliated brand channels
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="mt-10 border border-brand-border bg-brand-surface p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <Scale className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-brand-black font-semibold">
                  Agreement to Store Terms
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-brand-muted">
                  By accessing, browsing, or reserving pieces on{" "}
                  <strong className="text-brand-black font-medium">wasteluxe.in</strong>, you agree to be bound by
                  these Terms and Conditions, our Privacy Policy, Shipping Policy, and Return/Refund Policy. If you do
                  not agree with any portion of these terms, please refrain from using our services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content Sections */}
        <section className="mx-auto max-w-[1400px] px-6 pb-24 sm:px-8 md:px-12 md:pb-32">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr] lg:gap-20">
            {/* Table of Contents Sticky Sidebar (Desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-4 border-l border-brand-border pl-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                  Clauses Index
                </p>
                <nav className="flex flex-col space-y-3 text-xs tracking-wide text-brand-muted">
                  <a href="#clause-1" className="hover:text-brand-black transition-colors">01. Eligibility &amp; Use</a>
                  <a href="#clause-2" className="hover:text-brand-black transition-colors">02. Products &amp; Sizing</a>
                  <a href="#clause-3" className="hover:text-brand-black transition-colors">03. Pricing &amp; Currency</a>
                  <a href="#clause-4" className="hover:text-brand-black transition-colors">04. Orders &amp; Preorders</a>
                  <a href="#clause-5" className="hover:text-brand-black transition-colors">05. Payment Processing</a>
                  <a href="#clause-6" className="hover:text-brand-black transition-colors">06. Intellectual Property</a>
                  <a href="#clause-7" className="hover:text-brand-black transition-colors">07. Returns &amp; Exchanges</a>
                  <a href="#clause-8" className="hover:text-brand-black transition-colors">08. Liability &amp; Law</a>
                  <a href="#clause-9" className="hover:text-brand-black transition-colors">09. Contact &amp; Notices</a>
                </nav>

                <div className="pt-6 border-t border-brand-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Support Desk</p>
                  <a
                    href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                    className="mt-1 block text-xs font-medium text-brand-black underline hover:opacity-75"
                  >
                    {BRAND_CONFIG.contact.officialBusinessEmail}
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Policy Content Articles */}
            <div className="space-y-16 max-w-3xl">
              {/* CLAUSE 01 */}
              <article id="clause-1" className="space-y-4 border-t border-brand-border pt-8 first:border-t-0 first:pt-0">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 01
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Eligibility &amp; Website Usage
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    By using this website, you represent that you are at least 18 years of age, or that you are accessing
                    the website under the supervision of a parent or legal guardian.
                  </p>
                  <p>
                    You agree not to use the website for any unlawful purpose, violate intellectual property rights, transmit
                    harmful code, attempt unauthorized access to server databases, or engage in automated scraping or bot activity
                    aimed at monopolizing limited product drops.
                  </p>
                </div>
              </article>

              {/* CLAUSE 02 */}
              <article id="clause-2" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 02
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Product Descriptions, Garment Sizing &amp; Availability
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    {BRAND_CONFIG.brandName} creates contemporary Indian streetwear crafted with high-grade cottons, heavy weights,
                    and custom garment treatments. We make every effort to display garment cuts, textures, and colors with
                    utmost fidelity in our editorial photography.
                  </p>
                  <p>
                    However, due to monitor color calibration, ambient lighting, and hand-finished treatments, subtle nuances in
                    tone and finish may occur naturally. Sizing charts are provided for guidance; please review measurements carefully
                    before ordering or reserving.
                  </p>
                  <p>
                    All pieces are subject to availability. Many WASTE® collections are released as numbered drops or limited-capacity
                    preorders. We reserve the right to limit quantities per client (typically 1 to 5 units per design) to ensure
                    fair access across our community.
                  </p>
                </div>
              </article>

              {/* CLAUSE 03 */}
              <article id="clause-3" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 03
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Pricing, Taxes &amp; Currency
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    All prices displayed on wasteluxe.in are in Indian Rupees (INR, &#8377;). Unless explicitly stated otherwise,
                    prices include all applicable domestic taxes.
                  </p>
                  <p>
                    Domestic standard delivery is provided complimentarily across India. While we strive to ensure all pricing
                    information is accurate, typographical or catalog errors may occur. If a garment is listed at an incorrect price,
                    WASTE® reserves the right to decline or cancel the affected order, providing immediate notice and a full refund.
                  </p>
                </div>
              </article>

              {/* CLAUSE 04 */}
              <article id="clause-4" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 04
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Order Placement, Preorders &amp; Acceptance
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Submitting an order or preorder request through wasteluxe.in constitutes an offer to purchase the specified pieces.
                    Receipt of an automated confirmation email (<code className="text-xs bg-brand-surfaceSubtle px-1 py-0.5 rounded">PRE-XXXX</code> or{" "}
                    <code className="text-xs bg-brand-surfaceSubtle px-1 py-0.5 rounded">WST-XXXX</code>) confirms that our system has
                    logged your request, but does not constitute final binding acceptance.
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-4 text-xs text-brand-muted space-y-1.5">
                    <p className="font-semibold text-brand-black">Preorder Allocation System:</p>
                    <p>
                      Preorders reserve your allocation in an upcoming production cycle. Estimated shipment timeframes are noted on
                      the piece&apos;s product page. Our team contacts clients with progress updates, logistics coordination, and
                      dispatch tracking.
                    </p>
                  </div>
                  <p>
                    We reserve the right to cancel or decline any order if the product becomes unavailable, if fraud is suspected,
                    or if delivery coordinates are unserviceable. If cancelled by us, any charged amount is refunded in full.
                  </p>
                </div>
              </article>

              {/* CLAUSE 05 */}
              <article id="clause-5" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 05
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Payment Processing &amp; Verification
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Payments on wasteluxe.in are processed through <strong className="text-brand-black font-medium">PhonePe</strong>,
                    supporting UPI, debit/credit cards, and net banking.
                  </p>
                  <p>
                    You agree to provide valid, authorized payment instruments. Orders are fulfilled only after verified payment
                    confirmation is received from the payment gateway (except for zero-upfront preorder allocations).
                  </p>
                </div>
              </article>

              {/* CLAUSE 06 */}
              <article id="clause-6" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 06
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Intellectual Property &amp; Brand Rights
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    The WASTE® name, brand logo, the tagline <em>&ldquo;Made in India. Built for the world.&rdquo;</em>,
                    artwork, graphics, garment patterns, editorial photography, typography, video footage, website layouts,
                    and software code are the exclusive intellectual property of Suryansh Meena and {BRAND_CONFIG.brandName}.
                  </p>
                  <p>
                    No content from this website may be copied, reproduced, republished, modified, downloaded, posted,
                    transmitted, or distributed for commercial purposes without prior written authorization from the founder.
                  </p>
                </div>
              </article>

              {/* CLAUSE 07 */}
              <article id="clause-7" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 07
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Returns, Exchanges &amp; Order Cancellations
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    All returns, exchanges, and cancellations are governed strictly by our dedicated{" "}
                    <Link href="/return-refund-policy" className="text-brand-black underline font-medium">
                      Return, Exchange &amp; Refund Policy
                    </Link>
                    .
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Cancellations are accepted prior to parcel dispatch by emailing support.</li>
                    <li>Defective, damaged, or incorrect pieces are 100% eligible for replacement or full refund.</li>
                    <li>Size exchanges are supported subject to drop inventory availability.</li>
                    <li>Returned pieces must be unworn, unwashed, unaltered, and accompanied by original tags and packaging.</li>
                  </ul>
                </div>
              </article>

              {/* CLAUSE 08 */}
              <article id="clause-8" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 08
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Limitation of Liability &amp; Governing Law
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    To the maximum extent permitted by applicable Indian law, {BRAND_CONFIG.brandName}, its founder,
                    and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages
                    arising from your use of the website or the purchase of any products.
                  </p>
                  <p>
                    Our total aggregate liability for any direct claim arising out of or related to these terms or any purchase
                    shall in no event exceed the actual amount paid by you for the specific product in question.
                  </p>
                  <p>
                    These terms are governed by and construed in accordance with the laws of the Republic of India. Any dispute,
                    controversy, or claim arising out of or in connection with these terms shall be subject to the exclusive
                    jurisdiction of the competent courts in Jaipur, Rajasthan, India.
                  </p>
                </div>
              </article>

              {/* CLAUSE 09 */}
              <article id="clause-9" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 09
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Support, Legal Entity &amp; Official Notices
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    All legal notices, brand correspondence, or compliance questions regarding these terms should be addressed to:
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-5 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-brand-black font-semibold">
                      WASTE® Legal &amp; Executive Office
                    </p>
                    <p className="text-xs text-brand-muted">
                      Founder: {BRAND_CONFIG.founder.name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      Official Contact Email:{" "}
                      <a
                        href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                        className="text-brand-black underline"
                      >
                        {BRAND_CONFIG.contact.officialBusinessEmail}
                      </a>
                    </p>
                    <p className="text-xs text-brand-muted">
                      Origin &amp; Jurisdiction: Jaipur, Rajasthan, India
                    </p>
                  </div>
                </div>
              </article>

              {/* Cross-Policy Navigation Links */}
              <div className="border-t border-brand-border pt-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted mb-4">
                  Related Brand Policies
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Link
                    href="/privacy-policy"
                    className="group border border-brand-border bg-brand-surface p-4 transition-colors hover:border-brand-black"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-brand-muted block">Client Privacy</span>
                    <span className="mt-1 text-xs font-semibold text-brand-black flex items-center justify-between">
                      Privacy Policy
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>

                  <Link
                    href="/shipping-policy"
                    className="group border border-brand-border bg-brand-surface p-4 transition-colors hover:border-brand-black"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-brand-muted block">Logistics &amp; Delivery</span>
                    <span className="mt-1 text-xs font-semibold text-brand-black flex items-center justify-between">
                      Shipping Policy
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>

                  <Link
                    href="/return-refund-policy"
                    className="group border border-brand-border bg-brand-surface p-4 transition-colors hover:border-brand-black"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-brand-muted block">Client Care</span>
                    <span className="mt-1 text-xs font-semibold text-brand-black flex items-center justify-between">
                      Returns &amp; Refunds
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
