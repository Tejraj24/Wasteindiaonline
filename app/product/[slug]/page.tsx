import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  StorefrontProduct,
} from "@/lib/services/product.service";
import { getCategoryByProductSlug } from "@/lib/config/categories";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { BackButton } from "@/components/navigation/BackButton";
import { Footer } from "@/components/Footer";

export const revalidate = 0; // Dynamic server rendering with live product updates

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function cleanProductMetaDescription(description?: string, title?: string): string {
  const sanitized = description ? description.replace(/WASTE\s*\u00AE/g, "WASTE") : description;
  const fallback = `${title || "Piece"} — Contemporary Indian streetwear crafted by WASTE. Distinctive silhouette and premium heavyweight fabric.`;
  if (!sanitized || typeof sanitized !== "string") return fallback;

  // Split into paragraphs, clean whitespace and markdown/bullet artifacts
  const paragraphs = sanitized
    .split(/\r?\n\s*\r?\n/)
    .map((p) =>
      p
        .replace(/^[#\s*•\-–—]+/gm, "")
        .replace(/\r?\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);

  const headerPrefixes = [
    "product details",
    "the fit",
    "fit & feel",
    "how to style",
    "care instructions",
    "the details",
    "how it fits",
  ];

  // Find paragraphs that are genuine narrative descriptions (length >= 50, not all-caps title, not a section header)
  const candidate = paragraphs.find((p) => {
    if (p.length < 50) return false;
    const lower = p.toLowerCase();
    if (headerPrefixes.some((prefix) => lower.startsWith(prefix))) return false;
    const letters = p.replace(/[^a-zA-Z]/g, "");
    if (letters.length > 0 && letters === letters.toUpperCase()) return false;
    return true;
  });

  const chosenText = candidate || paragraphs.find((p) => p.length >= 35) || fallback;

  // Sensibly clamp around 155 characters at word boundary
  const maxLen = 155;
  if (chosenText.length <= maxLen + 5) {
    return chosenText;
  }

  const truncated = chosenText.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  const cleanSnippet = (lastSpace > 110 ? truncated.slice(0, lastSpace) : truncated).trim();
  return `${cleanSnippet}…`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product || product.status !== "ACTIVE") {
    return {
      title: "Product Not Found | WASTE",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cleanDescription = cleanProductMetaDescription(product.description, product.title);
  const canonicalUrl = `https://www.wasteluxe.in/product/${product.slug}`;
  const imageList = product.images[0] ? [product.images[0]] : [];

  return {
    title: `${product.title} | WASTE`,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | WASTE`,
      description: cleanDescription,
      url: canonicalUrl,
      images: imageList,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | WASTE`,
      description: cleanDescription,
      images: imageList,
    },
  };
}

function ProductGallery({ product }: { product: StorefrontProduct }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
      {product.images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`aspect-[3/4] overflow-hidden border border-brand-border bg-brand-surfaceSubtle ${
            product.images.length === 1 || (index === 0 && product.images.length % 2 === 1)
              ? "sm:col-span-2"
              : ""
          }`}
        >
          <img
            src={image}
            alt={`${product.title} view ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
          />
        </div>
      ))}
    </div>
  );
}

function InformationAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-t border-brand-border py-4 sm:py-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] text-brand-black transition-colors hover:text-brand-muted [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="text-lg font-light text-brand-muted transition-transform duration-300 group-open:rotate-45 group-hover:text-brand-black">
          +
        </span>
      </summary>
      <div className="max-w-md pb-2 pt-2 text-xs sm:text-sm leading-relaxed text-[#706E68]">
        {children}
      </div>
    </details>
  );
}

async function RelatedProducts({ product }: { product: StorefrontProduct }) {
  let related = await getProductsByCategory(product.category, 4, product.id);

  // Fallback to other active catalog pieces if category has no siblings
  if (related.length === 0) {
    const featured = await getFeaturedProducts(5);
    related = featured.filter((p) => p.id !== product.id).slice(0, 4);
  }

  if (related.length === 0) return null;

  return (
    <section className="border-t border-brand-border px-6 py-20 md:px-12 md:py-28">
      <div className="mb-10 flex items-end justify-between border-b border-brand-border pb-5">
        <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl leading-none tracking-[-0.03em] text-brand-black">
          You may also like
        </h2>
        <Link
          href="/shop"
          className="hidden text-xs sm:text-[13px] uppercase tracking-[0.16em] text-brand-muted transition hover:text-brand-black sm:block"
        >
          View collection →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
        {related.map((relatedProduct) => (
          <Link
            key={relatedProduct.id}
            href={`/product/${relatedProduct.slug}`}
            className="group flex flex-col"
          >
            <div className="aspect-[3/4] overflow-hidden border border-brand-border bg-brand-surfaceSubtle">
              <img
                src={relatedProduct.images[0] || ""}
                alt={relatedProduct.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 pt-3 sm:pt-4 text-[13px] sm:text-sm uppercase tracking-[0.08em] text-brand-black">
              <span className="truncate leading-tight font-medium group-hover:text-brand-muted transition-colors">
                {relatedProduct.title.split(" — ")[0] || relatedProduct.title.split(" - ")[0]}
              </span>
              <span className="whitespace-nowrap font-mono text-xs sm:text-sm font-semibold text-brand-black">
                {formatPrice(relatedProduct.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product || product.status !== "ACTIVE") notFound();

  const categoryConfig = getCategoryByProductSlug(product.slug);

  const isSoldOut =
    product.soldOut ||
    product.status !== "ACTIVE" ||
    (!product.isPreorder && product.inventory <= 0) ||
    (product.isPreorder &&
      product.preorderCapacity !== null &&
      product.preorderCapacity !== undefined &&
      product.preorderAllocated >= product.preorderCapacity);

  const availability = isSoldOut
    ? "https://schema.org/OutOfStock"
    : product.isPreorder
    ? "https://schema.org/PreOrder"
    : "https://schema.org/InStock";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    description: product.description || undefined,
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "WASTE",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.wasteluxe.in/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbItems = [
    {
      position: 1,
      name: "Home",
      item: "https://www.wasteluxe.in",
    },
    {
      position: 2,
      name: "Shop",
      item: "https://www.wasteluxe.in/shop",
    },
  ];

  if (categoryConfig) {
    breadcrumbItems.push({
      position: 3,
      name: categoryConfig.name,
      item: `https://www.wasteluxe.in/shop/${categoryConfig.slug}`,
    });
    breadcrumbItems.push({
      position: 4,
      name: product.title,
      item: `https://www.wasteluxe.in/product/${product.slug}`,
    });
  } else {
    breadcrumbItems.push({
      position: 3,
      name: product.title,
      item: `https://www.wasteluxe.in/product/${product.slug}`,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b) => ({
      "@type": "ListItem",
      position: b.position,
      name: b.name,
      item: b.item,
    })),
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="pb-24 pt-32 md:pt-44">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4">
            <BackButton fallbackHref="/shop" label="Back to shop" variant="default" />
            <nav
              aria-label="Breadcrumb"
              className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] text-brand-muted"
            >
              <Link href="/" className="transition hover:text-brand-black">
                Home
              </Link>
              <span className="mx-2.5 text-brand-border">/</span>
              <Link href="/shop" className="transition hover:text-brand-black">
                Shop
              </Link>
              <span className="mx-2.5 text-brand-border">/</span>
              {categoryConfig ? (
                <>
                  <Link
                    href={`/shop/${categoryConfig.slug}`}
                    className="transition hover:text-brand-black"
                  >
                    {categoryConfig.name}
                  </Link>
                  <span className="mx-2.5 text-brand-border">/</span>
                </>
              ) : null}
              <span className="text-brand-black font-medium">{product.title}</span>
            </nav>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-20">
            <ProductGallery product={product} />

            <section className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-brand-muted font-medium">
                {categoryConfig ? (
                  <Link
                    href={`/shop/${categoryConfig.slug}`}
                    className="transition-colors hover:text-brand-black underline-offset-4 hover:underline"
                  >
                    {categoryConfig.name}
                  </Link>
                ) : (
                  <Link
                    href="/shop"
                    className="transition-colors hover:text-brand-black underline-offset-4 hover:underline"
                  >
                    {product.category || "Collection"}
                  </Link>
                )}{" "}
                / {product.sku}
              </p>
              <h1 className="mt-4 max-w-xl font-editorial text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3rem] leading-[1.05] tracking-[-0.02em] text-brand-black break-words">
                {product.title}
              </h1>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-[1.75rem] font-mono font-semibold tracking-tight text-brand-black">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm sm:text-base font-mono text-brand-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <p className="mt-6 max-w-md text-sm sm:text-[15px] lg:text-base leading-relaxed text-[#706E68]">
                {product.description}
              </p>

              <ProductPurchasePanel
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice || null,
                  image: product.images[0] || "",
                  sku: product.sku,
                  category: product.category,
                  soldOut: product.soldOut,
                  isPreorder: product.isPreorder,
                  expectedShipmentText: product.expectedShipmentText,
                  releaseDate: product.releaseDate,
                }}
              />

              <div className="mt-8 border-b border-brand-border">
                <InformationAccordion title="Size guide">
                  Our standard fit is designed for an easy, relaxed silhouette.
                  Choose your usual size for the intended fit, or size down for a
                  closer shape.
                </InformationAccordion>
                <InformationAccordion title="Product details">
                  Crafted with considered materials and finished with the WASTE
                  point of view. See the product description above for the specific
                  construction and material notes.
                </InformationAccordion>
                <InformationAccordion title="Shipping">
                  Orders are prepared from India. Delivery timing and shipping
                  rates are calculated during checkout based on your delivery
                  address. Review our{" "}
                  <Link
                    href="/shipping-policy"
                    className="underline text-brand-black hover:opacity-75 transition-opacity"
                  >
                    Shipping &amp; Delivery Policy
                  </Link>{" "}
                  for full fulfillment details.
                </InformationAccordion>
                <InformationAccordion title="Returns">
                  Items must be unworn, unwashed, and returned with original tags.
                  Returns and size exchanges are accepted within 7 calendar days
                  of delivery. View our complete{" "}
                  <Link
                    href="/return-refund-policy"
                    className="underline text-brand-black hover:opacity-75 transition-opacity"
                  >
                    Return &amp; Refund Policy
                  </Link>{" "}
                  for step-by-step instructions.
                </InformationAccordion>
              </div>
            </section>
          </div>
        </div>
        <RelatedProducts product={product} />
      </main>
      <Footer />
    </div>
  );
}
