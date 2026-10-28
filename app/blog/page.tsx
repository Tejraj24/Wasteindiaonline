import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { getArticles, calculateReadingTime } from "@/lib/config/blog";

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata: Metadata = {
  title: "WASTE Journal | Streetwear Style & Fashion Guides",
  description:
    "Explore the WASTE Journal for contemporary Indian streetwear guides, oversized t-shirt styling ideas, graphic tee outfit blueprints, and modern culture.",
  alternates: {
    canonical: "https://www.wasteluxe.in/blog",
  },
  openGraph: {
    title: "WASTE Journal | Streetwear Style & Fashion Guides",
    description:
      "Explore the WASTE Journal for contemporary Indian streetwear guides, oversized t-shirt styling ideas, graphic tee outfit blueprints, and modern culture.",
    url: "https://www.wasteluxe.in/blog",
    siteName: "WASTE INDIA",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792930001/modern-heritage_xbx276.jpg",
        width: 1200,
        height: 800,
        alt: "WASTE Journal — Contemporary Streetwear & Culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WASTE Journal | Streetwear Style & Fashion Guides",
    description:
      "Explore the WASTE Journal for contemporary Indian streetwear guides, oversized t-shirt styling ideas, and modern culture.",
    images: [
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792930001/modern-heritage_xbx276.jpg",
    ],
  },
};

export default function BlogHubPage() {
  const articles = getArticles();
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "WASTE Journal",
    description:
      "Contemporary Indian streetwear guides, oversized t-shirt styling ideas, and modern culture essays.",
    url: "https://www.wasteluxe.in/blog",
    publisher: {
      "@type": "Organization",
      name: "WASTE INDIA",
      url: "https://www.wasteluxe.in/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.wasteluxe.in/icon.png",
      },
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-screen bg-brand-bg text-brand-black selection:bg-brand-black selection:text-brand-bg font-sans">
        {/* =========================================================================
            HEADER & HERO SECTION
            Editorial magazine aesthetic with subtle borders and refined typography.
            ========================================================================= */}
        <section className="pt-28 pb-14 md:pt-36 md:pb-20 border-b border-brand-border">
          <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12">
            {/* Breadcrumb Trail */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-muted">
                <li>
                  <Link href="/" className="hover:text-brand-black transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-brand-muted/40">/</li>
                <li className="text-brand-black font-medium">Journal</li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-brand-gold mb-3">
                  WASTE Editorial
                </span>
                <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.05] text-brand-black">
                  Streetwear, Style &amp; Culture
                </h1>
              </div>
              <p className="max-w-md text-sm md:text-base text-brand-muted leading-relaxed font-light">
                Essays, outfit blueprints, and honest perspectives on contemporary Indian streetwear, silhouette proportions, and garment craft.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FEATURED ARTICLE
            Prominent full-bleed or wide editorial card spotlighting the lead guide.
            ========================================================================= */}
        {featuredArticle && (
          <section className="py-12 md:py-16 border-b border-brand-border">
            <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12">
              <div className="mb-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-muted">
                  Featured Story
                </span>
              </div>

              <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-brand-surface p-6 sm:p-8 md:p-10 border border-brand-border transition-all duration-300 hover:border-brand-black/40">
                <div className="lg:col-span-7 overflow-hidden bg-brand-surfaceSubtle aspect-[16/10] sm:aspect-[16/9]">
                  <Link href={`/blog/${featuredArticle.slug}`} tabIndex={-1} aria-hidden="true">
                    <img
                      src={featuredArticle.featuredImage}
                      alt={featuredArticle.featuredImageAlt}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="eager"
                    />
                  </Link>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-brand-muted mb-4">
                      <span className="px-2.5 py-1 bg-brand-surfaceSubtle text-brand-black border border-brand-border text-[10px]">
                        {featuredArticle.category}
                      </span>
                      <span>•</span>
                      <span>{calculateReadingTime(featuredArticle)} min read</span>
                    </div>

                    <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-tight text-brand-black mb-4">
                      <Link
                        href={`/blog/${featuredArticle.slug}`}
                        className="hover:underline underline-offset-4 transition-colors"
                      >
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-light mb-6">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                    <span className="text-xs font-mono text-brand-muted">
                      {new Date(featuredArticle.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/blog/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors"
                    >
                      <span>Read Story</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* =========================================================================
            ARTICLES GRID
            Curated list of editorial articles in a balanced 2-column or 3-column layout.
            ========================================================================= */}
        <section className="py-14 md:py-20 border-b border-brand-border">
          <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-brand-border">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-brand-black">
                Latest Publications
              </h2>
              <span className="text-xs font-mono text-brand-muted">
                {articles.length} Stories Published
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {gridArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group flex flex-col justify-between bg-brand-surface p-6 sm:p-8 border border-brand-border transition-all duration-300 hover:border-brand-black/40"
                >
                  <div>
                    <div className="overflow-hidden bg-brand-surfaceSubtle aspect-[16/10] mb-6">
                      <Link href={`/blog/${article.slug}`} tabIndex={-1} aria-hidden="true">
                        <img
                          src={article.featuredImage}
                          alt={article.featuredImageAlt}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-brand-muted mb-3">
                      <span className="px-2 py-0.5 bg-brand-surfaceSubtle text-brand-black border border-brand-border text-[10px]">
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>{calculateReadingTime(article)} min read</span>
                    </div>

                    <h3 className="font-cormorant text-2xl sm:text-3xl font-normal tracking-tight leading-snug text-brand-black mb-3">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:underline underline-offset-4 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-brand-muted leading-relaxed font-light mb-6">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                    <span className="text-xs font-mono text-brand-muted">
                      {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors"
                    >
                      <span>Read Story</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            DISCOVERY / COLLECTION CALLOUT
            Bridging editorial insight with concrete streetwear collections.
            ========================================================================= */}
        <section className="py-16 md:py-24 bg-brand-surfaceSubtle">
          <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-brand-gold block mb-3">
                Crafted in India
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-brand-black mb-6">
                Silhouettes Born from Emotional Chaos
              </h2>
              <p className="text-sm md:text-base text-brand-muted leading-relaxed font-light mb-8 max-w-xl mx-auto">
                Explore our heavyweight oversized tees, distinct waffle textures, and structured layers designed for individual self-expression.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shop/t-shirts"
                  className="px-6 py-3.5 bg-brand-black text-brand-surface text-xs font-mono uppercase tracking-widest hover:bg-brand-black/85 transition-colors"
                >
                  Shop T-Shirts &amp; Tops
                </Link>
                <Link
                  href="/shop/outerwear"
                  className="px-6 py-3.5 bg-brand-surface text-brand-black border border-brand-border text-xs font-mono uppercase tracking-widest hover:border-brand-black transition-colors"
                >
                  Explore Outerwear
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
