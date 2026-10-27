import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { BRAND_CONFIG } from "@/lib/config/brand";
import { Truck, PackageCheck, Clock, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | WASTE® — Contemporary Indian Streetwear",
  description:
    "Official Shipping Policy for WASTE®. Complimentary domestic delivery across India, courier dispatch timelines, tracking procedures, and delivery care.",
  alternates: {
    canonical: "https://www.wasteluxe.in/shipping-policy",
  },
  openGraph: {
    title: "Shipping & Delivery Policy | WASTE®",
    description:
      "Complimentary domestic delivery across India. Review dispatch timelines, tracking, and delivery expectations for WASTE® collections.",
    url: "https://www.wasteluxe.in/shipping-policy",
    type: "website",
  },
};

export default function ShippingPolicyPage() {
  const lastUpdated = "October 2024";

  return (
    <main className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between selection:bg-brand-black selection:text-brand-bg">
      <div>
        {/* Top Header Spacing & Back Navigation */}
        <div className="mx-auto max-w-[1400px] px-6 pt-32 sm:px-8 md:px-12 md:pt-40">
          <div className="flex items-center justify-between border-b border-brand-border pb-5">
            <BackButton fallbackHref="/" label="Home" variant="default" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-brand-muted">
              {BRAND_CONFIG.brandName} / Logistics &amp; Fulfillment
            </p>
          </div>
        </div>

        {/* Editorial Hero Header */}
        <section className="mx-auto max-w-[1400px] px-6 pt-12 pb-10 sm:px-8 md:px-12 md:pt-16">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-medium">
              Domestic Fulfillment &bull; Delivery Standards
            </span>
            <h1 className="mt-4 font-editorial text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-brand-black">
              Shipping &amp; <span className="text-brand-gold italic">Delivery</span>
            </h1>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-brand-muted">
              Last Updated: {lastUpdated} &bull; Applicable across all serviceable domestic PIN codes in India
            </p>
          </div>

          {/* Quick Highlight Card */}
          <div className="mt-10 border border-brand-border bg-brand-surface p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-black font-semibold">
                    Complimentary Domestic Delivery
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-brand-muted">
                  WASTE® provides complimentary standard domestic shipping on all orders and preorders across India.
                  Every piece is inspected, folded, and packaged in premium protective packaging before dispatch
                  through verified logistics partners.
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col gap-3 text-[10px] uppercase tracking-[0.2em] shrink-0">
                <div className="flex items-center gap-2 text-brand-muted">
                  <PackageCheck className="h-3.5 w-3.5 text-brand-black" />
                  <span>Inspected Packaging</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <Clock className="h-3.5 w-3.5 text-brand-black" />
                  <span>Real-Time Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <MapPin className="h-3.5 w-3.5 text-brand-black" />
                  <span>All India PIN Codes</span>
                </div>
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
                  Shipping Sections
                </p>
                <nav className="flex flex-col space-y-3 text-xs tracking-wide text-brand-muted">
                  <a href="#shipping-coverage" className="hover:text-brand-black transition-colors">01. Delivery Coverage</a>
                  <a href="#shipping-charges" className="hover:text-brand-black transition-colors">02. Shipping Charges</a>
                  <a href="#shipping-timelines" className="hover:text-brand-black transition-colors">03. Processing &amp; Dispatch</a>
                  <a href="#shipping-transit" className="hover:text-brand-black transition-colors">04. Estimated Delivery Times</a>
                  <a href="#shipping-tracking" className="hover:text-brand-black transition-colors">05. Tracking &amp; Notifications</a>
                  <a href="#shipping-attempts" className="hover:text-brand-black transition-colors">06. Unsuccessful Deliveries</a>
                  <a href="#shipping-damage" className="hover:text-brand-black transition-colors">07. Transit Damages &amp; Issues</a>
                </nav>

                <div className="pt-6 border-t border-brand-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Logistics Desk</p>
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
              {/* SECTION 01 */}
              <article id="shipping-coverage" className="space-y-4 border-t border-brand-border pt-8 first:border-t-0 first:pt-0">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 01
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Geographic Delivery Coverage
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    {BRAND_CONFIG.brandName} ships to all major cities, metro regions, tier-2 and tier-3 locations across
                    India that are serviceable by our courier network.
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-4 text-xs text-brand-muted">
                    <p className="font-semibold text-brand-black mb-1">International Shipping Status:</p>
                    <p>
                      At present, standard automated checkout on wasteluxe.in supports domestic deliveries within India.
                      For bespoke international inquiries or global collector requests, please email our concierge at{" "}
                      <a href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`} className="text-brand-black underline">
                        {BRAND_CONFIG.contact.officialBusinessEmail}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 02 */}
              <article id="shipping-charges" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 02
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Shipping Charges &amp; Rates
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    <strong className="text-brand-black font-medium">Zero Shipping Fees:</strong> Standard domestic delivery
                    is 100% complimentary on all orders and preorder reservations across India. There are no hidden packaging,
                    fuel surcharge, or handling fees added at checkout.
                  </p>
                  <p>
                    What you see on the piece&apos;s product page is the all-inclusive total you pay.
                  </p>
                </div>
              </article>

              {/* SECTION 03 */}
              <article id="shipping-timelines" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 03
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Order Processing &amp; Dispatch Windows
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>Our dispatch workflows depend on the order type:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-brand-black font-medium">In-Stock Pieces:</strong> Handled and dispatched from our
                      studio within <span className="text-brand-black font-semibold">2 to 4 business days</span> following order verification
                      (excluding Sundays and public holidays).
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Preorder Collections &amp; Exclusive Drops:</strong> Crafted
                      in limited production runs. Preorder items are scheduled according to the drop release window specified
                      on the respective product page (e.g. &ldquo;Ships in 2–3 weeks&rdquo;). You receive email updates as each piece
                      advances through cutting, tailoring, quality check, and final packaging.
                    </li>
                  </ul>
                </div>
              </article>

              {/* SECTION 04 */}
              <article id="shipping-transit" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 04
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Estimated Delivery Transit Times
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>Once your parcel has been handed over to our courier partner, typical transit times are:</p>
                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <div className="border border-brand-border bg-brand-surface p-4">
                      <p className="text-[10px] uppercase tracking-wider text-brand-gold font-semibold">Metro Destinations</p>
                      <p className="mt-1 text-sm font-medium text-brand-black">3 to 5 Business Days</p>
                      <p className="mt-1 text-xs text-brand-muted">Delhi NCR, Mumbai, Bengaluru, Jaipur, Kolkata, Chennai, Hyderabad, Pune</p>
                    </div>
                    <div className="border border-brand-border bg-brand-surface p-4">
                      <p className="text-[10px] uppercase tracking-wider text-brand-gold font-semibold">Rest of India</p>
                      <p className="mt-1 text-sm font-medium text-brand-black">5 to 8 Business Days</p>
                      <p className="mt-1 text-xs text-brand-muted">Tier-2, Tier-3 cities, regional hubs, and remote locations</p>
                    </div>
                  </div>
                  <p className="text-xs text-brand-muted pt-1">
                    Please note that adverse weather conditions, regional restrictions, or courier operational bottlenecks
                    may occasionally cause minor transit delays.
                  </p>
                </div>
              </article>

              {/* SECTION 05 */}
              <article id="shipping-tracking" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 05
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Order Tracking &amp; Delivery Notifications
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    As soon as your shipment is dispatched, you will receive an official notification via email
                    (and SMS if provided) containing:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Your unique courier Air Waybill (AWB) tracking number.</li>
                    <li>A direct tracking link to follow your parcel&apos;s journey in real time.</li>
                    <li>Estimated delivery date and designated delivery partner details.</li>
                  </ul>
                  <p>
                    You can also track your orders and view order history at any time by logging into your{" "}
                    <Link href="/account" className="text-brand-black underline font-medium">
                      WASTE® Account
                    </Link>
                    .
                  </p>
                </div>
              </article>

              {/* SECTION 06 */}
              <article id="shipping-attempts" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 06
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Delivery Address &amp; Unsuccessful Attempts
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    To ensure smooth delivery, please double-check your shipping details during checkout, including full
                    street address, flat/floor number, landmarks, and a valid 6-digit postal PIN code.
                  </p>
                  <p>
                    Our courier partners typically make up to <strong className="text-brand-black font-medium">3 delivery attempts</strong>{" "}
                    and will contact you via phone or SMS prior to arrival. If a delivery cannot be completed due to incorrect
                    coordinates or recipient unavailability, the parcel may be returned to our studio (RTO).
                  </p>
                  <p>
                    In such cases, our team will reach out to verify your details and coordinate re-dispatch.
                  </p>
                </div>
              </article>

              {/* SECTION 07 */}
              <article id="shipping-damage" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 07
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Damaged Parcels, Tampered Packages &amp; Delays
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Every WASTE® garment is shipped in secure packaging. If you notice that your outer package is visibly
                    torn, opened, or tampered with at the time of delivery:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Do not accept the parcel, or take clear photographs/video of the damage before signing.</li>
                    <li>Notify our support desk within <strong className="text-brand-black font-medium">48 hours</strong> of delivery.</li>
                    <li>
                      Email your order number, courier AWB, and photo/video evidence to{" "}
                      <a href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`} className="text-brand-black underline font-medium">
                        {BRAND_CONFIG.contact.officialBusinessEmail}
                      </a>
                      .
                    </li>
                  </ul>
                  <p>
                    Our team will immediately investigate with the courier and initiate a complimentary replacement or full refund.
                  </p>
                </div>
              </article>

              {/* Cross-Policy Navigation Links */}
              <div className="border-t border-brand-border pt-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted mb-4">
                  Related Brand Policies &amp; Store Terms
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
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

                  <Link
                    href="/terms-and-conditions"
                    className="group border border-brand-border bg-brand-surface p-4 transition-colors hover:border-brand-black"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-brand-muted block">Store Terms</span>
                    <span className="mt-1 text-xs font-semibold text-brand-black flex items-center justify-between">
                      Terms &amp; Conditions
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>

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
