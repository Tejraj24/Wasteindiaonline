import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  calculateReadingTime,
} from "@/lib/config/blog";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const url = `https://www.wasteluxe.in/blog/${article.slug}`;

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      url,
      siteName: "WASTE INDIA",
      type: "article",
      locale: "en_IN",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 800,
          alt: article.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.metaDescription,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const readingTime = calculateReadingTime(article);

  // Retrieve related articles
  const relatedArticles = article.relatedSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.wasteluxe.in/blog/${article.slug}`,
    },
    author: {
      "@type": "Organization",
      name: "WASTE INDIA",
      url: "https://www.wasteluxe.in/",
    },
    publisher: {
      "@type": "Organization",
      name: "WASTE INDIA",
      url: "https://www.wasteluxe.in/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.wasteluxe.in/icon.png",
      },
    },
    isPartOf: {
      "@type": "Blog",
      name: "WASTE Journal",
      url: "https://www.wasteluxe.in/blog",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.wasteluxe.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: "https://www.wasteluxe.in/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://www.wasteluxe.in/blog/${article.slug}`,
      },
    ],
  };

  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <main className="min-h-screen bg-brand-bg text-brand-black selection:bg-brand-black selection:text-brand-bg font-sans">
        <article className="pt-28 pb-16 md:pt-36 md:pb-24">
          {/* =====================================================================
              ARTICLE HEADER & BREADCRUMBS
              ===================================================================== */}
          <header className="mx-auto w-full max-w-[960px] px-6 sm:px-8 mb-10 md:mb-14">
            {/* Breadcrumb Trail */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-muted">
                <li>
                  <Link href="/" className="hover:text-brand-black transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-brand-muted/40">/</li>
                <li>
                  <Link href="/blog" className="hover:text-brand-black transition-colors">
                    Journal
                  </Link>
                </li>
                <li aria-hidden="true" className="text-brand-muted/40">/</li>
                <li className="text-brand-black font-medium truncate max-w-[240px] sm:max-w-none">
                  {article.category}
                </li>
              </ol>
            </nav>

            {/* Category Badge & Meta Information */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-brand-muted mb-4">
              <span className="px-2.5 py-1 bg-brand-surface text-brand-black border border-brand-border text-[10px] font-medium">
                {article.category}
              </span>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span>•</span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>

            {/* Article Title */}
            <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] text-brand-black mb-6">
              {article.title}
            </h1>

            {/* Author / Byline */}
            <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs font-mono text-brand-muted">
              <span>By WASTE Editorial</span>
              {article.updatedAt && (
                <span>
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </header>

          {/* =====================================================================
              FEATURED IMAGE
              ===================================================================== */}
          <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 mb-12 md:mb-16">
            <figure className="overflow-hidden border border-brand-border bg-brand-surfaceSubtle">
              <div className="aspect-[16/9] w-full">
                <img
                  src={article.featuredImage}
                  alt={article.featuredImageAlt}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>
              <figcaption className="p-3 text-[11px] font-mono text-brand-muted tracking-wide text-center border-t border-brand-border bg-brand-surface">
                {article.featuredImageAlt}
              </figcaption>
            </figure>
          </div>

          {/* =====================================================================
              ARTICLE CONTENT WRAPPER
              ===================================================================== */}
          <div className="mx-auto w-full max-w-[840px] px-6 sm:px-8">
            {/* Table of Contents */}
            <nav
              aria-label="Table of Contents"
              className="p-6 md:p-8 bg-brand-surface border border-brand-border mb-12"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-brand-border">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand-black font-semibold">
                  Index &amp; Navigation
                </span>
                <span className="text-[11px] font-mono text-brand-muted">
                  {article.sections.length} Topics
                </span>
              </div>
              <ul className="space-y-2.5">
                {article.sections.map((section, idx) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-baseline gap-3 text-sm text-brand-muted hover:text-brand-black transition-colors"
                    >
                      <span className="text-xs font-mono text-brand-gold shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="group-hover:underline underline-offset-4 leading-relaxed">
                        {section.heading}
                      </span>
                    </a>
                  </li>
                ))}
                {article.faqs && article.faqs.length > 0 && (
                  <li>
                    <a
                      href="#frequently-asked-questions"
                      className="group flex items-baseline gap-3 text-sm text-brand-muted hover:text-brand-black transition-colors"
                    >
                      <span className="text-xs font-mono text-brand-gold shrink-0">
                        0{article.sections.length + 1}
                      </span>
                      <span className="group-hover:underline underline-offset-4 leading-relaxed">
                        Frequently Asked Questions
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>

            {/* Intro Lead Paragraphs */}
            <div className="space-y-6 mb-12">
              {article.intro.map((para, idx) => (
                <p
                  key={idx}
                  className={`text-brand-black leading-relaxed font-light ${
                    idx === 0
                      ? "text-lg sm:text-xl font-normal text-brand-black/90 leading-relaxed"
                      : "text-base sm:text-lg"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Sections */}
            <div className="space-y-14 md:space-y-16">
              {article.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-t border-brand-border pt-10"
                >
                  <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-brand-black mb-6">
                    {section.heading}
                  </h2>

                  <div className="space-y-5 text-base sm:text-lg text-brand-black/85 leading-relaxed font-light mb-6">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Callout Quote */}
                  {section.callout && (
                    <aside className="my-8 p-6 bg-brand-surface border-l-2 border-brand-gold border-y border-r border-brand-border">
                      {section.callout.title && (
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold block mb-2 font-medium">
                          {section.callout.title}
                        </span>
                      )}
                      <p className="font-cormorant text-lg sm:text-xl italic text-brand-black leading-snug">
                        &ldquo;{section.callout.text}&rdquo;
                      </p>
                    </aside>
                  )}

                  {/* Internal Link CTA Card */}
                  {section.internalLink && (
                    <div className="my-6 p-4 bg-brand-surfaceSubtle border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted block">
                          Styling Recommendation
                        </span>
                        <p className="text-sm font-medium text-brand-black">
                          {section.internalLink.text}
                        </p>
                      </div>
                      <Link
                        href={section.internalLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors shrink-0"
                      >
                        <span>{section.internalLink.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Frequently Asked Questions */}
            {article.faqs && article.faqs.length > 0 && (
              <section
                id="frequently-asked-questions"
                className="scroll-mt-28 border-t border-brand-border pt-12 mt-16"
              >
                <div className="mb-8">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold block mb-2">
                    Questions &amp; Answers
                  </span>
                  <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-brand-black">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-4">
                  {article.faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group bg-brand-surface border border-brand-border p-6 transition-all duration-200 open:border-brand-black/30"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-base sm:text-lg text-brand-black group-hover:text-brand-gold transition-colors">
                        <span>{faq.question}</span>
                        <span className="ml-4 font-mono text-xs text-brand-muted transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 pt-4 border-t border-brand-border text-sm sm:text-base text-brand-muted font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Conclusion */}
            {article.conclusion && article.conclusion.length > 0 && (
              <section className="border-t border-brand-border pt-12 mt-16 space-y-5">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold block">
                  Final Perspective
                </span>
                {article.conclusion.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-base sm:text-lg text-brand-black/90 font-light leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </section>
            )}

            {/* Related Collection Banner */}
            {article.relatedCollection && (
              <div className="my-16 p-8 md:p-10 bg-brand-surface border border-brand-border text-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-gold block mb-2">
                  Featured Collection
                </span>
                <h3 className="font-cormorant text-2xl sm:text-3xl font-light text-brand-black mb-3">
                  {article.relatedCollection.heading}
                </h3>
                <p className="text-sm text-brand-muted max-w-lg mx-auto mb-6 font-light leading-relaxed">
                  {article.relatedCollection.description}
                </p>
                <Link
                  href={article.relatedCollection.href}
                  className="inline-block px-7 py-3 bg-brand-black text-brand-surface text-xs font-mono uppercase tracking-widest hover:bg-brand-black/85 transition-colors"
                >
                  {article.relatedCollection.linkText}
                </Link>
              </div>
            )}

            {/* Back to Journal Link */}
            <div className="pt-8 border-t border-brand-border flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors"
              >
                <span aria-hidden="true">←</span>
                <span>Back to Journal</span>
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors"
              >
                <span>Browse Storefront</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        {/* =====================================================================
            RELATED STORIES SECTION
            ===================================================================== */}
        {relatedArticles.length > 0 && (
          <aside
            aria-label="Related Articles"
            className="py-16 md:py-20 border-t border-brand-border bg-brand-surfaceSubtle"
          >
            <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12">
              <div className="mb-10 pb-4 border-b border-brand-border flex items-center justify-between">
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-brand-black">
                  Related Guides &amp; Perspectives
                </h2>
                <Link
                  href="/blog"
                  className="text-xs font-mono uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors"
                >
                  View All Stories →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {relatedArticles.map((rel) => (
                  <article
                    key={rel.slug}
                    className="group bg-brand-surface p-6 sm:p-8 border border-brand-border transition-all duration-300 hover:border-brand-black/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="overflow-hidden bg-brand-surfaceSubtle aspect-[16/10] mb-6">
                        <Link href={`/blog/${rel.slug}`} tabIndex={-1} aria-hidden="true">
                          <img
                            src={rel.featuredImage}
                            alt={rel.featuredImageAlt}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-brand-muted mb-3">
                        <span className="px-2 py-0.5 bg-brand-surfaceSubtle text-brand-black border border-brand-border text-[10px]">
                          {rel.category}
                        </span>
                        <span>•</span>
                        <span>{calculateReadingTime(rel)} min read</span>
                      </div>

                      <h3 className="font-cormorant text-2xl font-normal tracking-tight leading-snug text-brand-black mb-3">
                        <Link
                          href={`/blog/${rel.slug}`}
                          className="hover:underline underline-offset-4 transition-colors"
                        >
                          {rel.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-brand-muted leading-relaxed font-light mb-6">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                      <span className="text-xs font-mono text-brand-muted">
                        {new Date(rel.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors"
                      >
                        <span>Read</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        )}
      </main>

      <Footer />
    </>
  );
}
