"use client";

import {
  GUEST_CART_KEY,
  getCartStorageKey,
  resetCartStorage,
  syncCartWithUser,
  useCartStore,
} from "@/lib/store";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const error = useCartStore((state) => state.error);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const currentUserId = useCartStore((state) => state.currentUserId);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const setItems = useCartStore((state) => state.setItems);
  const subtotal = useCartStore((state) => state.subtotal);
  const itemCount = useCartStore((state) => state.itemCount);

  return {
    items,
    isOpen,
    error,
    hasHydrated,
    currentUserId,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setItems,
    resetCartStorage,
    subtotal: subtotal(),
    itemCount: itemCount(),
  };
}

export { resetCartStorage, syncCartWithUser, getCartStorageKey, GUEST_CART_KEY };
