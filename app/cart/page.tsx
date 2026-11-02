"use client";

import { useCart } from "@/hooks/useCart";
import { BackButton } from "@/components/navigation/BackButton";
import { Footer } from "@/components/Footer";

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
      <div className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between">
        <main className="px-6 pb-24 pt-36 md:px-12">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-muted" aria-live="polite">
            Loading cart...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const hasPreorders = items.some((i) => i.isPreorder);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black flex flex-col justify-between">
      <main className="px-6 pb-24 pt-36 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 border-b border-brand-border pb-5 sm:mb-12">
            <div className="mb-4 flex items-center justify-between">
              <BackButton fallbackHref="/shop" label="Continue shopping" variant="default" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">WASTE. / Cart</p>
            </div>
            <h1 className="mt-4 font-editorial text-[clamp(3.5rem,14vw,6rem)] leading-none tracking-[-0.06em] text-brand-black md:text-8xl">Your cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="border-t border-brand-border py-20">
              <p className="text-lg text-brand-muted">Your cart is empty.</p>
              <a href="/shop" className="mt-8 inline-block border-b border-brand-black pb-2 text-xs uppercase tracking-[0.2em] text-brand-black transition-opacity hover:opacity-60">
                Continue shopping
              </a>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
              <ul className="divide-y divide-brand-border border-y border-brand-border">
                {items.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="flex gap-3 py-5 sm:gap-8 sm:py-6">
                    <img src={item.image} alt={item.title} className="aspect-[3/4] h-auto w-24 shrink-0 border border-brand-border bg-brand-surfaceSubtle object-cover sm:w-36" />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-sm uppercase leading-5 tracking-[0.08em] text-brand-black">{item.title}</h2>
                            {item.isPreorder && (
                              <span className="inline-block border border-brand-black bg-brand-black px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white">
                                Pre-Order
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brand-muted">Size: {item.size}</p>
                          {item.expectedShipmentText && (
                            <p className="mt-1 text-[10px] uppercase tracking-wider text-amber-700">
                              {item.expectedShipmentText}
                            </p>
                          )}
                        </div>
                        <p className="whitespace-nowrap text-xs font-medium text-brand-black sm:text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-brand-border bg-brand-surface" aria-label={`Quantity for ${item.title}`}>
                          <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="min-h-11 min-w-11 px-3 py-2 text-sm text-brand-black transition-colors hover:bg-brand-surfaceSubtle" aria-label={`Decrease quantity of ${item.title}`}>−</button>
                          <span className="min-w-8 text-center text-sm font-medium text-brand-black" aria-live="polite">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="min-h-11 min-w-11 px-3 py-2 text-sm text-brand-black transition-colors hover:bg-brand-surfaceSubtle" aria-label={`Increase quantity of ${item.title}`}>+</button>
                        </div>
                        <button type="button" onClick={() => removeItem(item.id, item.size)} className="text-xs uppercase tracking-[0.15em] text-brand-muted underline transition-colors hover:text-brand-black">Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="sticky bottom-0 z-10 -mx-6 border-t border-brand-border bg-brand-bg/95 px-6 pb-2 pt-5 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:pb-0 md:backdrop-blur-none">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.15em] text-brand-black">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.15em] text-brand-muted">
                  <span>Shipping</span>
                  <span>Complimentary</span>
                </div>
                {hasPreorders && (
                  <p className="mt-4 border-l-2 border-brand-black pl-3 text-[11px] leading-5 text-brand-muted">
                    Your bag contains pre-ordered merchandise. Production capacity is reserved upon payment confirmation.
                  </p>
                )}
                {error && <p className="mt-5 text-sm text-red-600" role="alert">{error}</p>}
                <a
                  href="/checkout"
                  className="mt-8 block w-full bg-brand-black py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-black/90 active:scale-[0.99]"
                >
                  Proceed to Checkout
                </a>
                <p className="mt-4 text-[11px] leading-5 text-brand-muted text-center">
                  Encrypted PhonePe Standard Checkout &bull; UPI &bull; Cards
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
