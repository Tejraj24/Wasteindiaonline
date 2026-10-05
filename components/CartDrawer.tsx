"use client";

import { useCart } from "@/hooks/useCart";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerRef.current || !backdropRef.current) return;

    if (isOpen) {
      gsap.to(backdropRef.current, { autoAlpha: 1, duration: 0.3 });
      gsap.to(drawerRef.current, {
        xPercent: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(backdropRef.current, { autoAlpha: 0, duration: 0.3 });
      gsap.to(drawerRef.current, {
        xPercent: 100,
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

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
      <div
        ref={backdropRef}
        onClick={closeCart}
        className="fixed inset-0 z-[100] invisible bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed bottom-0 right-0 z-[101] flex h-[min(88vh,720px)] w-full max-w-md translate-x-full flex-col rounded-t-2xl bg-brand-light text-brand-dark shadow-2xl md:top-0 md:h-full md:rounded-none"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:p-6">
          <h2 id="cart-drawer-title" className="text-xl font-bold uppercase tracking-tight">
            Your Cart ({hasHydrated ? itemCount : 0})
          </h2>
          <button type="button" onClick={closeCart} className="body-upper flex min-h-11 items-center px-2 transition-opacity hover:opacity-70">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6" data-lenis-prevent>
          {!hasHydrated ? (
            <div className="flex h-full items-center justify-center text-brand-faded" aria-live="polite">
              Loading cart...
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-brand-faded">
              <p className="text-lg">Your cart is empty.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-4 border-b border-current pb-1 transition-colors hover:text-brand-dark"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-brand-grey">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="break-words font-bold uppercase leading-tight">{item.title}</h3>
                      <p className="mt-1 text-sm text-brand-faded">{formatPrice(item.price)}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-brand-faded">Size: {item.size}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-black/15" aria-label={`Quantity for ${item.title}`}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="min-h-11 min-w-11 px-2 py-1 transition-colors hover:bg-black/5"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          −
                        </button>
                        <span className="min-w-7 text-center text-sm" aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="min-h-11 min-w-11 px-2 py-1 transition-colors hover:bg-black/5"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-xs uppercase underline transition-colors hover:text-brand-blue"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-2 text-right text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
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
          <div className="sticky bottom-0 border-t border-black/10 bg-brand-light p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <a
              href="/cart"
              onClick={closeCart}
              className="block w-full bg-brand-blue py-4 text-center font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-dark"
            >
              View cart
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
