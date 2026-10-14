"use client";

import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    itemCount,
    subtotal,
    error,
    hasHydrated,
    removeItem,
    updateQuantity,
  } = useCart();

  // Prevent body scrolling while the cart drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCart, isOpen]);

  return (
    <>
      {/* Backdrop with fade-in and backdrop blur */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
        aria-hidden="true"
      />

      {/* Cart Drawer sliding in from right */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="cart-drawer-title"
        className={`fixed bottom-0 right-0 z-[101] flex h-[min(88vh,720px)] w-full max-w-md flex-col rounded-t-2xl border-l border-brand-border bg-brand-surface text-brand-black shadow-2xl transition-transform duration-300 ease-out md:top-0 md:h-full md:rounded-none ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4 sm:p-6">
          <h2 id="cart-drawer-title" className="text-xl font-bold uppercase tracking-tight text-brand-black">
            Your Cart ({hasHydrated ? itemCount : 0})
          </h2>
          <button type="button" onClick={closeCart} className="body-upper flex min-h-11 items-center px-2 text-brand-muted transition-opacity hover:text-brand-black">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6" data-lenis-prevent>
          {!hasHydrated ? (
            <div className="flex h-full items-center justify-center text-brand-muted" aria-live="polite">
              Loading cart...
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-brand-muted">
              <p className="text-lg">Your cart is empty.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-4 border-b border-brand-border pb-1 text-brand-black transition-colors hover:border-brand-black"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm border border-brand-border bg-brand-surfaceSubtle">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="break-words font-bold uppercase leading-tight text-brand-black">{item.title}</h3>
                      <p className="mt-1 text-sm text-brand-muted">{formatPrice(item.price)}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-brand-muted">Size: {item.size}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-brand-border bg-brand-surface" aria-label={`Quantity for ${item.title}`}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="min-h-11 min-w-11 px-2 py-1 text-brand-black transition-colors hover:bg-brand-surfaceSubtle"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          −
                        </button>
                        <span className="min-w-7 text-center text-sm text-brand-black" aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="min-h-11 min-w-11 px-2 py-1 text-brand-black transition-colors hover:bg-brand-surfaceSubtle"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-xs uppercase underline text-brand-muted transition-colors hover:text-brand-black"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-2 text-right text-sm font-semibold text-brand-black">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && (
            <p className="mt-6 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>

        {hasHydrated && items.length > 0 && (
          <div className="sticky bottom-0 border-t border-brand-border bg-brand-surface p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-lg font-bold text-brand-black">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <a
              href="/cart"
              onClick={closeCart}
              className="block w-full bg-brand-black py-4 text-center font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-black/90"
            >
              View cart
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
