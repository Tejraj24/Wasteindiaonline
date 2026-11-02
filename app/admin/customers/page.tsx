"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Heart,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

interface CustomerData {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  role: "ADMIN" | "CUSTOMER";
  totalSpent: number;
  ordersCount: number;
  wishlistCount: number;
  createdAt: string;
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadCustomers() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(search ? { search } : {}),
        ...(roleFilter ? { role: roleFilter } : {}),
      });

      const res = await fetch(`/api/admin/customers?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
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
    void loadCustomers();
  }, [user, page, search, roleFilter]);

  async function handleToggleRole(cust: CustomerData) {
    const newRole = cust.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!confirm(`Are you sure you want to change ${cust.name}'s role to ${newRole}?`)) return;

    setUpdatingId(cust.id);
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: cust.id, role: newRole }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === cust.id ? { ...c, role: newRole } : c))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / CUSTOMERS
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Clientele Directory
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            View registered members, purchase history, lifetime value, and manage roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCustomers()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-zinc-400 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span>Refresh</span>
        </button>
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
            placeholder="Search by name, email, phone, city..."
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-xs text-zinc-300 outline-none focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Administrators</option>
            <option value="CUSTOMER">Customers</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Member</th>
                <th className="px-4 py-3.5 font-semibold">Contact & Location</th>
                <th className="px-4 py-3.5 font-semibold">Role</th>
                <th className="px-4 py-3.5 font-semibold text-center">Orders</th>
                <th className="px-4 py-3.5 font-semibold text-right">Lifetime Spend</th>
                <th className="px-4 py-3.5 font-semibold">Joined</th>
                <th className="px-4 py-3.5 font-semibold text-right">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2">Loading customer directory...</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    <Users className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-400 font-medium">No customers found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try refining your search terms.</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const isUpdating = updatingId === c.id;

                  return (
                    <tr key={c.id} className="hover:bg-zinc-900/40 transition">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-400">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-zinc-300">{c.phone}</p>
                        <p className="text-[10px] text-zinc-500">
                          {c.city !== "—" ? `${c.city}, ${c.country}` : c.country}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            c.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          }`}
                        >
                          {c.role === "ADMIN" ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          {c.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-medium">
                        {c.ordersCount}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-white">
                        {formatPrice(c.totalSpent)}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400 text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void handleToggleRole(c)}
                          className="rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800 hover:text-white transition disabled:opacity-40"
                        >
                          {c.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}
                        </button>
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
            Showing <strong className="text-white">{customers.length}</strong> of{" "}
            <strong className="text-white">{totalCount}</strong> members
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
