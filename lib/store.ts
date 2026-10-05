import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  quantity: number;
  size: string;
  sku: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

const MAX_STOCK_PER_ITEM = 5;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),
      openCart: () => set({ isOpen: true, error: null }),
      closeCart: () => set({ isOpen: false, error: null }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen, error: null })),
      addItem: (newItem, quantity = 1) => {
        if (quantity <= 0 || quantity > MAX_STOCK_PER_ITEM) {
          set({
            isOpen: true,
            error: "Product is not available in this quantity",
          });
          return;
        }
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === newItem.id && i.size === newItem.size
          );
          if (existingIndex > -1) {
            const currentQty = state.items[existingIndex].quantity;
            if (currentQty + quantity > MAX_STOCK_PER_ITEM) {
              return {
                isOpen: true,
                error: "Product is not available in this quantity",
              };
            }
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isOpen: true, error: null };
          } else {
            return {
              items: [...state.items, { ...newItem, quantity }],
              isOpen: true,
              error: null,
            };
          }
        });
      },
      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
          error: null,
        }));
      },
      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        if (quantity > MAX_STOCK_PER_ITEM) {
          set({ error: "Product is not available in this quantity" });
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          ),
          error: null,
        }));
      },
      clearCart: () => set({ items: [], error: null }),
      subtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "studio-cart-storage",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
