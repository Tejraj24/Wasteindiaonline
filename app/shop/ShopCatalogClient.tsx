"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Footer } from "@/components/Footer";
import { WishlistButton } from "@/components/WishlistButton";
import { StorefrontProduct } from "@/lib/services/product.service";

const editorialImages = [
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792927963/lepord_1_q03oy1.png",
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792930001/modern-heritage_xbx276.jpg",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85",
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function shortName(title: string) {
  return title.split(" â€” ")[0];
}

function ProductCard({
  product,
  onQuickView,
}: {
  product: StorefrontProduct;
  onQuickView: (product: StorefrontProduct) => void;
}) {
  const img1 = product.images[0] || "";
  const img2 = product.images[1] || product.images[0] || "";

  return (
    <article className="group">
      <div className="relative">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="block w-full text-left"
          data-cursor="VIEW"
          aria-label={`Quick view ${product.title}`}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-none border border-brand-border bg-brand-surfaceSubtle shadow-sm transition-shadow duration-300 group-hover:shadow-md">
            <img
              src={img1}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-0"
            />
            <img
              src={img2}
              alt={`${product.title} alternate view`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-100"
            />
            <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-[10px] uppercase tracking-[0.22em] text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span>Quick view</span>
              <span className="border-b border-white/70 pb-1">View</span>
            </div>
            {product.soldOut ? (
              <span className="absolute left-2.5 top-2.5 z-10 bg-brand-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
                {product.isPreorder ? "Capacity reached" : "Sold out"}
              </span>
            ) : product.isPreorder ? (
              <span className="absolute left-2.5 top-2.5 z-10 bg-brand-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
                Pre-order
              </span>
            ) : product.compareAtPrice ? (
              <span className="absolute left-2.5 top-2.5 z-10 bg-brand-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
                Sale
              </span>
            ) : null}
          </div>
          <div className="flex items-start justify-between gap-2 pt-3 sm:gap-4 sm:pt-4">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-[11px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-brand-black transition-colors duration-200 group-hover:text-brand-muted sm:text-xs">
                {shortName(product.title)}
              </h3>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-brand-muted sm:text-[10px]">
                {product.category}
              </p>
            </div>
            <div className="shrink-0 whitespace-nowrap text-right font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-black sm:text-xs">
              <p>{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <p className="mt-0.5 text-[9px] font-normal text-brand-muted line-through sm:text-[10px]">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>
          </div>
        </button>
        <div className="absolute right-2.5 top-2.5 z-10 sm:right-4 sm:top-4">
          <WishlistButton
            item={{
              productId: product.id,
              name: product.title,
              slug: product.slug,
              image: img1,
              price: product.price,
              category: product.category,
            }}
          />
        </div>
      </div>
      <Link
        href={`/product/${product.slug}`}
        className="mt-2.5 inline-flex min-h-8 items-center text-[9px] uppercase tracking-[0.18em] text-brand-muted transition-colors hover:text-brand-black sm:mt-3 sm:text-[10px] sm:tracking-[0.2em]"
      >
        View full details â†’
      </Link>
    </article>
  );
}

function QuickView({
  product,
  onClose,
}: {
  product: StorefrontProduct;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState("M");
  const sizes = ["S", "M", "L", "XL"];

  const handleAdd = () => {
    if (product.soldOut) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      image: product.images[0] || "",
      size,
      sku: product.sku,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.title}`}
    >
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        className="relative z-10 grid max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-brand-border bg-brand-surface text-brand-black shadow-2xl md:grid-cols-[1.05fr_0.95fr]"
        data-lenis-prevent
      >
        <div className="grid grid-cols-2 gap-px border-r border-brand-border bg-brand-border">
          {product.images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${product.title} view ${index + 1}`}
              className="h-full min-h-[220px] w-full object-cover bg-brand-surfaceSubtle sm:min-h-[300px] md:min-h-[360px]"
            />
          ))}
        </div>
        <div className="flex min-h-[420px] flex-col p-6 md:p-10 lg:p-14">
          <div className="flex items-start justify-between gap-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
              {product.category} / {product.sku}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] uppercase tracking-[0.2em] text-brand-muted transition hover:text-brand-black"
            >
              Close
            </button>
          </div>
          <div className="mt-auto pt-16">
            <h2 className="max-w-md break-words font-editorial text-4xl leading-[0.9] tracking-[-0.04em] text-brand-black md:text-6xl">
              {product.title}
            </h2>
            <p className="mt-5 text-sm text-brand-black font-semibold font-mono">
              {formatPrice(product.price)}
            </p>
            <p className="mt-8 max-w-sm text-xs leading-6 text-brand-muted">
              {product.description}
            </p>
            <div className="mt-10 border-t border-brand-border pt-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                <span className="text-brand-black font-semibold">Size</span>
                <span className="text-brand-muted">Select one</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    className={`min-h-11 border py-3 text-xs transition ${
                      size === option
                        ? "border-brand-black bg-brand-black text-white"
                        : "border-brand-border bg-brand-surface text-brand-black hover:border-brand-black hover:bg-brand-surfaceSubtle"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.soldOut}
                className="mt-4 w-full bg-brand-black py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-black/90 disabled:cursor-not-allowed disabled:bg-brand-surfaceSubtle disabled:text-brand-muted disabled:border-brand-border"
              >
                {product.soldOut ? "Sold out" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShopCatalogClientProps {
  initialProducts: StorefrontProduct[];
  categories: { id: string; name: string; slug: string }[];
}

export function ShopCatalogClient({
  initialProducts,
  categories,
}: ShopCatalogClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      const normParam = categoryParam.toLowerCase();
      if (normParam === "headwear" || normParam === "accessories") {
        setActiveFilter("All");
        return;
      }
      if (normParam === "unisex" || normParam === "polos") {
        setActiveFilter("Unisex");
        return;
      }
      const match = categories.find(
        (c) =>
          c.slug.toLowerCase() !== "headwear" &&
          c.slug.toLowerCase() !== "accessories" &&
          (c.slug.toLowerCase() === normParam || c.name.toLowerCase() === normParam)
      );
      if (match) {
        setActiveFilter(match.name);
      } else {
        setActiveFilter("All");
      }
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  // Filter list: All + categories from database (or unique product categories) excluding removed categories
  const filterList = useMemo(() => {
    const isExcluded = (nameOrSlug?: string | null) => {
      if (!nameOrSlug) return false;
      const lower = nameOrSlug.toLowerCase();
      return lower === "headwear" || lower === "accessories";
    };

    const unique = new Set<string>();
    categories.forEach((c) => {
      if (isExcluded(c.slug) || isExcluded(c.name)) return;
      const name = c.slug.toLowerCase() === "polos" || c.name.toLowerCase() === "polos" ? "Unisex" : c.name;
      unique.add(name);
    });
    initialProducts.forEach((p) => {
      if (p.category) {
        if (isExcluded(p.category) || isExcluded(p.categorySlug)) return;
        const name = p.category.toLowerCase() === "polos" ? "Unisex" : p.category;
        unique.add(name);
      }
    });
    return ["All", ...Array.from(unique)];
  }, [categories, initialProducts]);

  // Exclude headwear and accessories products from customer-facing shop catalog
  const catalogProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const pCat = p.category.toLowerCase();
      const pSlug = (p.categorySlug || "").toLowerCase();
      return pCat !== "headwear" && pSlug !== "headwear" && pCat !== "accessories" && pSlug !== "accessories";
    });
  }, [initialProducts]);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return catalogProducts;
    const norm = activeFilter.toLowerCase();
    return catalogProducts.filter((p) => {
      const pCat = p.category.toLowerCase();
      const pSlug = (p.categorySlug || "").toLowerCase();
      if (norm === "unisex") {
        return pCat === "unisex" || pSlug === "unisex" || pCat === "polos" || pSlug === "polos";
      }
      return pCat === norm || pSlug === norm;
    });
  }, [activeFilter, catalogProducts]);

  const featuredPair = useMemo(() => {
    const featured = catalogProducts.filter((p) => p.featured);
    if (featured.length >= 2) return featured.slice(0, 2);
    return catalogProducts.slice(4, 6);
  }, [catalogProducts]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black">
      {/* Editorial Collection Hero Banner â€” Wide Horizontal Rectangular Presentation */}
      <section className="w-full pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 md:pb-8">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-12">
          <div
            className={`relative w-full overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-brand-border/60 bg-brand-surface shadow-sm aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.35/1] max-h-[520px] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <img
              src={editorialImages[0]}
              alt="WASTE collection editorial banner"
              className="h-full w-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section id="collection" className="px-6 pt-4 pb-0 sm:pt-6 md:pt-8 md:px-12">

        <div className="mb-10 mt-2 sm:mt-4 flex items-end justify-between gap-4 border-b border-brand-border pb-5 sm:mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">
              WASTE. / Archive
            </p>
            <h2 className="mt-4 font-editorial text-[clamp(2.75rem,9vw,4.5rem)] leading-none tracking-[-0.05em] text-brand-black">
              The collection
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">
            {visibleProducts.length} pieces
          </span>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="py-20 text-center text-brand-muted uppercase tracking-[0.2em] text-xs">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 sm:gap-y-16 lg:grid-cols-4 lg:gap-y-24">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>

      <section className="relative w-full min-h-[75vh] overflow-hidden">
        <img
          src={editorialImages[1]}
          alt="Modern heritage editorial"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      {featuredPair.length > 0 && (
        <section className="px-6 py-24 md:px-12 md:py-40 border-t border-brand-border bg-brand-bg text-brand-black">
          <div className="mb-12 flex items-end justify-between border-b border-brand-border pb-5">
            <h2 className="font-editorial text-5xl tracking-[-0.05em] text-brand-black md:text-7xl">
              Featured collection
            </h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">
              02 / 02
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {featuredPair.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        </section>
      )}

      <section
        id="story"
        className="w-full border-t border-brand-border bg-brand-bg flex items-center justify-center"
      >
        <div className="relative w-full aspect-video flex items-center justify-center bg-brand-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://res.cloudinary.com/dom7a6zlx/video/upload/v1792942409/modern-video_vgvddh.jpg"
            className="w-full h-full object-contain pointer-events-none select-none"
            aria-hidden="true"
          >
            <source
              src="https://res.cloudinary.com/dom7a6zlx/video/upload/v1792942409/modern-video_vgvddh.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <Footer />
    </div>
  );
}
