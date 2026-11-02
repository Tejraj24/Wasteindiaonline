"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { WishlistButton } from "@/components/WishlistButton";

type ProductPurchasePanelProps = {
  product: {
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
    sku: string;
    category: string;
    soldOut: boolean;
    isPreorder?: boolean;
    expectedShipmentText?: string | null;
    releaseDate?: Date | string | null;
  };
};

const sizes = ["S", "M", "L", "XL"];

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState("M");

  const formattedRelease = product.releaseDate
    ? new Date(product.releaseDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const shipmentNotice =
    product.expectedShipmentText || (formattedRelease ? `Arrives ${formattedRelease}` : null);

  return (
    <div className="mt-8 border-t border-brand-border pt-6 sm:mt-10 sm:pt-7">
      {product.isPreorder && (
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <span className="inline-block border border-brand-black bg-brand-black px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Pre-Order
          </span>
          {shipmentNotice && (
            <span className="text-xs sm:text-[13px] uppercase tracking-[0.14em] text-amber-700 font-medium">
              {shipmentNotice}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs sm:text-[13px] uppercase tracking-[0.16em] text-brand-black">
        <span>
          Size: <strong className="font-semibold text-brand-black">{size}</strong>
        </span>
        <span className="text-brand-muted">Relaxed fit</span>
      </div>
      <div className="mt-3.5 grid grid-cols-4 gap-2">
        {sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            className={`min-h-11 border py-3 text-xs sm:text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 ${
              size === option
                ? "border-brand-black bg-brand-black text-white shadow-sm"
                : "border-brand-border bg-brand-surface text-brand-black hover:border-brand-black hover:bg-brand-surfaceSubtle"
            }`}
            aria-pressed={size === option}
            aria-label={`Select size ${option}`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: product.image,
            size,
            sku: product.sku,
            isPreorder: product.isPreorder,
            expectedShipmentText: shipmentNotice,
            releaseDate: product.releaseDate ? String(product.releaseDate) : null,
          })
        }
        disabled={product.soldOut}
        className="mt-4 w-full bg-brand-black py-4 text-[13px] sm:text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-black/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:border disabled:border-brand-border disabled:bg-brand-surfaceSubtle disabled:text-brand-muted"
      >
        {product.soldOut
          ? product.isPreorder
            ? "Pre-order capacity reached"
            : "Sold out"
          : product.isPreorder
          ? `Pre-Order Now — ${size}`
          : `Add to cart — ${size}`}
      </button>
      <div className="mt-3">
        <WishlistButton
          compact
          item={{
            productId: product.id,
            name: product.title,
            slug: product.id,
            image: product.image,
            price: product.price,
            category: product.category,
          }}
        />
      </div>
    </div>
  );
}
