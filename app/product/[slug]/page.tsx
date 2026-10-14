import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductsByCategory,
  StorefrontProduct,
} from "@/lib/services/product.service";
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  return product
    ? {
        title: `${product.title} | WASTE.`,
        description: product.description || `${product.title} by WASTE.`,
        openGraph: {
          title: `${product.title} | WASTE.`,
          description: product.description,
          images: product.images[0] ? [product.images[0]] : [],
        },
      }
    : { title: "Product | WASTE." };
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
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[10px] uppercase tracking-[0.22em] text-brand-black transition-colors hover:text-brand-muted [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="text-lg font-light text-brand-muted transition-transform duration-300 group-open:rotate-45 group-hover:text-brand-black">
          +
        </span>
      </summary>
      <div className="max-w-md pb-2 pt-2 text-xs leading-6 text-brand-muted">
        {children}
      </div>
    </details>
  );
}

async function RelatedProducts({ product }: { product: StorefrontProduct }) {
  const related = await getProductsByCategory(product.category, 4, product.id);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-brand-border px-6 py-20 md:px-12 md:py-28">
      <div className="mb-10 flex items-end justify-between border-b border-brand-border pb-5">
        <h2 className="font-editorial text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[-0.05em] text-brand-black md:text-6xl">
          You may also like
        </h2>
        <Link
          href="/shop"
          className="hidden text-[10px] uppercase tracking-[0.2em] text-brand-muted transition hover:text-brand-black sm:block"
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 pt-3 sm:pt-4 text-[10px] uppercase tracking-[0.1em] text-brand-black">
              <span className="truncate leading-tight group-hover:text-brand-muted transition-colors">
                {relatedProduct.title.split(" — ")[0]}
              </span>
              <span className="whitespace-nowrap font-mono font-semibold text-brand-black">
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
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black">
      <main className="pb-24 pt-32 md:pt-44">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4">
            <BackButton fallbackHref="/shop" label="Back to shop" variant="default" />
            <nav
              aria-label="Breadcrumb"
              className="text-[10px] uppercase tracking-[0.25em] text-brand-muted"
            >
              <Link href="/" className="transition hover:text-brand-black">
                WASTE.
              </Link>
              <span className="mx-3 text-brand-border">/</span>
              <Link href="/shop" className="transition hover:text-brand-black">
                Shop
              </Link>
              <span className="mx-3 text-brand-border">/</span>
              <span className="text-brand-black">{product.title.split(" — ")[0]}</span>
            </nav>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-20">
            <ProductGallery product={product} />

            <section className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                {product.category} / {product.sku}
              </p>
              <h1 className="mt-5 max-w-xl font-editorial text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.05em] text-brand-black break-words">
                {product.title}
              </h1>
              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="font-semibold text-brand-black">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-brand-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <p className="mt-7 max-w-md text-xs sm:text-sm leading-6 sm:leading-7 text-brand-muted">
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
                }}
              />

              <div className="mt-8 border-b border-brand-border">
                <InformationAccordion title="Size guide">
                  Our standard fit is designed for an easy, relaxed silhouette.
                  Choose your usual size for the intended fit, or size down for a
                  closer shape.
                </InformationAccordion>
                <InformationAccordion title="Product details">
                  Crafted with considered materials and finished with the WASTE.
                  point of view. See the product description above for the specific
                  construction and material notes.
                </InformationAccordion>
                <InformationAccordion title="Shipping">
                  Orders are prepared from India. Delivery timing and shipping
                  rates are confirmed during checkout based on your delivery
                  address.
                </InformationAccordion>
                <InformationAccordion title="Returns">
                  Items must be unworn, unwashed, and returned with original tags.
                  Final eligibility and the return window will be confirmed by the
                  active WASTE. returns policy.
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
