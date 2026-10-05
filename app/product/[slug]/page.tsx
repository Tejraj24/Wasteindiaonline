import Link from "next/link";
import { notFound } from "next/navigation";
import products from "@/data/products.json";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";

type Product = (typeof products)[number];

const legacyProductIds: Record<string, string> = {
  p1: "prod-001",
  p2: "prod-004",
  p3: "prod-002",
  p4: "prod-006",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getProduct(slug: string) {
  const productId = legacyProductIds[slug] ?? slug;
  return products.find((product) => product.id === productId);
}

export function generateStaticParams() {
  return [
    ...products.map((product) => ({ slug: product.id })),
    ...Object.keys(legacyProductIds).map((slug) => ({ slug })),
  ];
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  return product
    ? {
        title: `${product.title} | WASTE.`,
        description: product.description,
      }
    : { title: "Product | WASTE." };
}

function ProductGallery({ product }: { product: Product }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {product.images.map((image, index) => (
        <div key={image} className="aspect-[3/4] overflow-hidden bg-[#111]">
          <img
            src={image}
            alt={`${product.title} view ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function InformationAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-white/15 py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] uppercase tracking-[0.22em] [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="text-lg font-light transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="max-w-md pt-4 text-xs leading-6 text-white/55">{children}</div>
    </details>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const related = products
    .filter((candidate) => candidate.id !== product.id && candidate.category === product.category)
    .slice(0, 4);
  const fallback = related.length > 0
    ? related
    : products.filter((candidate) => candidate.id !== product.id).slice(0, 4);

  return (
    <section className="border-t border-white/15 px-6 py-24 md:px-12 md:py-32">
      <div className="mb-10 flex items-end justify-between border-b border-white/15 pb-5">
        <h2 className="font-editorial text-5xl leading-none tracking-[-0.05em] md:text-7xl">You may also like</h2>
        <Link href="/shop" className="hidden text-[10px] uppercase tracking-[0.2em] text-white/50 transition hover:text-white sm:block">
          View collection
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {fallback.map((relatedProduct) => (
          <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`} className="group">
            <div className="aspect-[3/4] overflow-hidden bg-[#111]">
              <img
                src={relatedProduct.images[0]}
                alt={relatedProduct.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-start justify-between gap-3 pt-4 text-[10px] uppercase tracking-[0.1em]">
              <span className="max-w-[70%] leading-4">{relatedProduct.title.split(" — ")[0]}</span>
              <span className="whitespace-nowrap text-white/60">{formatPrice(relatedProduct.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-black pb-24 pt-32 text-white md:pt-44">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-[10px] uppercase tracking-[0.25em] text-white/45">
          <Link href="/" className="transition hover:text-white">WASTE.</Link>
          <span className="mx-3 text-white/20">/</span>
          <Link href="/shop" className="transition hover:text-white">Shop</Link>
          <span className="mx-3 text-white/20">/</span>
          <span className="text-white/70">{product.title.split(" — ")[0]}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-20">
          <ProductGallery product={product} />

          <section className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
              {product.category} / {product.sku}
            </p>
            <h1 className="mt-5 max-w-xl font-editorial text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.82] tracking-[-0.06em]">
              {product.title}
            </h1>
            <div className="mt-7 flex items-center gap-3 text-sm">
              <span>{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-white/35 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="mt-8 max-w-md text-sm leading-7 text-white/55">{product.description}</p>

            <ProductPurchasePanel
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: product.images[0],
                sku: product.sku,
                soldOut: product.soldOut,
              }}
            />

            <div className="mt-8">
              <InformationAccordion title="Size guide">
                Our standard fit is designed for an easy, relaxed silhouette. Choose your usual size for the intended fit, or size down for a closer shape.
              </InformationAccordion>
              <InformationAccordion title="Product details">
                Crafted with considered materials and finished with the WASTE. point of view. See the product description above for the specific construction and material notes.
              </InformationAccordion>
              <InformationAccordion title="Shipping">
                Orders are prepared from India. Delivery timing and shipping rates are confirmed during checkout based on your delivery address.
              </InformationAccordion>
              <InformationAccordion title="Returns">
                Items must be unworn, unwashed, and returned with original tags. Final eligibility and the return window will be confirmed by the active WASTE. returns policy.
              </InformationAccordion>
            </div>
          </section>
        </div>
      </div>
      <RelatedProducts product={product} />
    </main>
  );
}
