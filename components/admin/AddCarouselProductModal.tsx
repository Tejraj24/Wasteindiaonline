"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  X,
  Search,
  Plus,
  Check,
  ShoppingBag,
  Loader2,
  AlertCircle,
  ExternalLink,
  Package,
} from "lucide-react";

export interface CatalogProductOption {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  compareAtPrice?: number | null;
  category?: { id: string; name: string } | string | null;
  images?: { imageUrl: string; sortOrder?: number }[] | string[];
}

interface AddCarouselProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: CatalogProductOption) => void;
  existingProductIds: string[];
  maxLimit?: number;
}

export function AddCarouselProductModal({
  isOpen,
  onClose,
  onAddProduct,
  existingProductIds,
  maxLimit = 12,
}: AddCarouselProductModalProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<CatalogProductOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load catalog products when modal opens
  useEffect(() => {
    if (!isOpen || !user) return;

    let isMounted = true;
    async function fetchCatalog() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const token = await user?.getIdToken();
        const res = await fetch("/api/admin/products?limit=100&status=ACTIVE", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load store products (HTTP ${res.status})`);
        }

        const data = await res.json();
        if (isMounted) {
          setProducts(data.products || []);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("[AddCarouselProductModal] Error loading products:", err);
          setErrorMessage(err.message || "Failed to load product catalog.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSelectedCategory("ALL");
    }
  }, [isOpen]);

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const catName = typeof p.category === "object" ? p.category?.name : p.category;
      if (catName) set.add(catName);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const catName = typeof p.category === "object" ? p.category?.name : p.category;

      if (selectedCategory !== "ALL" && catName !== selectedCategory) {
        return false;
      }

      if (!q) return true;

      const nameMatch = p.name.toLowerCase().includes(q);
      const skuMatch = p.sku ? p.sku.toLowerCase().includes(q) : false;
      const slugMatch = p.slug.toLowerCase().includes(q);
      const idMatch = p.id.toLowerCase().includes(q);

      return nameMatch || skuMatch || slugMatch || idMatch;
    });
  }, [products, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const isLimitReached = existingProductIds.length >= maxLimit;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Add Product to 3D Lookbook Carousel
              </h2>
              <p className="text-[11px] text-zinc-400">
                Select an existing product from your store catalog to feature in FEATURED SILHOUETTES ({existingProductIds.length}/{maxLimit} pieces)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="border-b border-zinc-800/60 p-4 bg-zinc-900/30 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, SKU, or ID..."
              className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition cursor-pointer ${
                  selectedCategory === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Limit Warning */}
        {isLimitReached && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Maximum carousel capacity reached ({maxLimit} products). Remove a piece first to add another.</span>
          </div>
        )}

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-[300px] max-h-[500px]">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              <span className="text-xs">Loading store catalog...</span>
            </div>
          ) : errorMessage ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-red-400 text-center p-6">
              <AlertCircle className="h-8 w-8" />
              <span className="text-xs">{errorMessage}</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-500 text-center p-6">
              <Package className="h-10 w-10 text-zinc-700" />
              <p className="text-sm font-medium text-zinc-300">No products found</p>
              <p className="text-xs max-w-xs text-zinc-500">
                {searchQuery
                  ? `No products matched "${searchQuery}". Try a different keyword.`
                  : "No active products available in your catalog."}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isAlreadyInCarousel = existingProductIds.includes(product.id);
              const firstImage = Array.isArray(product.images) && product.images.length > 0
                ? (typeof product.images[0] === "string" ? product.images[0] : (product.images[0] as any).imageUrl)
                : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80";

              const catName = typeof product.category === "object" ? product.category?.name : product.category;

              return (
                <div
                  key={product.id}
                  className={`flex items-center justify-between gap-4 rounded-xl border p-3.5 transition ${
                    isAlreadyInCarousel
                      ? "border-zinc-800/40 bg-zinc-950/40 opacity-60"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-semibold text-white truncate max-w-sm">
                          {product.name}
                        </h4>
                        {catName && (
                          <span className="rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 px-1.5 py-0.5 text-[9px] font-mono">
                            {catName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 mt-1">
                        <span>SKU: {product.sku || product.id}</span>
                        <span>•</span>
                        <span className="text-zinc-200 font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.compareAtPrice && (
                          <span className="line-through text-zinc-600">₹{product.compareAtPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add / Added Button */}
                  <div className="shrink-0">
                    {isAlreadyInCarousel ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                        <span>In Carousel</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isLimitReached}
                        onClick={() => {
                          onAddProduct(product);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to Carousel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-800/80 px-6 py-3.5 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1 text-zinc-500">
            <span>Looking for a new piece?</span>
            <a
              href="/admin/products/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 underline ml-1"
            >
              <span>Create New Product</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
