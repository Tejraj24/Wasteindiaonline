"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SingleImageUploadSlot } from "@/components/admin/SingleImageUploadSlot";
import { ProductDetailsModal } from "@/components/admin/ProductDetailsModal";
import { AddCarouselProductModal, CatalogProductOption } from "@/components/admin/AddCarouselProductModal";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_CAROUSEL_ITEMS,
  HeroSlideContent,
  CarouselSlideContent,
  HomepageContentConfig,
} from "@/lib/services/content.service";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  ShoppingBag,
  Images,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Loader2,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";

interface FeaturedProductMeta {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  image1: string;
  image2: string;
  category?: string;
  slotNumber?: number;
  slotId?: string;
}

export default function AdminContentPage() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Server state
  const [heroSlides, setHeroSlides] = useState<HeroSlideContent[]>(DEFAULT_HERO_SLIDES);
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, { image1?: string; image2?: string }>>({});
  const [carouselImages, setCarouselImages] = useState<CarouselSlideContent[]>(DEFAULT_CAROUSEL_ITEMS);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductMeta[]>([]);
  const [carouselProductIds, setCarouselProductIds] = useState<string[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Carousel management modal & removal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productPendingRemoval, setProductPendingRemoval] = useState<FeaturedProductMeta | null>(null);

  // Store catalog deletion states
  const [productPendingDeletion, setProductPendingDeletion] = useState<FeaturedProductMeta | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [deleteCanArchive, setDeleteCanArchive] = useState(false);

  // Initial baseline to track unsaved changes
  const [baselineConfig, setBaselineConfig] = useState<string>("");

  const hasUnsavedChanges = useMemo(() => {
    if (!baselineConfig) return false;
    const current = JSON.stringify({
      heroSlides,
      featuredOverrides,
      carouselImages,
      carouselProductIds,
    });
    return current !== baselineConfig;
  }, [heroSlides, featuredOverrides, carouselImages, carouselProductIds, baselineConfig]);

  // Load content configuration from API
  async function loadContent() {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const token = await user?.getIdToken();
      if (!token) return;

      const res = await fetch("/api/admin/content", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to load content configuration (HTTP ${res.status})`);
      }

      const data = await res.json();
      const cfg: HomepageContentConfig = data.config;

      setHeroSlides(cfg.heroSlides || DEFAULT_HERO_SLIDES);
      setFeaturedOverrides(cfg.featuredOverrides || {});
      setCarouselImages(cfg.carouselImages || DEFAULT_CAROUSEL_ITEMS);
      setFeaturedProducts(data.featuredProducts || []);

      const productIds = data.carouselProductIds || (data.featuredProducts || []).map((p: any) => p.id);
      setCarouselProductIds(productIds);

      setBaselineConfig(
        JSON.stringify({
          heroSlides: cfg.heroSlides || DEFAULT_HERO_SLIDES,
          featuredOverrides: cfg.featuredOverrides || {},
          carouselImages: cfg.carouselImages || DEFAULT_CAROUSEL_ITEMS,
          carouselProductIds: productIds,
        })
      );
    } catch (err: any) {
      console.error("[AdminContentPage] Load error:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to load content settings.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      void loadContent();
    }
  }, [user]);

  // Save changes to API
  async function handleSave() {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Authentication required.");

      const payload = {
        heroSlides,
        featuredOverrides,
        carouselImages,
        carouselProductIds,
      };

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Save failed (HTTP ${res.status})`);
      }

      const data = await res.json();
      const cfg: HomepageContentConfig = data.config;

      setHeroSlides(cfg.heroSlides || DEFAULT_HERO_SLIDES);
      setFeaturedOverrides(cfg.featuredOverrides || {});
      setCarouselImages(cfg.carouselImages || DEFAULT_CAROUSEL_ITEMS);

      setBaselineConfig(
        JSON.stringify({
          heroSlides: cfg.heroSlides || DEFAULT_HERO_SLIDES,
          featuredOverrides: cfg.featuredOverrides || {},
          carouselImages: cfg.carouselImages || DEFAULT_CAROUSEL_ITEMS,
          carouselProductIds,
        })
      );

      setStatusMessage({
        type: "success",
        text: "All carousel and content updates published live to storefront.",
      });

      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error("[AdminContentPage] Save error:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to save content configuration.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Reset all to code defaults
  function handleResetAllToDefaults() {
    if (!confirm("Reset all hero, carousel, and gallery items to system defaults? Unsaved changes will be discarded.")) {
      return;
    }
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setFeaturedOverrides({});
    setCarouselImages(DEFAULT_CAROUSEL_ITEMS);
    setStatusMessage({
      type: "success",
      text: "Reset to system defaults. Click 'Save Changes' to apply.",
    });
  }

  // --- Hero Slide helpers ---
  function updateHeroSlideImage(index: number, view: "desktop" | "mobile", url: string) {
    setHeroSlides((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      if (view === "desktop") {
        updated[index] = { ...updated[index], image: url };
      } else {
        updated[index] = { ...updated[index], mobileImage: url };
      }
      return updated;
    });
  }

  // --- Featured Silhouettes Image Overrides ---
  function updateFeaturedImage(productId: string, slot: "image1" | "image2", url: string) {
    setFeaturedOverrides((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [slot]: url,
      },
    }));
  }

  function resetFeaturedProduct(productId: string) {
    setFeaturedOverrides((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  // --- Carousel Product Management (Reordering, Adding, Removing) ---
  function moveCarouselProduct(fromIndex: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= featuredProducts.length) return;

    const updated = [...featuredProducts];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;

    const reindexed = updated.map((p, i) => ({
      ...p,
      slotNumber: i + 1,
      slotId: `slot-${i + 1}`,
    }));

    setFeaturedProducts(reindexed);
    setCarouselProductIds(reindexed.map((p) => p.id));
  }

  function handleAddProductToCarousel(product: CatalogProductOption) {
    if (featuredProducts.some((p) => p.id === product.id)) {
      setStatusMessage({
        type: "error",
        text: `"${product.name}" is already in the carousel.`,
      });
      return;
    }

    if (featuredProducts.length >= 12) {
      setStatusMessage({
        type: "error",
        text: "Carousel limit of 12 pieces reached. Remove an existing piece first.",
      });
      return;
    }

    const firstImage = Array.isArray(product.images) && product.images.length > 0
      ? (typeof product.images[0] === "string" ? product.images[0] : (product.images[0] as any).imageUrl)
      : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80";

    const secondImage = Array.isArray(product.images) && product.images.length > 1
      ? (typeof product.images[1] === "string" ? product.images[1] : (product.images[1] as any).imageUrl)
      : firstImage;

    const catName = typeof product.category === "object" ? product.category?.name : product.category;

    const newEntry: FeaturedProductMeta = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: product.sku || `WST-${product.slug.toUpperCase().slice(0, 8)}`,
      category: catName || "Collection",
      slotNumber: featuredProducts.length + 1,
      slotId: `slot-${featuredProducts.length + 1}`,
      image1: firstImage,
      image2: secondImage,
    };

    const updatedList = [...featuredProducts, newEntry];
    setFeaturedProducts(updatedList);
    setCarouselProductIds(updatedList.map((p) => p.id));

    setStatusMessage({
      type: "success",
      text: `Added "${product.name}" to carousel. Click "Save Changes" to publish to storefront.`,
    });
  }

  function handleConfirmRemove() {
    if (!productPendingRemoval) return;

    const updatedList = featuredProducts
      .filter((p) => p.id !== productPendingRemoval.id)
      .map((p, i) => ({
        ...p,
        slotNumber: i + 1,
        slotId: `slot-${i + 1}`,
      }));

    setFeaturedProducts(updatedList);
    setCarouselProductIds(updatedList.map((p) => p.id));
    setFeaturedOverrides((prev) => {
      const next = { ...prev };
      delete next[productPendingRemoval.id];
      return next;
    });

    setStatusMessage({
      type: "success",
      text: `Removed "${productPendingRemoval.name}" from carousel. Click "Save Changes" to publish.`,
    });
    setProductPendingRemoval(null);
  }

  // --- Safe Catalog Deletion / Archival ---
  async function handleConfirmDelete(archiveInstead = false) {
    if (!productPendingDeletion) return;

    setIsDeletingProduct(true);
    setDeleteErrorMessage(null);

    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Authentication required.");

      const url = `/api/admin/products/${productPendingDeletion.id}${archiveInstead ? "?archive=true" : ""}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409 && data.canArchive) {
          setDeleteCanArchive(true);
        }
        throw new Error(data.error || "Failed to delete product from catalog.");
      }

      // Successfully deleted or archived
      const targetId = productPendingDeletion.id;
      const targetName = productPendingDeletion.name;
      const wasArchived = Boolean(data.archived);

      // Remove from active carousel pieces
      const updatedList = featuredProducts
        .filter((p) => p.id !== targetId)
        .map((p, i) => ({
          ...p,
          slotNumber: i + 1,
          slotId: `slot-${i + 1}`,
        }));

      setFeaturedProducts(updatedList);
      const updatedIds = updatedList.map((p) => p.id);
      setCarouselProductIds(updatedIds);

      const nextOverrides = { ...featuredOverrides };
      delete nextOverrides[targetId];
      setFeaturedOverrides(nextOverrides);

      // Keep baseline in sync so no dirty warning remains after deletion
      setBaselineConfig(
        JSON.stringify({
          heroSlides,
          featuredOverrides: nextOverrides,
          carouselImages,
          carouselProductIds: updatedIds,
        })
      );

      // Close modal
      setProductPendingDeletion(null);
      setDeleteErrorMessage(null);
      setDeleteCanArchive(false);

      setStatusMessage({
        type: "success",
        text: wasArchived
          ? `Product "${targetName}" was archived and removed from the carousel.`
          : `Product "${targetName}" was permanently deleted from your catalog and carousel.`,
      });
    } catch (err: any) {
      console.error("[AdminContentPage] Delete error:", err);
      setDeleteErrorMessage(err.message || "Failed to delete product.");
    } finally {
      setIsDeletingProduct(false);
    }
  }

  // --- Gallery Items helpers ---
  function updateCarouselImage(index: number, url: string) {
    setCarouselImages((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      updated[index] = { ...updated[index], image: url, isCustom: true };
      return updated;
    });
  }

  function resetCarouselItem(index: number) {
    const defaultItem = DEFAULT_CAROUSEL_ITEMS[index];
    if (!defaultItem) return;
    setCarouselImages((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      updated[index] = { ...defaultItem, isCustom: false };
      return updated;
    });
  }

  function moveCarouselItem(fromIndex: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= carouselImages.length) return;

    const updated = [...carouselImages];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;
    setCarouselImages(updated);
  }

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>STOREFRONT</span>
            <span>/</span>
            <span className="text-blue-400">HOMEPAGE CONTENT</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Homepage Content Management
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Manage the images and products displayed throughout your storefront homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved Changes</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetAllToDefaults}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
            <span>Reset All Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving || !hasUnsavedChanges}
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-medium ${
            statusMessage.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ==========================================================
          SECTION A: HERO SECTION IMAGES
         ========================================================== */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Section A: Hero Section Slideshow
              </h2>
              <p className="text-[11px] text-zinc-400">
                Manage the full-screen slides shown on the storefront Hero banner.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            {heroSlides.length} Active Slides
          </span>
        </div>

        <div className="space-y-6">
          {heroSlides.map((slide, index) => {
            const defaultSlide = DEFAULT_HERO_SLIDES[index];
            const isDesktopModified = Boolean(defaultSlide && slide.image !== defaultSlide.image);
            const isMobileModified = Boolean(
              defaultSlide && slide.mobileImage && slide.mobileImage !== defaultSlide.mobileImage
            );

            return (
              <div
                key={slide.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/20 text-xs font-mono font-bold text-blue-400">
                      {slide.id}
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Slide {slide.id}: &quot;{slide.title}&quot;
                    </h3>
                  </div>

                  {(isDesktopModified || isMobileModified) && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Modified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Slot */}
                  <SingleImageUploadSlot
                    label="Desktop View"
                    sublabel="Displayed on screens ≥ 768px (16:9 ratio recommended)"
                    currentImageUrl={slide.image}
                    defaultImageUrl={defaultSlide?.image}
                    aspectRatio="16/9"
                    badge="Desktop"
                    isModified={isDesktopModified}
                    onImageChange={(url) => updateHeroSlideImage(index, "desktop", url)}
                    onResetToDefault={() => updateHeroSlideImage(index, "desktop", defaultSlide?.image || "")}
                    onDeleteImage={() => updateHeroSlideImage(index, "desktop", "")}
                    deleteAriaLabel={`Remove slide ${index + 1} desktop image`}
                    deleteConfirmTitle="Remove this image?"
                    deleteConfirmMessage={`Remove desktop hero image for slide ${index + 1}?`}
                  />

                  {/* Mobile Slot */}
                  <SingleImageUploadSlot
                    label="Mobile View"
                    sublabel="Displayed on phones ≤ 767px (Portrait or 3:4 ratio)"
                    currentImageUrl={slide.mobileImage || slide.image}
                    defaultImageUrl={defaultSlide?.mobileImage || defaultSlide?.image}
                    aspectRatio="3/4"
                    badge="Mobile"
                    isModified={isMobileModified}
                    onImageChange={(url) => updateHeroSlideImage(index, "mobile", url)}
                    onResetToDefault={() =>
                      updateHeroSlideImage(index, "mobile", defaultSlide?.mobileImage || defaultSlide?.image || "")
                    }
                    onDeleteImage={() => updateHeroSlideImage(index, "mobile", "")}
                    deleteAriaLabel={`Remove slide ${index + 1} mobile image`}
                    deleteConfirmTitle="Remove this image?"
                    deleteConfirmMessage={`Remove mobile hero image for slide ${index + 1}?`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================================
          SECTION B: 2024 DROP // THE 3D LOOKBOOK — FEATURED SILHOUETTES
         ========================================================== */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                  2024 DROP // THE 3D LOOKBOOK
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Live 3D Carousel
                </span>
              </div>
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                FEATURED SILHOUETTES (LIVE 3D CAROUSEL)
              </h2>
              <p className="text-[11px] text-zinc-400">
                Manage the products, order, and visual silhouette images presented on the live 3D lookbook carousel. Replaced images float cleanly with automatic transparent backgrounds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800 shrink-0">
              {featuredProducts.length}/12 Pieces Active
            </span>

            {/* + Add Product Button */}
            <button
              type="button"
              disabled={featuredProducts.length >= 12}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Product</span>
            </button>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 text-zinc-700 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No Carousel Products Selected</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Add pieces from your store catalog to feature them in the 3D lookbook carousel.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {featuredProducts.map((product, idx) => {
              const override = featuredOverrides[product.id];
              const rawImg1 = override?.image1;
              const rawImg2 = override?.image2;
              const isImg1Deleted = rawImg1 === "none";
              const isImg2Deleted = rawImg2 === "none";
              const effectiveImg1 = isImg1Deleted ? "" : (rawImg1 || product.image1);
              const effectiveImg2 = isImg2Deleted ? "" : (rawImg2 || product.image2);
              const isModified = !!(
                (rawImg1 && rawImg1 !== product.image1) ||
                (rawImg2 && rawImg2 !== product.image2)
              );

              return (
                <div
                  key={product.id}
                  className={`rounded-xl border p-5 space-y-4 transition ${
                    isModified
                      ? "border-blue-500/40 bg-zinc-900/50 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Reordering Controls */}
                      <div className="flex flex-col items-center gap-1 shrink-0 bg-zinc-950/80 rounded-lg p-1 border border-zinc-800">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveCarouselProduct(idx, "up")}
                          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-20 cursor-pointer"
                          title="Move earlier in carousel"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] font-mono font-bold text-blue-400 px-1">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          disabled={idx === featuredProducts.length - 1}
                          onClick={() => moveCarouselProduct(idx, "down")}
                          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-20 cursor-pointer"
                          title="Move later in carousel"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            {product.name}
                          </h3>
                          {isModified ? (
                            <span className="rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 text-[9px] font-mono font-medium">
                              Override Active
                            </span>
                          ) : (
                            <span className="rounded bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 text-[9px] font-mono font-medium">
                              Catalog Default
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-400 mt-0.5">
                          <span>Slide {String(idx + 1).padStart(2, "0")}</span>
                          <span>•</span>
                          <span>SKU: {product.sku || product.id}</span>
                          <span>•</span>
                          <span>Category: {product.category || "Collection"}</span>
                          <span>•</span>
                          <span className="text-zinc-200">₹{product.price?.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setEditingProductId(product.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/10 px-2.5 py-1.5 text-[11px] font-medium text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit Details</span>
                      </button>

                      {isModified && (
                        <button
                          type="button"
                          onClick={() => resetFeaturedProduct(product.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
                          title="Reset to original catalog images"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Reset Images</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setProductPendingRemoval(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
                        title="Remove piece from carousel only (keeps product in shop catalog)"
                      >
                        <Layers className="h-3 w-3 text-zinc-400" />
                        <span>Remove from Carousel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProductPendingDeletion(product);
                          setDeleteErrorMessage(null);
                          setDeleteCanArchive(false);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-600/10 px-2.5 py-1.5 text-[11px] font-medium text-red-400 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        title="Permanently delete this product from store catalog"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete Product</span>
                      </button>

                      <a
                        href={`/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition px-2 py-1.5"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Image Slot */}
                    <SingleImageUploadSlot
                      label="Primary Carousel Silhouette Image"
                      sublabel="Main visual displayed on the 3D carousel card (3:4 portrait)"
                      currentImageUrl={effectiveImg1}
                      defaultImageUrl={product.image1}
                      aspectRatio="3/4"
                      badge={`Slide ${idx + 1} Primary`}
                      isModified={!!override?.image1}
                      enableBackgroundRemoval={true}
                      onImageChange={(url) => updateFeaturedImage(product.id, "image1", url)}
                      onResetToDefault={() => {
                        if (override?.image2) {
                          setFeaturedOverrides((prev) => ({
                            ...prev,
                            [product.id]: { image2: prev[product.id]?.image2 },
                          }));
                        } else {
                          resetFeaturedProduct(product.id);
                        }
                      }}
                      onDeleteImage={() => {
                        setFeaturedOverrides((prev) => ({
                          ...prev,
                          [product.id]: {
                            ...prev[product.id],
                            image1: "none",
                          },
                        }));
                        setStatusMessage({
                          type: "success",
                          text: `Removed primary silhouette image for "${product.name}". Click "Save Changes" to publish.`,
                        });
                      }}
                      deleteAriaLabel={`Remove primary carousel silhouette image for ${product.name}`}
                      deleteConfirmTitle="Remove this image?"
                      deleteConfirmMessage={`Remove primary carousel silhouette image for "${product.name}"? The card will fall back to the catalog default image until a new image is uploaded.`}
                    />

                    {/* Secondary / Hover Image Slot */}
                    <SingleImageUploadSlot
                      label="Secondary Hover View (Optional)"
                      sublabel="Alternate angle revealed when cursor hovers over active center card"
                      currentImageUrl={effectiveImg2}
                      defaultImageUrl={product.image2}
                      aspectRatio="3/4"
                      badge={`Slide ${idx + 1} Hover`}
                      isModified={!!override?.image2}
                      enableBackgroundRemoval={true}
                      onImageChange={(url) => updateFeaturedImage(product.id, "image2", url)}
                      onResetToDefault={() => {
                        if (override?.image1) {
                          setFeaturedOverrides((prev) => ({
                            ...prev,
                            [product.id]: { image1: prev[product.id]?.image1 },
                          }));
                        } else {
                          resetFeaturedProduct(product.id);
                        }
                      }}
                      onDeleteImage={() => {
                        setFeaturedOverrides((prev) => ({
                          ...prev,
                          [product.id]: {
                            ...prev[product.id],
                            image2: "none",
                          },
                        }));
                        setStatusMessage({
                          type: "success",
                          text: `Removed secondary hover view for "${product.name}". Hover behavior disabled. Click "Save Changes" to publish.`,
                        });
                      }}
                      deleteAriaLabel={`Remove secondary hover view for ${product.name}`}
                      deleteConfirmTitle="Remove this image?"
                      deleteConfirmMessage={`Remove secondary hover view for "${product.name}"? This will disable the hover-image animation on the storefront and retain only the primary image.`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==========================================================
          SECTION C: ARCHIVE GALLERY (FOOTER SCROLLING SHOWCASE)
         ========================================================== */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Images className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Section C: Archive Gallery (Footer Scrolling Showcase)
              </h2>
              <p className="text-[11px] text-zinc-400">
                Manage the horizontal infinite-scrolling archive gallery displayed above the footer.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            {carouselImages.length} Gallery Items
          </span>
        </div>

        <div className="space-y-4">
          {carouselImages.map((item, index) => {
            const defaultItem = DEFAULT_CAROUSEL_ITEMS[index];
            const isModified = Boolean(defaultItem && item.image !== defaultItem.image);

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
              >
                {/* Reordering Controls */}
                <div className="flex sm:flex-col items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveCarouselItem(index, "up")}
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-25 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-zinc-300 px-2 sm:px-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    disabled={index === carouselImages.length - 1}
                    onClick={() => moveCarouselItem(index, "down")}
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-25 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload Slot */}
                <div className="flex-1">
                  <SingleImageUploadSlot
                    label={`Silhouette ${index + 1}: ${item.title}`}
                    sublabel="Featured Silhouettes carousel image (4:3 ratio)"
                    currentImageUrl={item.image}
                    defaultImageUrl={defaultItem?.image}
                    aspectRatio="4/3"
                    badge={`Slot ${index + 1}`}
                    isModified={isModified}
                    onImageChange={(url) => updateCarouselImage(index, url)}
                    onResetToDefault={() => resetCarouselItem(index)}
                    onDeleteImage={() => updateCarouselImage(index, "")}
                    deleteAriaLabel={`Remove silhouette ${index + 1} image`}
                    deleteConfirmTitle="Remove this image?"
                    deleteConfirmMessage={`Remove archive gallery image for Silhouette ${index + 1}: ${item.title}?`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================================
          ADD PRODUCT TO CAROUSEL MODAL
         ========================================================== */}
      <AddCarouselProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingProductIds={featuredProducts.map((p) => p.id)}
        onAddProduct={handleAddProductToCarousel}
        maxLimit={12}
      />

      {/* ==========================================================
          REMOVE PRODUCT FROM CAROUSEL ONLY CONFIRMATION MODAL
         ========================================================== */}
      {productPendingRemoval && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setProductPendingRemoval(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Remove from Carousel Only
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Keep in catalog, remove from lookbook
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Remove <strong className="text-white">&quot;{productPendingRemoval.name}&quot;</strong> from Featured Silhouettes?
              This piece will no longer appear on the 3D lookbook carousel. The actual product will <strong className="text-emerald-400">remain fully active and intact</strong> in your store catalog.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setProductPendingRemoval(null)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Remove from Carousel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          DELETE PRODUCT FROM STORE CATALOG CONFIRMATION MODAL
         ========================================================== */}
      {productPendingDeletion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            if (!isDeletingProduct) {
              setProductPendingDeletion(null);
              setDeleteErrorMessage(null);
              setDeleteCanArchive(false);
            }
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-red-500/40 bg-zinc-950 p-6 shadow-2xl space-y-4 text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Delete Product from Catalog</span>
                  <span className="rounded bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 text-[9px] font-mono font-medium">
                    Permanent
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Permanent removal from database &amp; store catalog
                </p>
              </div>
            </div>

            {/* Product Overview Card */}
            <div className="flex items-center gap-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="h-14 w-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                {productPendingDeletion.image1 ? (
                  <img
                    src={productPendingDeletion.image1}
                    alt={productPendingDeletion.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ShoppingBag className="h-5 w-5 text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">
                  {productPendingDeletion.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-400 mt-0.5">
                  <span>SKU: {productPendingDeletion.sku || productPendingDeletion.id}</span>
                  <span>•</span>
                  <span className="text-zinc-200 font-semibold">
                    ₹{productPendingDeletion.price?.toLocaleString("en-IN")}
                  </span>
                  <span>•</span>
                  <span>{productPendingDeletion.category || "Collection"}</span>
                </div>
              </div>
            </div>

            {/* Warning description */}
            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 text-xs text-red-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-red-400 uppercase tracking-wide text-[10px]">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Irreversible Store Catalog Deletion</span>
              </div>
              <p className="leading-relaxed text-[11px] text-zinc-300">
                This will permanently delete <strong className="text-white">&quot;{productPendingDeletion.name}&quot;</strong> from your database and catalog. It will be immediately removed from shop listings, product detail pages, search results, and this carousel.
              </p>
            </div>

            {/* Error Feedback / Order History Protection (e.g., 409 Conflict) */}
            {deleteErrorMessage && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Cannot Delete Product With Orders</span>
                </div>
                <p className="leading-relaxed text-[11px] text-zinc-300">
                  {deleteErrorMessage}
                </p>
                {deleteCanArchive && (
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isDeletingProduct}
                      onClick={() => handleConfirmDelete(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      {isDeletingProduct ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                      <span>Archive Product Instead</span>
                    </button>
                    <span className="text-[10px] text-zinc-400">
                      (Hides from shop &amp; carousel while preserving order records)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => {
                  setProductPendingDeletion(null);
                  setDeleteErrorMessage(null);
                  setDeleteCanArchive(false);
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => handleConfirmDelete(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isDeletingProduct ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting from Store...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Permanently Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          EDIT PRODUCT DETAILS MODAL
         ========================================================== */}
      <ProductDetailsModal
        productId={editingProductId}
        isOpen={Boolean(editingProductId)}
        onClose={() => setEditingProductId(null)}
        currentOverride={editingProductId ? featuredOverrides[editingProductId] : undefined}
        onSaveOverride={(id, override) => {
          setFeaturedOverrides((prev) => {
            const next = { ...prev };
            const current = { ...(prev[id] || {}) };
            if (override.image1 !== undefined) current.image1 = override.image1;
            if (override.image2 !== undefined) current.image2 = override.image2;
            next[id] = current;
            return next;
          });
        }}
        onSuccess={(updatedProduct) => {
          setFeaturedProducts((prev) =>
            prev.map((p) =>
              p.id === updatedProduct.id
                ? {
                    ...p,
                    name: updatedProduct.name,
                    slug: updatedProduct.slug,
                    price: updatedProduct.price,
                    compareAtPrice: updatedProduct.compareAtPrice,
                    category: updatedProduct.category?.name || p.category,
                    image1: updatedProduct.images?.[0]?.imageUrl || p.image1,
                    image2: updatedProduct.images?.[1]?.imageUrl || p.image2,
                  }
                : p
            )
          );
          void loadContent();
        }}
      />
    </div>
  );
}
