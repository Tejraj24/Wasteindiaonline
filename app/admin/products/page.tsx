"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Star,
  Package,
  ExternalLink,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  status: string;
  inventory: number;
  featured: boolean;
  brand: string;
  category?: { id: string; name: string } | null;
  images: Array<{ imageUrl: string; altText?: string }>;
  createdAt: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadCategories() {
    if (!user) return;
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
    }
  }

  async function loadProducts() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(search ? { search } : {}),
        ...(selectedCategory ? { category: selectedCategory } : {}),
        ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
      });

      const res = await fetch(`/api/admin/products?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
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

  useEffect(() => {
    void loadProducts();
  }, [user, page, search, selectedCategory, selectedStatus]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    setActionLoadingId(id);
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDuplicate(id: string) {
    setActionLoadingId(id);
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        void loadProducts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    try {
      const token = await user?.getIdToken();
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !current }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleSelectAll() {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

    return (
    <div className="space-y-6">
      {/* Page-Level Heading and Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / PRODUCTS
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Product Catalog
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Manage catalog merchandise, inventory levels, pricing, and showcase status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => void loadProducts()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            title="Refresh product list"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, SKU, description..."
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-xs text-zinc-300 outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-xs text-zinc-300 outline-none focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="w-10 px-4 py-3.5">
                  <button type="button" onClick={handleSelectAll} className="text-zinc-400 hover:text-white">
                    {selectedIds.length === products.length && products.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5 font-semibold">Product</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Inventory</th>
                <th className="px-4 py-3.5 font-semibold">Category</th>
                <th className="px-4 py-3.5 font-semibold text-right">Price</th>
                <th className="px-4 py-3.5 font-semibold text-center">Featured</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-500">
                    <Package className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-400 font-medium">No products found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isBusy = actionLoadingId === p.id;
                  const thumb = p.images[0]?.imageUrl;

                  return (
                    <tr
                      key={p.id}
                      className={`transition hover:bg-zinc-900/40 ${isSelected ? "bg-blue-950/20" : ""}`}
                    >
                      <td className="px-4 py-3.5">
                        <button type="button" onClick={() => toggleSelect(p.id)} className="text-zinc-400 hover:text-white">
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                            {thumb ? (
                              <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-editorial text-xs text-zinc-600">
                                W
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="font-medium text-white hover:text-blue-400 transition truncate block"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-zinc-500 font-mono">{p.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            p.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : p.status === "DRAFT"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-mono text-xs ${
                            p.inventory <= 0
                              ? "text-red-400 font-bold"
                              : p.inventory <= 5
                              ? "text-amber-400 font-semibold"
                              : "text-zinc-300"
                          }`}
                        >
                          {p.inventory <= 0 ? "Out of stock" : `${p.inventory} in stock`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400">{p.category?.name || "Uncategorized"}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-white">
                        {formatPrice(p.price)}
                        {p.compareAtPrice && (
                          <span className="block text-[10px] text-zinc-500 line-through">
                            {formatPrice(p.compareAtPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => void handleToggleFeatured(p.id, p.featured)}
                          className={`rounded p-1 transition ${
                            p.featured ? "text-amber-400 hover:text-amber-300" : "text-zinc-600 hover:text-zinc-400"
                          }`}
                          title="Toggle featured"
                        >
                          <Star className={`h-4 w-4 ${p.featured ? "fill-current" : ""}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                            title="View on storefront"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleDuplicate(p.id)}
                            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-40"
                            title="Duplicate product"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleDelete(p.id)}
                            className="rounded p-1.5 text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                            title="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-3 text-xs text-zinc-400">
          <span>
            Showing <strong className="text-white">{products.length}</strong> of{" "}
            <strong className="text-white">{totalCount}</strong> products
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-8 items-center gap-1 rounded-lg border border-zinc-800 px-3 text-xs text-zinc-300 hover:bg-zinc-900 disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span className="px-2 font-mono text-zinc-300">
              {page} / {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-8 items-center gap-1 rounded-lg border border-zinc-800 px-3 text-xs text-zinc-300 hover:bg-zinc-900 disabled:opacity-30"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
