"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SingleImageUploadSlot } from "@/components/admin/SingleImageUploadSlot";
import { ProductDetailsModal } from "@/components/admin/ProductDetailsModal";
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
  Sparkles,
  Layers,
  ShoppingBag,
  Images,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Loader2,
  Edit3,
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Initial baseline to track unsaved changes
  const [baselineConfig, setBaselineConfig] = useState<string>("");

  const hasUnsavedChanges = useMemo(() => {
    if (!baselineConfig) return false;
    const current = JSON.stringify({ heroSlides, featuredOverrides, carouselImages });
    return current !== baselineConfig;
  }, [heroSlides, featuredOverrides, carouselImages, baselineConfig]);

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

      setBaselineConfig(
        JSON.stringify({
          heroSlides: cfg.heroSlides || DEFAULT_HERO_SLIDES,
          featuredOverrides: cfg.featuredOverrides || {},
          carouselImages: cfg.carouselImages || DEFAULT_CAROUSEL_ITEMS,
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
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Failed to save changes (HTTP ${res.status})`);
      }

      setBaselineConfig(JSON.stringify(payload));
      setStatusMessage({
        type: "success",
        text: "Homepage visual content updated and published to the live storefront successfully.",
      });

      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (err: any) {
      console.error("[AdminContentPage] Save error:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to publish homepage changes.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Reset entire page to initial code defaults
  function handleResetAllToDefaults() {
    if (window.confirm("Are you sure you want to restore all homepage images to their initial storefront defaults?")) {
      setHeroSlides(DEFAULT_HERO_SLIDES);
      setFeaturedOverrides({});
      setCarouselImages(DEFAULT_CAROUSEL_ITEMS.map((item) => ({ ...item, isCustom: false })));
    }
  }

  // Hero slide handlers
  function updateHeroSlideImage(index: number, type: "desktop" | "mobile", url: string) {
    setHeroSlides((prev) => {
      const updated = [...prev];
      if (type === "desktop") {
        updated[index] = { ...updated[index], image: url };
      } else {
        updated[index] = { ...updated[index], mobileImage: url };
      }
      return updated;
    });
  }

  function resetHeroSlide(index: number) {
    const defaultSlide = DEFAULT_HERO_SLIDES[index];
    if (!defaultSlide) return;
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...defaultSlide };
      return updated;
    });
  }

  // Featured products handlers
  function updateFeaturedImage(productId: string, key: "image1" | "image2", url: string) {
    setFeaturedOverrides((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [key]: url,
      },
    }));
  }

  function resetFeaturedProduct(productId: string) {
    setFeaturedOverrides((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }

  // Carousel handlers
  function updateCarouselImage(index: number, url: string) {
    setCarouselImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], image: url, mobileImage: url, isCustom: true };
      return updated;
    });
  }

  function moveCarouselItem(index: number, direction: "up" | "down") {
    setCarouselImages((prev) => {
      const updated = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  }

  function resetCarouselItem(index: number) {
    const defaultItem = DEFAULT_CAROUSEL_ITEMS[index];
    if (!defaultItem) return;
    setCarouselImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...defaultItem, isCustom: false };
      return updated;
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
          Loading Homepage Visual Configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      {/* ==========================================================
          HEADER & ACTIONS
         ========================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <span>ADMIN</span>
            <span>/</span>
            <span>STOREFRONT</span>
            <span>/</span>
            <span className="text-blue-400">HOMEPAGE CONTENT</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Homepage Content Management
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Manage the images displayed throughout your storefront homepage.
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
            <span>Reset All Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving || !hasUnsavedChanges}
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              defaultSlide &&
              slide.mobileImage &&
              slide.mobileImage !== (defaultSlide.mobileImage || defaultSlide.image)
            );

            return (
              <div
                key={slide.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600/20 text-xs font-mono font-bold text-blue-400 border border-blue-500/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Slide {index + 1}: {slide.title}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Slide ID: {slide.id}
                      </span>
                    </div>
                  </div>

                  {(isDesktopModified || isMobileModified) && (
                    <button
                      type="button"
                      onClick={() => resetHeroSlide(index)}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset Slide to Default</span>
                    </button>
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
                Directly manage and replace the images displayed on each card of the live 3D lookbook carousel. Replaced images take priority on the storefront without altering database catalog records or prices.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 shrink-0">
            {featuredProducts.length} Carousel Cards Active
          </span>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-xs text-zinc-400">
              No active featured products detected in the database. Ensure at least one product has the &quot;Featured&quot; tag enabled in the product catalog.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {featuredProducts.map((product, idx) => {
              const override = featuredOverrides[product.id];
              const effectiveImg1 = override?.image1 || product.image1;
              const effectiveImg2 = override?.image2 || product.image2;
              const isModified = !!(override?.image1 || override?.image2);

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
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-mono font-bold text-blue-400 border border-blue-500/30">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            {product.name}
                          </h3>
                          {isModified ? (
                            <span className="rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 text-[9px] font-mono font-medium">
                              Admin Override Active
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
                          <span>ID: {product.id}</span>
                          <span>•</span>
                          <span>SKU: {product.sku || `WST-PROD-00${idx + 1}`}</span>
                          <span>•</span>
                          <span>Category: {product.category || "Streetwear"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setEditingProductId(product.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/10 px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit Product Details</span>
                      </button>

                      {isModified && (
                        <button
                          type="button"
                          onClick={() => resetFeaturedProduct(product.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Reset Carousel Images</span>
                        </button>
                      )}

                      <a
                        href={`/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition px-1 py-1"
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
                      badge={`Card ${idx + 1} Primary`}
                      isModified={!!override?.image1}
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
                    />

                    {/* Secondary / Hover Image Slot */}
                    <SingleImageUploadSlot
                      label="Secondary Hover View (Optional)"
                      sublabel="Alternate angle revealed when cursor hovers over active center card"
                      currentImageUrl={effectiveImg2}
                      defaultImageUrl={product.image2}
                      aspectRatio="3/4"
                      badge={`Card ${idx + 1} Hover`}
                      isModified={!!override?.image2}
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
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-25"
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
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-25"
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
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================================
          EDIT PRODUCT DETAILS MODAL
         ========================================================== */}
      <ProductDetailsModal
        productId={editingProductId}
        isOpen={Boolean(editingProductId)}
        onClose={() => setEditingProductId(null)}
        currentOverride={editingProductId ? featuredOverrides[editingProductId] : undefined}
        onSaveOverride={(id, override) => {
          if (override.image1 || override.image2) {
            setFeaturedOverrides((prev) => ({
              ...prev,
              [id]: {
                image1: override.image1 || prev[id]?.image1,
                image2: override.image2 || prev[id]?.image2,
              },
            }));
          }
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
