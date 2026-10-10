"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { ImageUpload, UploadedImage } from "@/components/admin/ImageUpload";
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    brand: "WASTE.",
    status: "ACTIVE",
    inventory: "20",
    featured: false,
    tags: "Outerwear, Signature",
  });

  const [images, setImages] = useState<UploadedImage[]>([
    {
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
      altText: "Primary Product Photo",
      sortOrder: 0,
    },
  ]);

  useEffect(() => {
    async function fetchCats() {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0 && !form.categoryId) {
            setForm((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    void fetchCats();
  }, [user]);

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || prev.slug.startsWith(name.slice(0, 3).toLowerCase()) ? slug : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError("Product Name and Price are mandatory.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          images,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white transition"
            title="Back to products"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-0.5">
              ADMIN / PRODUCTS / NEW
            </div>
            <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Add New Product
            </h1>
            <p className="text-xs text-zinc-400">Create a new garment or accessory in the catalog.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Publish Product</span>
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Basic Information</h2>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Product Title *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. The Course Utility Jacket — Obsidian Navy"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="course-utility-jacket-navy"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Brand / Studio
                </label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Short Summary
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Brief single-line summary for product grids"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed craft notes, materials, specifications, and fit..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Media Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6">
            <ImageUpload images={images} onChange={setImages} />
          </div>

          {/* Pricing & Stock Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Pricing & Inventory</h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Price (INR) *
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="1900"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Compare At Price
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.compareAtPrice}
                  onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                  placeholder="2400"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Stock Quantity *
                </label>
                <input
                  required
                  type="number"
                  value={form.inventory}
                  onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                  placeholder="20"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Settings & Category */}
        <div className="space-y-6">
          {/* Status & Visibility Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Organization</h2>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Publish Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">Active (Live on Store)</option>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Outerwear, Heritage, Limited"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="border-t border-zinc-800/80 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Featured Showcase
                  </span>
                  <span className="block text-[10px] text-zinc-500">
                    Feature prominently on the homepage and hero carousels
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
