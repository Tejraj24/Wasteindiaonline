"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

type ProductPurchasePanelProps = {
  product: {
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
    sku: string;
    soldOut: boolean;
  };
};

const sizes = ["S", "M", "L", "XL"];

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState("M");

  return (
    <div className="mt-10 border-t border-white/15 pt-7">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em]">
        <span>Size</span>
        <span className="text-white/40">Select one</span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            className={`min-h-11 border py-3 text-xs transition ${
              size === option
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/65 hover:border-white/70"
            }`}
            aria-pressed={size === option}
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
          })
        }
        disabled={product.soldOut}
        className="mt-4 w-full bg-white py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-brand-blue hover:text-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
      >
        {product.soldOut ? "Sold out" : "Add to cart"}
      </button>
    </div>
  );
}
