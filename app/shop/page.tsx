"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import products from "@/data/products.json";
import { Footer } from "@/components/Footer";

type Product = (typeof products)[number];
type Filter = "All" | "T-Shirts" | "Shirts" | "Hoodies" | "Oversized" | "Cargo" | "Pants" | "Outerwear" | "Accessories";

const filters: Filter[] = [
  "All",
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Oversized",
  "Cargo",
  "Pants",
  "Outerwear",
  "Accessories",
];

const categoryMap: Record<Exclude<Filter, "All">, string[]> = {
  "T-Shirts": ["T-Shirts"],
  Shirts: ["Shirts", "Polos"],
  Hoodies: ["Hoodies", "Sweatshirts"],
  Oversized: ["Oversized"],
  Cargo: ["Cargo"],
  Pants: ["Pants", "Trousers"],
  Outerwear: ["Outerwear"],
  Accessories: ["Accessories", "Headwear"],
};

const editorialImages = [
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85",
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
  return title.split(" — ")[0];
}

function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (product: Product) => void }) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="block w-full text-left"
        data-cursor="VIEW"
        aria-label={`Quick view ${product.title}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
          <img
            src={product.images[0]}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-0"
          />
          <img
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-100"
          />
          <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-4 text-[10px] uppercase tracking-[0.22em] text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span>Quick view</span>
            <span className="border-b border-white/70 pb-1">View</span>
          </div>
          {product.soldOut && (
            <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-white/80">Sold out</span>
          )}
        </div>
        <div className="flex items-start justify-between gap-4 pt-4">
          <div>
            <h3 className="text-[11px] uppercase leading-[1.25] tracking-[0.1em] text-white md:text-xs">{shortName(product.title)}</h3>
            <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-white/45">{product.category}</p>
          </div>
          <div className="whitespace-nowrap text-right text-[11px] uppercase tracking-[0.08em] text-white/80">
            <p>{formatPrice(product.price)}</p>
            {product.compareAtPrice && <p className="mt-1 text-white/30 line-through">{formatPrice(product.compareAtPrice)}</p>}
          </div>
        </div>
      </button>
      <Link
        href={`/product/${product.id}`}
        className="mt-4 inline-flex text-[10px] uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
      >
        View full details
      </Link>
    </article>
  );
}

function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const [size, setSize] = useState("M");
  const sizes = ["S", "M", "L", "XL"];

  const handleAdd = () => {
    if (product.soldOut) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0],
      size,
      sku: product.sku,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Quick view ${product.title}`}>
      <button type="button" aria-label="Close quick view" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative z-10 grid max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-[#111] text-white md:grid-cols-[1.05fr_0.95fr]" data-lenis-prevent>
        <div className="grid grid-cols-2 gap-px bg-white/10">
          {product.images.map((image, index) => (
            <img key={image} src={image} alt={`${product.title} view ${index + 1}`} className="h-full min-h-[220px] w-full object-cover sm:min-h-[300px] md:min-h-[360px]" />
          ))}
        </div>
        <div className="flex min-h-[420px] flex-col p-6 md:p-10 lg:p-14">
          <div className="flex items-start justify-between gap-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">{product.category} / {product.sku}</p>
            <button type="button" onClick={onClose} className="text-[10px] uppercase tracking-[0.2em] text-white/55 transition hover:text-white">Close</button>
          </div>
          <div className="mt-auto pt-16">
            <h2 className="max-w-md break-words font-editorial text-4xl leading-[0.9] tracking-[-0.04em] md:text-6xl">{product.title}</h2>
            <p className="mt-5 text-sm text-white/70">{formatPrice(product.price)}</p>
            <p className="mt-8 max-w-sm text-xs leading-6 text-white/50">{product.description}</p>
            <div className="mt-10 border-t border-white/15 pt-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                <span>Size</span>
                <span className="text-white/40">Select one</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {sizes.map((option) => (
                  <button key={option} type="button" onClick={() => setSize(option)} className={`min-h-11 border py-3 text-xs transition ${size === option ? "border-white bg-white text-black" : "border-white/20 text-white/65 hover:border-white/70"}`}>{option}</button>
                ))}
              </div>
              <button type="button" onClick={handleAdd} disabled={product.soldOut} className="mt-4 w-full bg-white py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-[#1e40ff] hover:text-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40">
                {product.soldOut ? "Sold out" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => { document.body.style.backgroundColor = "#000000"; };
  }, []);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    const allowed = categoryMap[activeFilter];
    return products.filter((product) => allowed.includes(product.category));
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-end overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16">
        <img src={editorialImages[0]} alt="WASTE collection editorial" className="absolute inset-0 h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/15" />
        <div className={`relative z-10 w-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="mb-8 flex items-end justify-between border-b border-white/25 pb-5 text-[10px] uppercase tracking-[0.28em] text-white/65 md:mb-10">
            <span>WASTE.</span>
            <span>Collection 01</span>
            <span>2026 / India</span>
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-5xl font-editorial text-[clamp(4.5rem,14vw,13rem)] leading-[0.72] tracking-[-0.07em]">COLLECTION<br /><em className="font-editorial">01</em></h1>
            <div className="max-w-xs pb-1 md:pb-2">
              <a href="#collection" className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-white"><span className="h-px w-10 bg-white transition-all duration-500 group-hover:w-16" />SHOP THE COLLECTION</a>
              <p className="mt-5 text-xs leading-6 text-white/60">A curated selection inspired by modern heritage.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="px-6 py-20 md:px-12 md:py-32">
        <div className="sticky top-0 z-30 -mx-6 overflow-hidden border-y border-white/15 bg-black/90 px-6 py-4 backdrop-blur-md md:-mx-12 md:px-12">
          <div className="flex gap-7 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => (
              <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`relative shrink-0 rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors ${activeFilter === filter ? "border-white bg-white text-black" : "border-white/15 text-white/40 hover:border-white/60 hover:text-white"}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 mt-14 flex items-end justify-between gap-4 border-b border-white/15 pb-5 sm:mb-12 sm:mt-20">
          <div><p className="text-[10px] uppercase tracking-[0.3em] text-white/40">WASTE. / Archive</p><h2 className="mt-4 font-editorial text-[clamp(2.75rem,9vw,4.5rem)] leading-none tracking-[-0.05em]">The collection</h2></div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{visibleProducts.length} pieces</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 sm:gap-y-16 lg:grid-cols-4 lg:gap-y-24">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onQuickView={setSelectedProduct} />)}
        </div>
      </section>

      <section className="relative min-h-[75vh] overflow-hidden px-6 py-24 md:px-12 md:py-40">
        <img src={editorialImages[1]} alt="Modern heritage editorial" className="absolute inset-0 h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex min-h-[50vh] flex-col justify-between md:min-h-[55vh]"><p className="text-[10px] uppercase tracking-[0.3em] text-white/70">WASTE. / Editorial 001</p><div><p className="font-editorial text-5xl leading-[0.85] tracking-[-0.06em] md:text-8xl">MODERN<br /><em>HERITAGE</em></p><p className="mt-8 max-w-xs text-xs leading-6 text-white/65">Crafted for the next generation. A study in proportion, material, and memory.</p></div></div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-40"><div className="mb-12 flex items-end justify-between border-b border-white/15 pb-5"><h2 className="font-editorial text-5xl tracking-[-0.05em] md:text-7xl">Featured collection</h2><span className="text-[10px] uppercase tracking-[0.2em] text-white/40">02 / 02</span></div><div className="grid gap-5 md:grid-cols-2">{products.slice(4, 6).map((product) => <ProductCard key={product.id} product={product} onQuickView={setSelectedProduct} />)}</div></section>

      <section id="story" className="border-t border-white/15 px-6 py-28 md:px-12 md:py-48"><div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-24"><p className="text-[10px] uppercase tracking-[0.3em] text-white/40">The WASTE. point of view</p><div><h2 className="max-w-4xl font-editorial text-6xl leading-[0.82] tracking-[-0.06em] md:text-9xl">A modern expression of heritage</h2><p className="mt-12 max-w-md text-sm leading-7 text-white/55">WASTE merges contemporary silhouettes with timeless inspiration. Each piece is considered, collected, and made to live beyond a season.</p></div></div></section>

      {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <Footer />
    </div>
  );
}
