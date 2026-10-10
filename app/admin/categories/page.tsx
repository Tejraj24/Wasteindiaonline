"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Loader2,
  X,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Package,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  async function loadCategories() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, [user]);

  function handleOpenCreate() {
    setEditingCategory(null);
    setForm({ name: "", slug: "", description: "", image: "" });
    setError("");
    setModalOpen(true);
  }

  function handleOpenEdit(cat: CategoryItem) {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
    });
    setError("");
    setModalOpen(true);
  }

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category Name is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const token = await user?.getIdToken();
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save category");
      }

      setModalOpen(false);
      void loadCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save category";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category? Products in this category will become uncategorized.")) return;

    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / CATEGORIES
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Collections & Categories
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Structure your store catalog for seamless customer navigation and discovery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-12 text-center">
          <FolderTree className="mx-auto h-10 w-10 text-zinc-600" />
          <h2 className="mt-3 text-sm font-semibold text-white">No categories created yet</h2>
          <p className="mt-1 text-xs text-zinc-500">Create your first category to organize your products.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5 transition hover:border-zinc-700"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                      <Tags className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                      <p className="font-mono text-[10px] text-zinc-500">/{cat.slug}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                    <Package className="h-3 w-3" /> {cat._count?.products || 0} products
                  </span>
                </div>

                {cat.description && (
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-zinc-800/60 pt-3">
                <span className="text-[10px] text-zinc-500">
                  ID: {cat.id.slice(0, 8)}...
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                    title="Edit category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(cat.id)}
                    className="rounded p-1.5 text-red-400 hover:bg-red-500/10 transition"
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isSaving && setModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-base font-semibold text-white">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Category Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Outerwear"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="outerwear"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A curated selection of technical weather-resistant garments..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Header Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingCategory ? "Save Changes" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
