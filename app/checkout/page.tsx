"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/components/auth/AuthProvider";
import { BackButton } from "@/components/navigation/BackButton";
import { Footer } from "@/components/Footer";
import { listAddresses, getUserProfile } from "@/lib/firebase/account";
import { Loader2, ShieldCheck, ArrowRight, AlertCircle, Info } from "lucide-react";

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, hasHydrated } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.displayName || "",
      email: prev.email || user.email || "",
    }));

    void Promise.all([getUserProfile(user.uid), listAddresses(user.uid)]).then(
      ([profile, addresses]) => {
        if (profile) {
          setForm((prev) => ({
            ...prev,
            name: prev.name || profile.name || "",
            phone: prev.phone || profile.phone || "",
          }));
        }
        if (addresses && addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
          setForm((prev) => ({
            ...prev,
            name: prev.name || defaultAddr.fullName,
            phone: prev.phone || defaultAddr.phone,
            addressLine1: prev.addressLine1 || defaultAddr.addressLine1,
            addressLine2: prev.addressLine2 || defaultAddr.addressLine2 || "",
            city: prev.city || defaultAddr.city,
            state: prev.state || defaultAddr.state,
            pincode: prev.pincode || defaultAddr.pincode,
          }));
        }
      }
    );
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your shopping bag is empty.");
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setErrorMessage("Please complete all required contact fields.");
      return;
    }

    if (!form.addressLine1.trim() || !form.city.trim() || !form.state.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      setErrorMessage("Please provide a valid street address, city, state, and 6-digit pincode.");
      return;
    }

    setLoading(true);

    try {
      let authToken: string | undefined;
      if (user) {
        try {
          authToken = await user.getIdToken();
        } catch {
          // continue as guest
        }
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.id,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to submit your preorder. Please try again.");
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else if (data.orderNumber) {
        router.push(`/checkout/result?orderNumber=${encodeURIComponent(data.orderNumber)}`);
      } else {
        throw new Error("Preorder confirmation reference was not returned.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error placing preorder. Please try again.";
      setErrorMessage(msg);
      setLoading(false);
    }
  }

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between">
        <main className="px-6 pb-24 pt-36 md:px-12">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-muted">
            Preparing preorder checkout...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between">
        <main className="px-6 pb-24 pt-36 md:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-editorial text-5xl text-brand-black">Your bag is empty</h1>
            <p className="mt-4 text-sm text-brand-muted">Select pieces before proceeding to preorder.</p>
            <a href="/shop" className="mt-8 inline-block border-b border-brand-black pb-1 text-xs uppercase tracking-widest text-brand-black">
              Return to Collection
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between">
      <main className="px-6 pb-24 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-between border-b border-brand-border pb-5">
            <BackButton fallbackHref="/cart" label="Back to Bag" variant="default" />
            <div className="flex items-center gap-3">
              <span className="bg-brand-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                PREORDER
              </span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">WASTE. / Preorder Checkout</p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left: Customer Information & Delivery Form */}
            <div>
              <h1 className="font-editorial text-4xl leading-none tracking-[-0.04em] text-brand-black sm:text-5xl">
                Shipping &amp; Contact
              </h1>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-brand-muted">
                Complimentary carbon-neutral domestic delivery across India
              </p>

              {/* Clear Preorder Notice Banner */}
              <div className="mt-6 border-l-2 border-brand-black bg-brand-surfaceSubtle p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-brand-black" />
                  <span className="text-xs uppercase tracking-wider text-brand-black font-semibold">
                    PREORDER ALLOCATION
                  </span>
                </div>
                <p className="mt-2 text-xs text-brand-muted leading-relaxed">
                  PREORDER — No payment is required at this stage. Our team will contact you with the next steps.
                </p>
              </div>

              {errorMessage && (
                <div className="mt-6 flex items-start gap-3 border border-red-300 bg-red-50 p-4 text-xs text-red-700" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <h2 className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">Contact Information</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">Full name *</label>
                      <input
                        required
                        disabled={loading}
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Suryansh Meena"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">Email address *</label>
                      <input
                        required
                        disabled={loading}
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="client@wasteindia.in"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">Phone number (for delivery SMS &amp; tracking) *</label>
                      <input
                        required
                        disabled={loading}
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">Delivery Address</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">Address line 1 *</label>
                      <input
                        required
                        disabled={loading}
                        type="text"
                        value={form.addressLine1}
                        onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                        placeholder="Apartment, suite, street address"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">Address line 2 (optional)</label>
                      <input
                        disabled={loading}
                        type="text"
                        value={form.addressLine2}
                        onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                        placeholder="Landmark, building name"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">City *</label>
                      <input
                        required
                        disabled={loading}
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="New Delhi"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">State *</label>
                      <input
                        required
                        disabled={loading}
                        type="text"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        placeholder="Delhi"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">PIN Code *</label>
                      <input
                        required
                        disabled={loading}
                        type="text"
                        maxLength={6}
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        placeholder="110001"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-muted/40 focus:border-brand-black disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-brand-muted">Country</label>
                      <input
                        disabled
                        type="text"
                        value="India"
                        className="mt-1 w-full border-b border-brand-border bg-transparent py-2.5 text-sm text-brand-muted outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 bg-brand-black py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-black/90 active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Placing Preorder...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Preorder</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-brand-muted">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>No Payment Required Today &bull; Direct Studio Registration &bull; Complimentary Delivery</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Order Summary Sidebar */}
            <aside className="border border-brand-border bg-brand-surface p-6 sm:p-8 self-start">
              <h2 className="text-xs uppercase tracking-[0.25em] text-brand-black font-semibold">
                Preorder Summary ({items.length})
              </h2>

              <ul className="mt-6 divide-y divide-brand-border">
                {items.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="flex gap-4 py-4 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="aspect-[3/4] h-20 w-16 border border-brand-border bg-brand-surfaceSubtle object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-black">
                            {item.title}
                          </h3>
                          <span className="text-xs font-mono font-medium text-brand-black">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-brand-muted">
                          Size: {item.size} &bull; Qty: {item.quantity}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="bg-brand-black px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white">
                            Pre-Order
                          </span>
                          {item.expectedShipmentText && (
                            <span className="text-[9px] uppercase tracking-wider text-amber-700">
                              {item.expectedShipmentText}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-brand-border pt-4 space-y-2 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-brand-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Domestic Delivery</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Estimated Taxes</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-brand-border pt-4 flex justify-between text-sm font-semibold text-brand-black tracking-widest">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 border-l-2 border-brand-black bg-brand-surfaceSubtle p-4 text-[10px] leading-5 text-brand-muted">
                <p className="font-semibold uppercase tracking-wider text-brand-black">Preorder Allocation</p>
                <p className="mt-1">
                  No payment is collected today. Your pieces are registered directly with our Jaipur studio. Our concierge team will reach out with production timeline and delivery coordination.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
