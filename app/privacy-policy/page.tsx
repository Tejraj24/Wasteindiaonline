import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/navigation/BackButton";
import { BRAND_CONFIG } from "@/lib/config/brand";
import { ShieldCheck, Lock, Eye, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | WASTE® — Contemporary Indian Streetwear",
  description:
    "Official Privacy Policy for WASTE®. Read how we collect, protect, process, and respect customer information, order transactions, and account security across India.",
  alternates: {
    canonical: "https://www.wasteluxe.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | WASTE®",
    description:
      "Learn how WASTE® safeguards your personal information, authentication credentials, and preorder transactions.",
    url: "https://www.wasteluxe.in/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
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
              Legal Commitment &bull; Client Privacy
            </span>
            <h1 className="mt-4 font-editorial text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.04em] uppercase text-brand-black">
              Privacy <span className="text-brand-gold italic">Policy</span>
            </h1>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-brand-muted">
              Last Updated: {lastUpdated} &bull; Effective for all clients &amp; visitors of wasteluxe.in
            </p>
          </div>

          {/* Quick Reassurance Summary Card */}
          <div className="mt-10 border border-brand-border bg-brand-surface p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-black font-semibold">
                    Core Privacy Principle
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-brand-muted">
                  WASTE® values your trust and individuality. We collect only the data necessary to fulfill
                  your contemporary streetwear orders, authenticate your account, deliver reliable customer service,
                  and ensure seamless checkout. We never sell, rent, or trade your personal information.
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col gap-3 text-[10px] uppercase tracking-[0.2em] shrink-0">
                <div className="flex items-center gap-2 text-brand-muted">
                  <Lock className="h-3.5 w-3.5 text-brand-black" />
                  <span>Encrypted Auth</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <Eye className="h-3.5 w-3.5 text-brand-black" />
                  <span>No Ad Trackers</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <FileText className="h-3.5 w-3.5 text-brand-black" />
                  <span>RBI-Compliant PG</span>
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
                  Policy Index
                </p>
                <nav className="flex flex-col space-y-3 text-xs tracking-wide text-brand-muted">
                  <a href="#section-1" className="hover:text-brand-black transition-colors">01. Information We Collect</a>
                  <a href="#section-2" className="hover:text-brand-black transition-colors">02. How We Use Information</a>
                  <a href="#section-3" className="hover:text-brand-black transition-colors">03. Payment &amp; Security</a>
                  <a href="#section-4" className="hover:text-brand-black transition-colors">04. How We Handle Your Information</a>
                  <a href="#section-5" className="hover:text-brand-black transition-colors">05. Cookies &amp; Local Storage</a>
                  <a href="#section-6" className="hover:text-brand-black transition-colors">06. Data Retention &amp; Rights</a>
                  <a href="#section-7" className="hover:text-brand-black transition-colors">07. Privacy Grievances</a>
                </nav>

                <div className="pt-6 border-t border-brand-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Inquiries</p>
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
              <article id="section-1" className="space-y-4 border-t border-brand-border pt-8 first:border-t-0 first:pt-0">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 01
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Information We Collect
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    When you engage with {BRAND_CONFIG.brandName} via our website (
                    <strong className="text-brand-black font-medium">wasteluxe.in</strong>), we collect information
                    strictly necessary to fulfill orders, create customer accounts, and communicate with you:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-brand-black font-medium">Account Details:</strong> When you register an account,
                      we collect your full name, email address, and authentication credentials. If you choose Google Sign-In,
                      Google provides your verified name and email address. Passwords are never stored as plain text.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Order &amp; Delivery Information:</strong> During checkout or
                      preorder reservation, we collect your recipient name, delivery street address, apartment/suite number,
                      city, state, 6-digit postal pincode (India), email address, and mobile phone number for courier updates
                      and SMS dispatch alerts.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Order History &amp; Wishlists:</strong> Products reserved,
                      preorder identifiers (<code className="text-xs bg-brand-surfaceSubtle px-1 py-0.5 rounded">PRE-XXXX</code>),
                      transaction timestamps, order statuses, and wishlist bookmarks saved to your account.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Customer Support Communications:</strong> Any information
                      you provide when submitting our official inquiry form or emailing us directly, including inquiry category,
                      message contents, and order references.
                    </li>
                  </ul>
                </div>
              </article>

              {/* SECTION 02 */}
              <article id="section-2" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 02
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  How We Use Your Information
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>We process your personal information strictly for legitimate commercial purposes:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To receive, allocate, and process your streetwear preorders and standard orders.</li>
                    <li>To dispatch packages and provide tracking updates with our domestic courier partners.</li>
                    <li>To send automated order confirmation and status notification emails via our verified email delivery partner.</li>
                    <li>To authenticate client sessions, remember saved shipping addresses, and maintain your personal wishlist.</li>
                    <li>To assist you with customer inquiries, size advice, address corrections, returns, or exchanges.</li>
                    <li>To detect and prevent fraudulent transactions, duplicate submissions, and automated abuse.</li>
                  </ul>
                </div>
              </article>

              {/* SECTION 03 */}
              <article id="section-3" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 03
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Payment Processing &amp; Financial Security
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    <strong className="text-brand-black font-medium">We do NOT store or process your banking credentials:</strong>{" "}
                    WASTE® does not collect, record, or retain sensitive payment instrument data—including debit/credit card numbers,
                    CVV codes, expiry dates, net banking passwords, or UPI PINs—on our servers or databases.
                  </p>
                  <p>
                    All electronic payment transactions are routed securely through{" "}
                    <strong className="text-brand-black font-medium">PhonePe</strong>, a Reserve Bank of India (RBI) authorized
                    payment aggregator, employing bank-grade TLS encryption and SHA-256 signature verification.
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-4 text-xs text-brand-muted">
                    <p className="font-medium text-brand-black mb-1">Preorder Allocation Note:</p>
                    Certain limited pieces or exclusive drops are structured as payment-free preorders where capacity is allocated
                    without upfront payment. When payments are enabled, PhonePe handles the checkout session securely.
                  </div>
                </div>
              </article>

              {/* SECTION 04 */}
              <article id="section-4" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 04
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  How We Handle Your Information
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    To operate our website and fulfill our services to you, personal information may be processed by
                    service providers when reasonably necessary. These operational activities include:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-brand-black font-medium">Website Operation &amp; Hosting:</strong> Maintaining
                      site availability, database storage, and platform security.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">User Authentication:</strong> Managing account logins,
                      identity verification, and session security.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Order &amp; Payment Processing:</strong> Facilitating
                      electronic payment transactions and processing order records.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Transactional Communications:</strong> Sending order
                      confirmations, status notifications, and customer service correspondence.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">Product Delivery &amp; Logistics:</strong> Sharing recipient
                      shipping addresses and contact details with delivery partners strictly to transport and track your packages.
                    </li>
                  </ul>
                  <p>
                    We share only the information reasonably required to carry out these essential functions, and we do not
                    sell or rent your personal information to third parties for commercial marketing purposes.
                  </p>
                </div>
              </article>

              {/* SECTION 05 */}
              <article id="section-5" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 05
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Cookies, Local Storage &amp; Tracking
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    WASTE® respects customer privacy and does not engage in aggressive cross-site tracking or selling behavioral profiles:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-brand-black font-medium">Essential Browser Storage:</strong> We use browser
                      local storage and session tokens to remember your shopping bag items across pages and keep you securely
                      logged into your account.
                    </li>
                    <li>
                      <strong className="text-brand-black font-medium">No Third-Party Advertising Pixels:</strong> Our website does
                      not run third-party advertising cookies or cross-site tracking scripts.
                    </li>
                  </ul>
                </div>
              </article>

              {/* SECTION 06 */}
              <article id="section-6" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 06
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Data Retention, Account Deletion &amp; Your Rights
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    We retain your personal information for as long as your account remains active or as needed to provide you
                    services. We also retain transaction records as necessary to comply with applicable tax, commercial accounting,
                    and statutory obligations under Indian law.
                  </p>
                  <p>As a client of WASTE®, you hold the right to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Review the personal information stored in your account profile and update saved delivery addresses at any time.</li>
                    <li>Request a copy of your stored order records and account data.</li>
                    <li>Request the deletion or deactivation of your account and associated personal data, subject to statutory record-keeping requirements.</li>
                  </ul>
                  <p>
                    To exercise any of these rights, simply email our team at{" "}
                    <a
                      href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                      className="text-brand-black underline hover:opacity-75 font-medium"
                    >
                      {BRAND_CONFIG.contact.officialBusinessEmail}
                    </a>
                    .
                  </p>
                </div>
              </article>

              {/* SECTION 07 */}
              <article id="section-7" className="space-y-4 border-t border-brand-border pt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium">
                  Clause 07
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Grievance Officer &amp; Communication Channels
                </h2>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-brand-muted sm:leading-7">
                  <p>
                    Under the Information Technology Act, 2000 and the rules made thereunder, any privacy queries, concerns,
                    or grievances regarding the processing of your data may be directed to our official administrative channel:
                  </p>
                  <div className="border border-brand-border bg-brand-surface p-5 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-brand-black font-semibold">
                      WASTE® Privacy &amp; Compliance Desk
                    </p>
                    <p className="text-xs text-brand-muted">
                      Founder / Executive Office: {BRAND_CONFIG.founder.name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      Official Email:{" "}
                      <a
                        href={`mailto:${BRAND_CONFIG.contact.officialBusinessEmail}`}
                        className="text-brand-black underline"
                      >
                        {BRAND_CONFIG.contact.officialBusinessEmail}
                      </a>
                    </p>
                    <p className="text-xs text-brand-muted">
                      Jurisdiction: Jaipur, Rajasthan, India
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
