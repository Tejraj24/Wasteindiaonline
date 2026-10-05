"use client";

import { useCart } from "@/hooks/useCart";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartPage() {
  const {
    items,
    subtotal,
    error,
    hasHydrated,
    removeItem,
    updateQuantity,
  } = useCart();

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white md:px-12">
        <p className="text-xs uppercase tracking-[0.25em] text-white/50" aria-live="polite">
          Loading cart...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 border-b border-white/15 pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">WASTE. / Cart</p>
          <h1 className="mt-4 font-editorial text-6xl tracking-[-0.06em] md:text-8xl">Your cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="border-t border-white/15 py-20">
            <p className="text-lg text-white/60">Your cart is empty.</p>
            <a href="/shop" className="mt-8 inline-block border-b border-white pb-2 text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-60">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
            <ul className="divide-y divide-white/15 border-y border-white/15">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-5 py-6 sm:gap-8">
                  <img src={item.image} alt={item.title} className="h-36 w-28 shrink-0 object-cover sm:h-48 sm:w-36" />
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-sm uppercase leading-5 tracking-[0.08em]">{item.title}</h2>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">Size: {item.size}</p>
                      </div>
                      <p className="whitespace-nowrap text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-white/20" aria-label={`Quantity for ${item.title}`}>
                        <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-3 py-2 text-sm transition-colors hover:bg-white/10" aria-label={`Decrease quantity of ${item.title}`}>−</button>
                        <span className="min-w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-3 py-2 text-sm transition-colors hover:bg-white/10" aria-label={`Increase quantity of ${item.title}`}>+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id, item.size)} className="text-xs uppercase tracking-[0.15em] text-white/55 underline transition-colors hover:text-white">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border-t border-white/15 pt-5">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.15em]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {error && <p className="mt-5 text-sm text-red-400" role="alert">{error}</p>}
              <button type="button" disabled className="mt-8 w-full cursor-not-allowed bg-white/15 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40" title="Checkout is not configured yet">
                Checkout unavailable
              </button>
              <p className="mt-4 text-xs leading-5 text-white/40">Checkout will be available once payment processing is connected.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
