"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Footer } from "@/components/Footer";
import { CheckCircle2, XCircle, Clock, ArrowRight, RefreshCw, ShoppingBag } from "lucide-react";

interface VerifiedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  isPreorder: boolean;
  releaseDate?: string | null;
  shippingAddress: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
  items: Array<{
    id: string;
    title: string;
    size: string | null;
    quantity: number;
    price: number;
    isPreorder: boolean;
  }>;
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<VerifiedOrder | null>(null);
  const [verifiedState, setVerifiedState] = useState<"COMPLETED" | "PENDING" | "FAILED">("PENDING");
  const [error, setError] = useState("");

  async function checkVerification() {
    if (!orderNumber) {
      setError("No order reference provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/verify?orderNumber=${encodeURIComponent(orderNumber)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to verify order status.");
      }

      setOrder(data.order);
      const state = data.verifiedState === "COMPLETED" || data.order.paymentStatus === "PAID"
        ? "COMPLETED"
        : data.verifiedState === "FAILED" || data.order.paymentStatus === "FAILED"
        ? "FAILED"
        : "PENDING";

      setVerifiedState(state);

      if (state === "COMPLETED") {
        clearCart();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void checkVerification();
  }, [orderNumber]);

  return (
    <div className="mx-auto max-w-3xl">
      {loading ? (
        <div className="border border-brand-border bg-brand-surface p-10 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-brand-black" />
          <h1 className="mt-6 font-editorial text-3xl sm:text-4xl text-brand-black">
            Verifying Payment with PhonePe...
          </h1>
          <p className="mt-3 text-xs uppercase tracking-widest text-brand-muted">
            Confirming server-to-server transaction status
          </p>
        </div>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 p-8 text-center text-red-700">
          <XCircle className="mx-auto h-10 w-10 text-red-600" />
          <h1 className="mt-4 font-editorial text-3xl">Order Verification Failed</h1>
          <p className="mt-2 text-sm">{error}</p>
          <a
            href="/cart"
            className="mt-6 inline-block border-b border-brand-black pb-1 text-xs uppercase tracking-widest text-brand-black"
          >
            Return to Cart
          </a>
        </div>
      ) : verifiedState === "COMPLETED" && order ? (
        <div className="border border-brand-border bg-brand-surface p-8 sm:p-12">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Payment Verified</span>
          </div>

          <h1 className="mt-4 font-editorial text-4xl sm:text-6xl tracking-[-0.04em] text-brand-black">
            Order Confirmed
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-muted">
            Order #{order.orderNumber} &bull; A confirmation receipt has been sent to {order.customerEmail}
          </p>

          {order.isPreorder && (
            <div className="mt-6 border-l-2 border-brand-black bg-brand-surfaceSubtle p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black">
                Pre-Order Allocation Secured
              </p>
              <p className="mt-1 text-xs leading-5 text-brand-muted">
                Your merchandise is scheduled for production.
                {order.releaseDate
                  ? ` Expected dispatch: ${new Date(order.releaseDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`
                  : ""}
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-brand-border pt-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand-black font-semibold">Items Purchased</h2>
            <ul className="mt-4 divide-y divide-brand-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-3 text-xs">
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-brand-black">{item.title}</span>
                    <span className="ml-2 text-brand-muted uppercase text-[10px]">
                      Size: {item.size || "M"} &times; {item.quantity}
                    </span>
                    {item.isPreorder && (
                      <span className="ml-2 border border-brand-black bg-brand-black px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-widest text-white">
                        Pre-Order
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-medium text-brand-black">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-brand-border pt-4 flex justify-between text-sm font-semibold text-brand-black">
              <span className="uppercase tracking-widest">Total Paid</span>
              <span className="font-mono text-base">{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="mt-8 border-t border-brand-border pt-6 text-xs text-brand-muted leading-6">
              <p className="text-[10px] uppercase tracking-widest text-brand-black font-semibold">Shipping Destination</p>
              <p className="mt-1">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4 border-t border-brand-border pt-6">
            <a
              href="/shop"
              className="flex items-center gap-2 bg-brand-black px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-black/90"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/account"
              className="flex items-center gap-2 border border-brand-border px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-black transition hover:border-brand-black"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>View Account</span>
            </a>
          </div>
        </div>
      ) : verifiedState === "FAILED" ? (
        <div className="border border-brand-border bg-brand-surface p-8 sm:p-12 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
          <h1 className="mt-4 font-editorial text-4xl text-brand-black">Payment Incomplete</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-brand-muted">
            Transaction was cancelled or declined by PhonePe
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-brand-muted">
            Any reserved stock or preorder allocation has been safely returned. You can return to your bag and retry payment.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/cart"
              className="bg-brand-black px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-black/90"
            >
              Return to Cart
            </a>
          </div>
        </div>
      ) : (
        <div className="border border-brand-border bg-brand-surface p-8 sm:p-12 text-center">
          <Clock className="mx-auto h-10 w-10 text-amber-600" />
          <h1 className="mt-4 font-editorial text-3xl sm:text-4xl text-brand-black">Payment Pending</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-brand-muted">
            Waiting for final settlement from your bank
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-brand-muted">
            Your order reference is <strong className="text-brand-black">{order?.orderNumber}</strong>. If your account was debited, your order will be automatically confirmed via webhook.
          </p>
          <button
            type="button"
            onClick={() => void checkVerification()}
            className="mt-8 inline-flex items-center gap-2 bg-brand-black px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-brand-black/90"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Status</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between">
      <main className="px-6 pb-24 pt-36 md:px-12 md:pt-44">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl border border-brand-border bg-brand-surface p-10 text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-brand-black" />
              <p className="mt-4 text-xs uppercase tracking-widest text-brand-muted">
                Loading order verification...
              </p>
            </div>
          }
        >
          <CheckoutResultContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
