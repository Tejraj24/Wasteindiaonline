import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { BRAND_CONFIG } from "@/lib/config/brand";
import { RotateCcw, ShieldAlert, CheckCircle2, HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Return, Exchange & Refund Policy | WASTE® — Contemporary Indian Streetwear",
  description:
    "Official Return, Exchange & Refund Policy for WASTE®. Transparent terms on defective pieces, size exchanges, reverse pickups, and refund processing.",
  alternates: {
    canonical: "https://www.wasteluxe.in/return-refund-policy",
  },
  openGraph: {
    title: "Return, Exchange & Refund Policy | WASTE®",
    description:
      "Review the customer care policy for WASTE®: transparent guidelines on size exchanges, transit damages, order cancellations, and refund timelines.",
    url: "https://www.wasteluxe.in/return-refund-policy",
    type: "website",
  },
};

export default function ReturnRefundPolicyPage() {
  const lastUpdated = "October 2024";

  return (
    <main className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between selection:bg-brand-black selection:text-brand-bg">
      <div>
        {/* Top Header Spacing & Back Navigation */}
        <div className="mx-auto max-w-[1400px] px-6 pt-32 sm:px-8 md:px-12 md:pt-40">
          <div className="flex items-center justify-between border-b border-brand-border pb-5">
            <BackButton fallbackHref="/" label="Home" variant="default" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-brand-muted">
              {BRAND_CONFIG.brandName} / Client Care &amp; Support
            </p>
          </div>
        </div>

        {/* Editorial Hero Header */}
        <section className="mx-auto max-w-[1400px] px-6 pt-12 pb-10 sm:px-8 md:px-12 md:pt-16">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-medium">
              Client Care &bull; Fair Purchase Guarantee
            </span>
            <h1 className="mt-4 font-editorial text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-brand-black">
              Returns &amp; <span className="text-brand-gold italic">Refunds</span>
            </h1>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-brand-muted">
              Last Updated: {lastUpdated} &bull; Applicable to all orders &amp; preorders placed on wasteluxe.in
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="mt-10 border border-brand-border bg-brand-surface p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-black font-semibold">
                    Our Commitment to Quality &amp; Fit
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-brand-muted">
                  WASTE® stands firmly behind the craftsmanship, cuts, and materials of our contemporary streetwear pieces.
                  If an item reaches you damaged, defective, or in the wrong size, our team is committed to making it right
                  through prompt exchanges or full refunds.
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col gap-3 text-[10px] uppercase tracking-[0.2em] shrink-0">
                <div className="flex items-center gap-2 text-brand-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-black" />
                  <span>Defect Protection</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-black" />
                  <span>Size Exchanges</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-black" />
                  <span>Fast Bank Refunds</span>
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
                  Policy Sections
                </p>
                <nav className="flex flex-col space-y-3 text-xs tracking-wide text-brand-muted">
                  <a href="#defect-coverage" className="hover:text-brand-black transition-colors">01. Defective or Damaged Pieces</a>
                  <a href="#size-exchanges" className="hover:text-brand-black transition-colors">02. Size &amp; Fit Exchanges</a>
                  <a href="#eligibility" className="hover:text-brand-black transition-colors">03. Return Eligibility Conditions</a>
                  <a href="#step-by-step" className="hover:text-brand-black transition-colors">04. How to Request a Return</a>
                  <a href="#refund-timeline" className="hover:text-brand-black transition-colors">05. Refund Method &amp; Timelines</a>
                  <a href="#cancellations" className="hover:text-brand-black transition-colors">06. Order Cancellations</a>
                  <a href="#client-support" className="hover:text-brand-black transition-colors">07. Support &amp; Assistance</a>
                </nav>

                <div className="pt-6 border-t border-brand-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Customer Desk</p>
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
              <article id="defect-coverage" className="space-y-4 border-t border-brand-border pt-8 first:border-t-0 first:pt-0">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 01
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Defective, Damaged or Incorrect Deliveries (100% Protected)
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Every WASTE® garment undergoes strict quality inspection prior to packaging. In the rare event you receive
                    a piece that has:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>A manufacturing defect (e.g. stitching faults, fabric flaws, broken hardware).</li>
                    <li>Sustained physical damage during courier transit.</li>
                    <li>An incorrect garment, color, or size differing from what was ordered.</li>
                  </ul>
                  <p>
                    <strong className="text-brand-black font-medium">Full Protection:</strong> WASTE® will arrange a complimentary
                    reverse pickup and provide either a brand-new replacement piece (subject to drop availability) or a 100% full refund
                    to your original payment source, including all associated costs.
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-4 text-xs text-brand-muted">
                    <p className="font-semibold text-brand-black mb-1">Reporting Window:</p>
                    <p>
                      Please notify our team within <strong className="text-brand-black font-semibold">48 hours to 7 calendar days</strong> of
                      parcel delivery with photographs or unboxing video evidence documenting the defect.
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 02 */}
              <article id="size-exchanges" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 02
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Size &amp; Fit Exchanges
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    We want you to feel confident and comfortable in every WASTE® silhouette. If the piece you ordered does not
                    fit as desired, we offer size exchanges subject to stock or preorder allocation availability in the requested size.
                  </p>
                  <p>
                    To qualify for a size exchange:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>The exchange request must be initiated within <strong className="text-brand-black font-semibold">7 calendar days</strong> of receiving your delivery.</li>
                    <li>The garment must strictly satisfy the Return Eligibility Conditions detailed in Section 03 below.</li>
                    <li>If the requested replacement size is completely sold out due to limited drop capacity, our team will offer an exchange for another available piece or a full refund.</li>
                  </ul>
                </div>
              </article>

              {/* SECTION 03 */}
              <article id="eligibility" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 03
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Return &amp; Exchange Eligibility Conditions
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Due to the limited-edition, luxury nature of our streetwear collections, returned items must be in pristine,
                    resalable condition:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <div className="border border-brand-border bg-brand-surface p-4">
                      <p className="text-[10px] uppercase tracking-wider text-green-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                        Eligible for Return / Exchange
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-brand-muted">
                        <li>&bull; Unworn, unwashed, and unaltered</li>
                        <li>&bull; All brand tags &amp; woven labels attached</li>
                        <li>&bull; Original packaging &amp; garment dustbag included</li>
                        <li>&bull; Free of stains, makeup marks, or snags</li>
                        <li>&bull; Free of perfumes, deodorant, or body scents</li>
                      </ul>
                    </div>

                    <div className="border border-brand-border bg-brand-surface p-4">
                      <p className="text-[10px] uppercase tracking-wider text-red-700 font-semibold flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-red-700" />
                        Ineligible / Non-Returnable
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-brand-muted">
                        <li>&bull; Items washed, worn outdoors, or altered</li>
                        <li>&bull; Tags detached, removed, or missing</li>
                        <li>&bull; Garments with fragrance, smoke, or wash scents</li>
                        <li>&bull; Items damaged through customer misuse</li>
                        <li>&bull; Items explicitly marked &ldquo;Final Drop Archive&rdquo;</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>

              {/* SECTION 04 */}
              <article id="step-by-step" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 04
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Step-by-Step Return &amp; Exchange Procedure
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>Initiating a return or exchange with WASTE® is simple and transparent:</p>
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-brand-black font-medium">Step 1 — Submit Your Request:</strong> Contact our team
                      via our official{" "}
                      <Link href="/contact" className="text-brand-black underline font-medium">
                        Contact Page
                      </Link>{" "}
                      (selecting topic <em>&ldquo;Returns and exchanges&rdquo;</em>) or email us directly at{" "}
                      <a href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`} className="text-brand-black underline font-medium">
                        {BRAND_CONFIG.contact.officialBusinessEmail}
                      </a>
                      . Include your Order Number (<code className="text-xs bg-brand-surfaceSubtle px-1 py-0.5 rounded">WST-...</code> or{" "}
                      <code className="text-xs bg-brand-surfaceSubtle px-1 py-0.5 rounded">PRE-...</code>), the reason for return/exchange,
                      and clear photographs.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Step 2 — Approval &amp; Courier Coordination:</strong> Our
                      concierge team will review your request within 24 to 48 business hours. Once verified, we will arrange
                      a reverse pickup through our logistics partner or provide return shipping instructions.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Step 3 — Quality Inspection:</strong> When the piece arrives
                      back at our studio, our inspection team verifies condition, tags, and cleanliness within 2 business days.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Step 4 — Resolution:</strong> Your replacement size is dispatched
                      immediately, or your refund is initiated to your bank account.
                    </li>
                  </ol>
                </div>
              </article>

              {/* SECTION 05 */}
              <article id="refund-timeline" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 05
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Refund Method &amp; Processing Timelines
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Once a return is received and passes quality inspection, the refund is initiated immediately:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-brand-black font-medium">Original Payment Method (PhonePe):</strong> If paid online
                      via UPI, credit card, debit card, or net banking, the refund is reversed directly to the original account through
                      the PhonePe payment gateway.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Bank Processing Timeline:</strong> Refunds typically reflect in
                      your bank statement or card balance within <span className="text-brand-black font-semibold">5 to 7 business days</span>{" "}
                      from the date of initiation, depending on your issuing bank&apos;s settlement schedule.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Email Confirmation:</strong> You will receive an official
                      refund receipt and transaction reference number via email once the transfer is processed.
                    </li>
                  </ul>
                </div>
              </article>

              {/* SECTION 06 */}
              <article id="cancellations" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 06
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Order &amp; Preorder Cancellations
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    <strong className="text-brand-black font-medium">Cancellations Prior to Dispatch:</strong> You may cancel any
                    order or preorder allocation free of charge at any time before the package is handed over to our courier partner.
                    Simply email us at{" "}
                    <a href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`} className="text-brand-black underline font-medium">
                      {BRAND_CONFIG.contact.officialBusinessEmail}
                    </a>{" "}
                    with your order number. If payment was made, 100% of the amount is refunded immediately.
                  </p>
                  <p>
                    <strong className="text-brand-black font-medium">After Dispatch:</strong> Once a package has been dispatched
                    and an AWB tracking number has been generated, orders cannot be directly cancelled in transit. You may instead
                    refuse the delivery upon courier arrival or initiate a return upon receipt following Section 04.
                  </p>
                </div>
              </article>

              {/* SECTION 07 */}
              <article id="client-support" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Section 07
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Client Support &amp; Contact Desk
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    For any questions regarding sizing advice, order adjustments, returns, or exchange status, our team is
                    here to assist:
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-5 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-brand-black font-semibold">
                      WASTE® Client Care &amp; Support
                    </p>
                    <p className="text-xs text-brand-muted">
                      Founder / Studio Lead: {BRAND_CONFIG.founder.name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      Support Email:{" "}
                      <a
                        href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                        className="text-brand-black underline"
                      >
                        {BRAND_CONFIG.contact.officialBusinessEmail}
                      </a>
                    </p>
                    <p className="text-xs text-brand-muted">
                      Direct Inquiries:{" "}
                      <Link href="/contact" className="text-brand-black underline">
                        Official Inquiry Form
                      </Link>
                    </p>
                    <p className="text-xs text-brand-muted">
                      Studio Origin: Jaipur, Rajasthan, India
                    </p>
                  </div>
                </div>
              </article>

              {/* Cross-Policy Navigation Links */}
              <div className="border-t border-brand-border pt-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted mb-4">
                  Related Brand Policies &amp; Terms
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
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
                    href="/terms-and-conditions"
                    className="group border border-brand-border bg-brand-surface p-4 transition-colors hover:border-brand-black"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-brand-muted block">Legal Agreement</span>
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
