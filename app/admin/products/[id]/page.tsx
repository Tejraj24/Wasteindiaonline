"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { ImageUpload, UploadedImage } from "@/components/admin/ImageUpload";
import { ArrowLeft, Save, Loader2, Trash2, ExternalLink, Sparkles } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const { user } = useAuth();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    inventory: "10",
    featured: false,
    tags: "",
  });

  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!user || !id) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();

        // 1. Categories
        const catRes = await fetch("/api/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (catRes.ok) {
          setCategories(await catRes.json());
        }

        // 2. Product
        const prodRes = await fetch(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (prodRes.ok) {
          const data = await prodRes.json();
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            shortDescription: data.shortDescription || "",
            price: data.price?.toString() || "",
            compareAtPrice: data.compareAtPrice?.toString() || "",
            categoryId: data.categoryId || "",
            brand: data.brand || "WASTE.",
            status: data.status || "ACTIVE",
            inventory: data.inventory?.toString() || "0",
            featured: Boolean(data.featured),
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          });
          setImages(
            (data.images || []).map((img: { imageUrl: string; altText?: string }, i: number) => ({
              imageUrl: img.imageUrl,
              altText: img.altText,
              sortOrder: i,
            }))
          );
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user, id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError("Name and price are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
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
        throw new Error(data?.error || "Failed to update product");
      }

      setSuccess("Product updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    setDeleting(true);
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push("/admin/products");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
              ADMIN / PRODUCTS / EDIT
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Edit Product
              </h1>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                {form.slug}
              </span>
            </div>
            <p className="text-xs text-zinc-400">Update pricing, media, inventory, and merchandising attributes.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/product/${form.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-400">
          {success}
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
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Brand
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
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Organization & Meta */}
        <div className="space-y-6">
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
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Featured Product
                  </span>
                  <span className="block text-[10px] text-zinc-500">
                    Feature prominently on the storefront homepage
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
