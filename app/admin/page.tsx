"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: string;
  ordersChange: string;
  customersChange: string;
  productsActive: number;
}

interface SalesDataPoint {
  day: string;
  date: string;
  sales: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface LowStockItem {
  id: string;
  name: string;
  slug: string;
  inventory: number;
  price: number;
  category?: { name: string } | null;
  images: Array<{ imageUrl: string }>;
}

interface LatestCustomer {
  id: string;
  name: string;
  email: string;
  role: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesOverview, setSalesOverview] = useState<SalesDataPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [latestCustomers, setLatestCustomers] = useState<LatestCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState<"sales" | "orders">("sales");

  async function loadDashboard() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSalesOverview(data.salesOverview || []);
        setRecentOrders(data.recentOrders || []);
        setLowStock(data.lowStockProducts || []);
        setLatestCustomers(data.latestCustomers || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, [user]);

  const maxChartValue = Math.max(
    ...(salesOverview.map((d) => (activeChartTab === "sales" ? d.sales : d.orders)) || [100])
  );

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / DASHBOARD
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Executive Overview
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Real-time telemetry and commercial health for WASTE. store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-white">
            {stats ? formatPrice(stats.totalRevenue) : "—"}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-semibold">{stats?.revenueChange || "+14.8%"}</span>
            <span className="text-zinc-500">vs last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-white">
            {stats ? stats.totalOrders.toLocaleString() : "—"}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-semibold">{stats?.ordersChange || "+8.2%"}</span>
            <span className="text-zinc-500">vs last month</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Customers</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-white">
            {stats ? stats.totalCustomers.toLocaleString() : "—"}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-semibold">{stats?.customersChange || "+12.4%"}</span>
            <span className="text-zinc-500">active members</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Catalog Count</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-white">
            {stats ? stats.totalProducts.toLocaleString() : "—"}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="font-semibold text-amber-400">{lowStock.length}</span>
            <span className="text-zinc-500">low stock items</span>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Low Stock Alert Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sales & Orders Overview Chart */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 lg:col-span-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Commercial Velocity</h2>
              <p className="text-xs text-zinc-400">Performance across the last 7-day rolling window.</p>
            </div>
            <div className="flex rounded-lg bg-zinc-900 p-1">
              <button
                type="button"
                onClick={() => setActiveChartTab("sales")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeChartTab === "sales"
                    ? "bg-blue-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Revenue (INR)
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab("orders")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeChartTab === "orders"
                    ? "bg-blue-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Order Volume
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 flex h-60 items-end gap-3 sm:gap-6 pt-6">
            {salesOverview.map((item) => {
              const val = activeChartTab === "sales" ? item.sales : item.orders;
              const heightPercent = maxChartValue > 0 ? Math.max(12, Math.round((val / maxChartValue) * 100)) : 10;

              return (
                <div key={item.date} className="group relative flex flex-1 flex-col items-center gap-2">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none rounded bg-zinc-800 px-2 py-1 text-[10px] font-bold text-white shadow-xl whitespace-nowrap z-10">
                    {activeChartTab === "sales" ? formatPrice(val) : `${val} orders`}
                  </div>
                  {/* Bar */}
                  <div className="w-full rounded-t-md bg-zinc-800/60 transition-all duration-300 group-hover:bg-blue-500 flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-blue-600/80 rounded-t-md transition-all duration-500 group-hover:bg-blue-400"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  {/* X Axis label */}
                  <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-300">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Inventory Alerts Card */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-base font-semibold text-white">Stock Warnings</h2>
            </div>
            <Link
              href="/admin/products?status=ACTIVE"
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {lowStock.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">All inventory levels are optimal.</p>
            ) : (
              lowStock.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                      {item.images[0]?.imageUrl ? (
                        <img src={item.images[0].imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs">W</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-200">{item.name}</p>
                      <p className="text-[10px] text-zinc-500">{item.category?.name || "Collection"}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.inventory === 0
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.inventory === 0 ? "Out of stock" : `${item.inventory} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Latest Customers Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Orders</h2>
              <p className="text-xs text-zinc-400">Latest transactions completed in the store.</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              All orders <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No orders received yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition">
                      <td className="py-3.5 font-mono font-medium text-white">{order.orderNumber}</td>
                      <td className="py-3.5">
                        <p className="font-medium text-zinc-200">{order.customerName || "Member"}</p>
                        <p className="text-[10px] text-zinc-500">{order.customerEmail}</p>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : order.orderStatus === "SHIPPED"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : order.orderStatus === "CONFIRMED"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-semibold text-zinc-100">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/orders?search=${order.orderNumber}`}
                          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                        >
                          <Eye className="inline h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Registered Customers */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Latest Members</h2>
              <p className="text-xs text-zinc-400">Newly registered clientele.</p>
            </div>
            <Link
              href="/admin/customers"
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Directory <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {latestCustomers.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">No members registered yet.</p>
            ) : (
              latestCustomers.map((cust) => (
                <div key={cust.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-400">
                      {cust.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-200">{cust.name}</p>
                      <p className="truncate text-[10px] text-zinc-500">{cust.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-zinc-200">{formatPrice(cust.totalSpent)}</p>
                    <p className="text-[10px] text-zinc-500">{cust.ordersCount} orders</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
