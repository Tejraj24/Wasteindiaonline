"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface OrderItemData {
  id: string;
  title: string;
  size: string | null;
  quantity: number;
  price: number;
  image: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  } | null;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItemData[];
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function loadOrders() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(search ? { search } : {}),
        ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
        ...(selectedPaymentStatus !== "ALL" ? { paymentStatus: selectedPaymentStatus } : {}),
      });

      const res = await fetch(`/api/admin/orders?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
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
    void loadOrders();
  }, [user, page, search, selectedStatus, selectedPaymentStatus]);

  async function handleUpdateOrderStatus(orderId: string, newStatus: string) {
    setIsUpdatingStatus(true);
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
        if (activeOrder?.id === orderId) {
          setActiveOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleUpdatePaymentStatus(orderId: string, newPaymentStatus: string) {
    setIsUpdatingStatus(true);
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o)));
        if (activeOrder?.id === orderId) {
          setActiveOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "PACKED":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "CONFIRMED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / ORDERS
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Order Fulfillment
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Track customer orders, monitor status pipelines, manage shipments and dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOrders()}
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
            placeholder="Search order #, customer, email, phone..."
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Order Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-xs text-zinc-300 outline-none focus:border-blue-500"
          >
            <option value="ALL">All Order Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedPaymentStatus}
            onChange={(e) => {
              setSelectedPaymentStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-xs text-zinc-300 outline-none focus:border-blue-500"
          >
            <option value="ALL">All Payments</option>
            {PAYMENT_STATUSES.map((ps) => (
              <option key={ps} value={ps}>
                Payment: {ps}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Order</th>
                <th className="px-4 py-3.5 font-semibold">Date</th>
                <th className="px-4 py-3.5 font-semibold">Customer</th>
                <th className="px-4 py-3.5 font-semibold">Payment</th>
                <th className="px-4 py-3.5 font-semibold">Fulfillment Status</th>
                <th className="px-4 py-3.5 font-semibold text-right">Items</th>
                <th className="px-4 py-3.5 font-semibold text-right">Total</th>
                <th className="px-4 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-500">
                    <ShoppingBag className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-400 font-medium">No orders found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try resetting the status or search filter.</p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-900/40 transition">
                    <td className="px-4 py-3.5 font-mono font-semibold text-white">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-zinc-200">{o.customerName || "Guest Member"}</p>
                      <p className="text-[10px] text-zinc-500">{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          o.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : o.paymentStatus === "FAILED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => void handleUpdateOrderStatus(o.id, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-zinc-900 outline-none ${getStatusBadge(
                          o.orderStatus
                        )}`}
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st} className="bg-zinc-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-400">
                      {o.items.reduce((acc, it) => acc + it.quantity, 0)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-white">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveOrder(o)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                      >
                        <Eye className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-3 text-xs text-zinc-400">
          <span>
            Showing <strong className="text-white">{orders.length}</strong> of{" "}
            <strong className="text-white">{totalCount}</strong> orders
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

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveOrder(null)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-mono text-white">{activeOrder.orderNumber}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      activeOrder.orderStatus
                    )}`}
                  >
                    {activeOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Placed on {new Date(activeOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="rounded-md p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Modifiers */}
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
              <div>
                <label className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-400 mb-1">
                  Order Status
                </label>
                <select
                  disabled={isUpdatingStatus}
                  value={activeOrder.orderStatus}
                  onChange={(e) => void handleUpdateOrderStatus(activeOrder.id, e.target.value)}
                  className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-white outline-none focus:border-blue-500"
                >
                  {ORDER_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-400 mb-1">
                  Payment Status
                </label>
                <select
                  disabled={isUpdatingStatus}
                  value={activeOrder.paymentStatus}
                  onChange={(e) => void handleUpdatePaymentStatus(activeOrder.id, e.target.value)}
                  className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-white outline-none focus:border-blue-500"
                >
                  {PAYMENT_STATUSES.map((ps) => (
                    <option key={ps} value={ps}>
                      {ps}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Shipping Section */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-zinc-400 mb-2">Customer</h3>
                <p className="text-sm font-semibold text-white">{activeOrder.customerName || "Member"}</p>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-zinc-500" /> {activeOrder.customerEmail}
                </p>
                {activeOrder.customerPhone && (
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-zinc-500" /> {activeOrder.customerPhone}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-zinc-400 mb-2">Shipping Destination</h3>
                {activeOrder.shippingAddress ? (
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {activeOrder.shippingAddress.addressLine1}
                    {activeOrder.shippingAddress.addressLine2 && `, ${activeOrder.shippingAddress.addressLine2}`}
                    <br />
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.pincode}
                    <br />
                    {activeOrder.shippingAddress.country || "India"}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-500">No detailed shipping address recorded.</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-zinc-400 mb-3">Order Items</h3>
              <div className="divide-y divide-zinc-800/60">
                {activeOrder.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                        {it.image ? (
                          <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-editorial text-xs text-zinc-600">
                            W
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{it.title}</p>
                        <p className="text-[10px] text-zinc-500">Size: {it.size || "M"} • Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="mt-4 border-t border-zinc-800 pt-3 space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(activeOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{activeOrder.shipping === 0 ? "Free" : formatPrice(activeOrder.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(activeOrder.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-2 text-sm font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(activeOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
