"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  listWishlistItems,
  removeWishlistItem,
  saveWishlistItem,
  WishlistItem,
} from "@/lib/firebase/wishlist";

type WishlistContextValue = {
  items: WishlistItem[];
  loading: boolean;
  error: string;
  notice: string;
  toggle: (item: WishlistItem) => Promise<boolean>;
  remove: (productId: string, notice?: string) => Promise<void>;
  isSaved: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    if (authLoading) return;
    if (!user) {
      setItems([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    listWishlistItems(user.uid)
      .then((loaded) => {
        if (active) setItems(loaded);
      })
      .catch(() => {
        if (active) setError("We could not load your wishlist.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  async function toggle(item: WishlistItem) {
    if (!user) return false;
    const saved = items.some((current) => current.productId === item.productId);
    setError("");
    if (saved) {
      await removeWishlistItem(user.uid, item.productId);
      setItems((current) => current.filter((currentItem) => currentItem.productId !== item.productId));
      showNotice("Removed from Wishlist");
      return false;
    }

    await saveWishlistItem(user.uid, item);
    setItems((current) => [...current, item]);
    showNotice("Added to Wishlist");
    return true;
  }

  async function remove(productId: string, notice = "Removed from Wishlist") {
    if (!user) return;
    setError("");
    await removeWishlistItem(user.uid, productId);
    setItems((current) => current.filter((item) => item.productId !== productId));
    showNotice(notice);
  }

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      loading,
      error,
      notice,
      toggle,
      remove,
      isSaved: (productId) => items.some((item) => item.productId === productId),
    }),
    [error, items, loading, notice]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      {notice && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[180] -translate-x-1/2 border border-white/15 bg-black/95 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white shadow-2xl">
          {notice}
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
