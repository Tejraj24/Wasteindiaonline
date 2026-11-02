"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ImageUpload, UploadedImage } from "@/components/admin/ImageUpload";
import { SingleImageUploadSlot } from "@/components/admin/SingleImageUploadSlot";
import {
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Package,
  DollarSign,
  Layers,
  Image as ImageIcon,
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug?: string;
}

export interface ProductDetailsModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedProduct: any) => void;
  // Visual carousel overrides from parent admin page
  currentOverride?: { image1?: string; image2?: string };
  onSaveOverride?: (productId: string, override: { image1?: string; image2?: string }) => void;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type ActiveTab = "basic" | "pricing" | "inventory" | "images" | "carousel";

export function ProductDetailsModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
  currentOverride,
  onSaveOverride,
}: ProductDetailsModalProps) {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand: "WASTE.",
    categoryId: "",
    shortDescription: "",
    description: "",
    price: "",
    compareAtPrice: "",
    inventory: "10",
    status: "ACTIVE",
    featured: false,
    tags: "",
    isPreorder: false,
    preorderCapacity: "50",
    releaseDate: "",
    expectedShipmentText: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [images, setImages] = useState<UploadedImage[]>([]);

  // Visual Carousel overrides specific to FEATURED SILHOUETTES
  const [overrideImage1, setOverrideImage1] = useState<string>("");
  const [overrideImage2, setOverrideImage2] = useState<string>("");

  // Load product & categories
  const loadProductData = useCallback(async () => {
    if (!productId || !user) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = await user.getIdToken();

      // 1. Fetch categories
      const catRes = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData || []);
      }

      // 2. Fetch authoritative product details
      const prodRes = await fetch(`/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!prodRes.ok) {
        throw new Error(`Failed to load product details (HTTP ${prodRes.status})`);
      }

      const data = await prodRes.json();

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        brand: data.brand || "WASTE.",
        categoryId: data.categoryId || "",
        shortDescription: data.shortDescription || "",
        description: data.description || "",
        price: data.price !== undefined && data.price !== null ? String(data.price) : "",
        compareAtPrice:
          data.compareAtPrice !== undefined && data.compareAtPrice !== null ? String(data.compareAtPrice) : "",
        inventory: data.inventory !== undefined && data.inventory !== null ? String(data.inventory) : "10",
        status: data.status || "ACTIVE",
        featured: Boolean(data.featured),
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        isPreorder: Boolean(data.isPreorder),
        preorderCapacity: data.preorderCapacity ? String(data.preorderCapacity) : "50",
        releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split("T")[0] : "",
        expectedShipmentText: data.expectedShipmentText || "",
      });

      // Sizes resolution from preorderSizes or tags
      if (data.preorderSizes && Array.isArray(data.preorderSizes)) {
        setSelectedSizes(data.preorderSizes);
      } else if (data.preorderSizes && typeof data.preorderSizes === "object") {
        setSelectedSizes(Object.keys(data.preorderSizes));
      } else if (Array.isArray(data.tags)) {
        const matched = AVAILABLE_SIZES.filter((sz) =>
          data.tags.some((t: string) => t.toUpperCase() === sz)
        );
        if (matched.length > 0) setSelectedSizes(matched);
      }

      // Images
      setImages(
        (data.images || []).map((img: any, i: number) => ({
          imageUrl: typeof img === "string" ? img : img.imageUrl,
          altText: img.altText || "",
          sortOrder: i,
        }))
      );

      // Carousel visual overrides
      setOverrideImage1(currentOverride?.image1 || "");
      setOverrideImage2(currentOverride?.image2 || "");
    } catch (err: any) {
      console.error("[ProductDetailsModal] Error loading product:", err);
      setErrorMessage(err.message || "Failed to load product details.");
    } finally {
      setIsLoading(false);
    }
  }, [productId, user, currentOverride]);

  useEffect(() => {
    if (isOpen && productId) {
      void loadProductData();
    }
  }, [isOpen, productId, loadProductData]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !user) return;

    if (!form.name.trim()) {
      setErrorMessage("Product name is required.");
      setActiveTab("basic");
      return;
    }
    if (!form.price.trim() || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
      setErrorMessage("A valid non-negative price is required.");
      setActiveTab("pricing");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = await user.getIdToken();

      // 1. Authoritative Product Details Update via PUT /api/admin/products/[id]
      const productPayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        brand: form.brand.trim() || "WASTE.",
        categoryId: form.categoryId || null,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice.trim() ? parseFloat(form.compareAtPrice) : null,
        inventory: parseInt(form.inventory, 10) || 0,
        status: form.status,
        featured: form.featured,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : selectedSizes,
        isPreorder: form.isPreorder,
        preorderCapacity: form.preorderCapacity ? parseInt(form.preorderCapacity, 10) : null,
        releaseDate: form.releaseDate || null,
        expectedShipmentText: form.expectedShipmentText.trim() || null,
        preorderSizes: selectedSizes,
        images: images.map((img, idx) => ({
          imageUrl: img.imageUrl,
          altText: img.altText || `${form.name} view ${idx + 1}`,
          sortOrder: idx,
        })),
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to update product details (HTTP ${res.status})`);
      }

      const updatedProduct = await res.json();

      // 2. Carousel Visual Override Update if changed
      if (onSaveOverride) {
        onSaveOverride(productId, {
          image1: overrideImage1.trim() || undefined,
          image2: overrideImage2.trim() || undefined,
        });
      }

      setSuccessMessage("Product details saved successfully! Storefront catalogs and product pages updated.");

      if (onSuccess) {
        onSuccess(updatedProduct);
      }

      // Auto-dismiss success message after 3.5s
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);
    } catch (err: any) {
      console.error("[ProductDetailsModal] Save error:", err);
      setErrorMessage(err.message || "Failed to save product details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentPriceNum = parseFloat(form.price) || 0;
  const comparePriceNum = parseFloat(form.compareAtPrice) || 0;
  const discountPercent =
    comparePriceNum > currentPriceNum && comparePriceNum > 0
      ? Math.round(((comparePriceNum - currentPriceNum) / comparePriceNum) * 100)
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden">
        {/* ==========================================================
            HEADER
           ========================================================== */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              <span>ADMIN</span>
              <span>/</span>
              <span className="text-blue-400">FEATURED SILHOUETTES</span>
              <span>/</span>
              <span className="text-zinc-300">EDIT PRODUCT DETAILS</span>
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <h2
                id="product-details-modal-title"
                className="text-base sm:text-lg font-bold uppercase tracking-wider text-white truncate"
              >
                {form.name || "Edit Product"}
              </h2>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-700 shrink-0">
                ID: {productId}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[9px] font-mono uppercase font-semibold border shrink-0 ${
                  form.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : form.status === "DRAFT"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {form.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {form.slug && (
              <a
                href={`/product/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                <span>View Storefront</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close product editor"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ==========================================================
            TABS / GROUPS NAVIGATION
           ========================================================== */}
        <div className="flex overflow-x-auto border-b border-zinc-800/60 bg-zinc-900/30 px-4 sm:px-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-medium tracking-wider uppercase transition shrink-0 ${
              activeTab === "basic"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>1. Basic Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-medium tracking-wider uppercase transition shrink-0 ${
              activeTab === "pricing"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>2. Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-medium tracking-wider uppercase transition shrink-0 ${
              activeTab === "inventory"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>3. Inventory & Sizes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-medium tracking-wider uppercase transition shrink-0 ${
              activeTab === "images"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>4. Product Images ({images.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("carousel")}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-medium tracking-wider uppercase transition shrink-0 ${
              activeTab === "carousel"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>5. Featured Silhouettes</span>
            {form.featured && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* ==========================================================
            FEEDBACK BANNERS
           ========================================================== */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border-b border-red-500/20 px-5 py-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span className="flex-1">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400/70 hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-3 text-xs text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="flex-1">{successMessage}</span>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400/70 hover:text-emerald-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ==========================================================
            BODY CONTENT
           ========================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
                Loading Authoritative Product Details...
              </p>
            </div>
          ) : (
            <form id="product-details-form" onSubmit={handleSave} className="space-y-6">
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === "basic" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-zinc-800/60 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      1. Basic Product Information
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Core catalog details used across product detail pages, search, and store listings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Product Title / Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. WASTE Crimson Bloom Oversized Tee"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="e.g. waste-crimson-bloom-oversized-tee"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono outline-none focus:border-blue-500"
                      />
                      <p className="text-[10px] text-zinc-400">
                        Store URL: /product/{form.slug || "product-slug"}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Category
                      </label>
                      <select
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Short Description / Subtitle
                      </label>
                      <input
                        type="text"
                        value={form.shortDescription}
                        onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                        placeholder="e.g. Heavyweight 280 GSM cotton silhouette"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Full Description
                      </label>
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Detailed product story, craftsmanship, material composition, and fit notes..."
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 p-3.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING */}
              {activeTab === "pricing" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-zinc-800/60 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      2. Pricing Configuration
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Set base prices and compare-at prices in Indian Rupees (₹ INR).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Regular Price (₹ INR) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          required
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          placeholder="1299"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-8 pr-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Active price charged at checkout across the store.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Compare at / Original Price (₹ INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={form.compareAtPrice}
                          onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                          placeholder="1899"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-8 pr-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Leave blank if not currently on sale.
                      </p>
                    </div>
                  </div>

                  {/* Pricing Preview Badge */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        Live Storefront Pricing Display:
                      </span>
                      <div className="flex items-baseline gap-2.5 mt-1">
                        <span className="text-xl font-bold font-mono text-white">
                          ₹{currentPriceNum.toLocaleString("en-IN")}
                        </span>
                        {comparePriceNum > currentPriceNum && (
                          <span className="text-xs font-mono text-zinc-500 line-through">
                            ₹{comparePriceNum.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    {discountPercent !== null && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-400">
                        {discountPercent}% OFF (SALE BADGE ACTIVE)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY & SIZES */}
              {activeTab === "inventory" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-zinc-800/60 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      3. Inventory, Availability & Sizes
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Manage stock levels, release status, pre-order capacity, and active sizes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Stock Inventory Units
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.inventory}
                        onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Publication Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      >
                        <option value="ACTIVE">ACTIVE (Published to Store)</option>
                        <option value="DRAFT">DRAFT (Hidden from Store)</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>

                    {/* SIZES CONFIGURATION */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Available Sizes & Variants
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_SIZES.map((sz) => {
                          const isSelected = selectedSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleSize(sz)}
                              className={`h-9 min-w-10 rounded-lg border px-3 text-xs font-mono font-medium transition ${
                                isSelected
                                  ? "border-blue-500 bg-blue-500/20 text-blue-300 shadow-sm"
                                  : "border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Click sizes to toggle availability for this silhouette on the product detail page.
                      </p>
                    </div>

                    {/* PREORDER SECTION */}
                    <div className="sm:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Pre-Order Allocation
                          </h4>
                          <p className="text-[11px] text-zinc-400">
                            Allow customers to reserve pieces prior to official batch release.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.isPreorder}
                            onChange={(e) => setForm({ ...form, isPreorder: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>

                      {form.isPreorder && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-800/60">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300">
                              Pre-Order Maximum Capacity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={form.preorderCapacity}
                              onChange={(e) => setForm({ ...form, preorderCapacity: e.target.value })}
                              placeholder="50"
                              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-white outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300">
                              Expected Shipment Timeline
                            </label>
                            <input
                              type="text"
                              value={form.expectedShipmentText}
                              onChange={(e) => setForm({ ...form, expectedShipmentText: e.target.value })}
                              placeholder="e.g. Ships within 7-10 business days"
                              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUCT IMAGES */}
              {activeTab === "images" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-zinc-800/60 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      4. Canonical Catalog Product Images
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Upload and arrange primary photos displayed on product detail pages and the shop catalog.
                    </p>
                  </div>

                  <ImageUpload
                    images={images}
                    onChange={(newImages) => setImages(newImages)}
                    maxImages={8}
                  />
                </div>
              )}

              {/* TAB 5: FEATURED SILHOUETTES SETTINGS */}
              {activeTab === "carousel" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-zinc-800/60 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      5. Featured Silhouettes & Lookbook Controls
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Configure lookbook visibility and customize card-specific visual overrides.
                    </p>
                  </div>

                  {/* Clarification Notice */}
                  <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-zinc-300">
                    <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 leading-relaxed">
                      <p className="font-semibold text-white">
                        Authoritative Catalog vs Carousel Overrides Distinction:
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        <strong>Product Details</strong> (Tabs 1–4) represent the official catalog data used store-wide across checkout, product pages, and shop filters.
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        <strong>Carousel Overrides</strong> below allow presenting a specialized editorial composition or model cut specifically within the homepage 3D Lookbook without modifying the standard catalog pictures.
                      </p>
                    </div>
                  </div>

                  {/* Featured Status Toggle */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Featured Silhouettes Catalog Tag
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        When enabled, this piece is prioritized in the 2024 DROP // THE 3D LOOKBOOK.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>

                  {/* Carousel Visual Overrides */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SingleImageUploadSlot
                      label="Primary Carousel Silhouette Override"
                      sublabel="Replaces main 3D carousel visual without altering standard shop photo"
                      currentImageUrl={overrideImage1 === "none" ? "" : (overrideImage1 || images[0]?.imageUrl || "")}
                      defaultImageUrl={images[0]?.imageUrl || ""}
                      aspectRatio="3/4"
                      badge="Carousel Primary"
                      isModified={Boolean(overrideImage1 && overrideImage1 !== images[0]?.imageUrl)}
                      onImageChange={(url) => setOverrideImage1(url)}
                      onResetToDefault={() => setOverrideImage1("")}
                      onDeleteImage={() => setOverrideImage1("none")}
                      deleteAriaLabel="Remove primary carousel silhouette override"
                      deleteConfirmTitle="Remove this image?"
                      deleteConfirmMessage="Remove primary carousel silhouette override? The card will fall back to the catalog default image."
                    />

                    <SingleImageUploadSlot
                      label="Secondary Hover View (Optional)"
                      sublabel="Alternate angle revealed when cursor hovers over active card"
                      currentImageUrl={overrideImage2 === "none" ? "" : (overrideImage2 || images[1]?.imageUrl || "")}
                      defaultImageUrl={images[1]?.imageUrl || ""}
                      aspectRatio="3/4"
                      badge="Carousel Hover"
                      isModified={Boolean(overrideImage2 && overrideImage2 !== images[1]?.imageUrl)}
                      onImageChange={(url) => setOverrideImage2(url)}
                      onResetToDefault={() => setOverrideImage2("")}
                      onDeleteImage={() => setOverrideImage2("none")}
                      deleteAriaLabel="Remove secondary hover view"
                      deleteConfirmTitle="Remove this image?"
                      deleteConfirmMessage="Remove secondary hover view? This will disable the hover-image animation for this silhouette and retain the primary image."
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* ==========================================================
            FOOTER ACTIONS
           ========================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 bg-zinc-900/60 px-5 py-4 sm:px-6 gap-3">
          <div className="text-[11px] text-zinc-500 font-mono hidden sm:block">
            Changes sync automatically to storefront and database on save.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="product-details-form"
              disabled={isSaving || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Product Details</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
