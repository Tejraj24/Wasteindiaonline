"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Footer } from "@/components/Footer";
import { WishlistButton } from "@/components/WishlistButton";
import { BackButton } from "@/components/navigation/BackButton";
import { StorefrontProduct } from "@/lib/services/product.service";
import { CategoryConfig } from "@/lib/config/categories";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function shortName(title: string) {
  return title.split(" — ")[0].split(" - ")[0];
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
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none border border-brand-border bg-brand-surfaceSubtle shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        {/* Main Product Image Navigation Link */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 block z-0"
          data-cursor="VIEW"
          aria-label={`View ${product.title}`}
          tabIndex={-1}
          aria-hidden="true"
        >
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
        </Link>

        {/* Badges */}
        {product.soldOut ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-brand-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
            {product.isPreorder ? "Capacity reached" : "Sold out"}
          </span>
        ) : product.isPreorder ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-brand-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
            Pre-order
          </span>
        ) : product.compareAtPrice ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-brand-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
            Sale
          </span>
        ) : null}

        {/* Wishlist Button */}
        <div className="absolute right-2.5 top-2.5 z-20 sm:right-4 sm:top-4">
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

        {/* Desktop Quick View Trigger Button */}
        <div className="absolute inset-x-0 bottom-0 z-20 hidden p-3 transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 sm:block pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full border border-white/80 bg-brand-black/85 py-2 px-3 text-center text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-colors hover:bg-brand-black focus:outline-none focus:ring-1 focus:ring-white pointer-events-auto shadow-sm"
            aria-label={`Quick view ${product.title}`}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Main Title & Price Block Navigation Link */}
      <Link
        href={`/product/${product.slug}`}
        className="flex items-start justify-between gap-2 pt-3 sm:gap-4 sm:pt-4 text-left focus:outline-none"
        aria-label={`${product.title} - View details`}
      >
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
        <div
          className={`grid gap-px border-r border-brand-border bg-brand-border ${
            product.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
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

interface CategoryCatalogClientProps {
  category: CategoryConfig;
  products: StorefrontProduct[];
}

export function CategoryCatalogClient({
  category,
  products,
}: CategoryCatalogClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black">
      <main className="pb-24 pt-28 sm:pt-32 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          {/* Breadcrumbs & Navigation Header */}
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
              <span className="text-brand-black font-medium">{category.name}</span>
            </nav>
          </div>

          {/* Category Header */}
          <header className="mb-10 sm:mb-12">
            <div className="flex flex-col gap-4 border-b border-brand-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                  WASTE® / Collection
                </p>
                <h1 className="mt-3 font-editorial text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.04em] text-brand-black">
                  {category.h1}
                </h1>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#706E68]">
                  {category.intro}
                </p>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-brand-muted font-mono">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </span>
            </div>

            {/* Category Navigation Pills */}
            <nav
              aria-label="Category Navigation"
              className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <Link
                href="/shop"
                className="rounded-full border border-brand-border bg-brand-surface px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-muted transition hover:border-brand-black hover:text-brand-black"
              >
                All Pieces
              </Link>
              <Link
                href="/shop/t-shirts"
                className={`rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                  category.slug === "t-shirts"
                    ? "border-brand-black bg-brand-black text-white"
                    : "border-brand-border bg-brand-surface text-brand-muted hover:border-brand-black hover:text-brand-black"
                }`}
                aria-current={category.slug === "t-shirts" ? "page" : undefined}
              >
                T-Shirts & Tops
              </Link>
              <Link
                href="/shop/outerwear"
                className={`rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                  category.slug === "outerwear"
                    ? "border-brand-black bg-brand-black text-white"
                    : "border-brand-border bg-brand-surface text-brand-muted hover:border-brand-black hover:text-brand-black"
                }`}
                aria-current={category.slug === "outerwear" ? "page" : undefined}
              >
                Outerwear & Layers
              </Link>
            </nav>
          </header>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="py-20 text-center text-brand-muted uppercase tracking-[0.2em] text-xs">
              No products available in this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 sm:gap-y-16 lg:grid-cols-4 lg:gap-y-24">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>

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
