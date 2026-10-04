"use client";

import { useCart } from "@/hooks/useCart";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CartDrawer() {
  const { isOpen, closeCart, items, itemCount, subtotal, removeItem } = useCart();
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

  return (
    <>
      <div
        ref={backdropRef}
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] invisible"
      />
      
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-light text-brand-dark z-[101] shadow-2xl translate-x-full flex flex-col"
      >
        <div className="p-6 border-b border-black/10 flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-tight">Your Cart ({itemCount})</h2>
          <button onClick={closeCart} className="body-upper hover:opacity-70 transition-opacity">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-faded">
              <p className="text-lg">Your cart is empty.</p>
              <button 
                onClick={closeCart}
                className="mt-4 border-b border-current pb-1 hover:text-brand-dark transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-24 h-32 bg-brand-grey relative overflow-hidden">
                    {/* Placeholder image */}
                    <div className="absolute inset-0 bg-neutral-200" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold uppercase leading-tight">{item.title}</h3>
                      <p className="text-brand-faded text-sm mt-1">${item.price}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <button 
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-xs uppercase underline hover:text-brand-blue"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-black/10 bg-brand-light">
            <div className="flex justify-between items-center mb-4 font-bold text-lg">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-brand-blue text-white py-4 font-bold uppercase tracking-wider hover:bg-brand-dark transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
