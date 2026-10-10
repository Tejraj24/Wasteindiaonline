import { create } from "zustand";
import { firebaseAuth } from "@/lib/firebase/client";

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
  currentUserId: string | null;
  setHasHydrated: () => void;
  setCurrentUserId: (uid: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  subtotal: () => number;
  itemCount: () => number;
}

const MAX_STOCK_PER_ITEM = 5;
export const GUEST_CART_KEY = "studio-cart-guest";

export function getCartStorageKey(uid?: string | null): string {
  return uid ? `studio-cart-${uid}` : GUEST_CART_KEY;
}

export function loadStoredCartItems(storageKey: string): CartItem[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.items || [];
  } catch {
    return [];
  }
}

export function saveStoredCartItems(storageKey: string, items: CartItem[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ items }));
  } catch {
    // safe fallback
  }
}

async function syncWithServer(items: CartItem[]) {
  try {
    const user = firebaseAuth?.currentUser;
    if (!user) return;
    const token = await user.getIdToken();
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.id,
          title: i.title,
          price: i.price,
          compareAtPrice: i.compareAtPrice,
          image: i.image,
          size: i.size,
          sku: i.sku,
          quantity: i.quantity,
        })),
      }),
    });
  } catch {
    // safe fallback
  }
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,
  error: null,
  hasHydrated: false,
  currentUserId: null,
  setHasHydrated: () => set({ hasHydrated: true }),
  setCurrentUserId: (uid) => set({ currentUserId: uid }),
  openCart: () => set({ isOpen: true, error: null }),
  closeCart: () => set({ isOpen: false, error: null }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen, error: null })),
  setItems: (items) => {
    set({ items, error: null });
    const key = getCartStorageKey(get().currentUserId);
    saveStoredCartItems(key, items);
  },
  addItem: (newItem, quantity = 1) => {
    if (quantity <= 0 || quantity > MAX_STOCK_PER_ITEM) {
      set({
        isOpen: true,
        error: "Product is not available in this quantity",
      });
      return;
    }
    const state = get();
    const existingIndex = state.items.findIndex(
      (i) => i.id === newItem.id && i.size === newItem.size
    );
    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      const currentQty = state.items[existingIndex].quantity;
      if (currentQty + quantity > MAX_STOCK_PER_ITEM) {
        set({
          isOpen: true,
          error: "Product is not available in this quantity",
        });
        return;
      }
      updatedItems = [...state.items];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [...state.items, { ...newItem, quantity }];
    }

    set({ items: updatedItems, isOpen: true, error: null });
    const key = getCartStorageKey(state.currentUserId);
    saveStoredCartItems(key, updatedItems);
    if (state.currentUserId) {
      void syncWithServer(updatedItems);
    }
  },
  removeItem: (id, size) => {
    const state = get();
    const updated = state.items.filter((i) => !(i.id === id && i.size === size));
    set({ items: updated, error: null });
    const key = getCartStorageKey(state.currentUserId);
    saveStoredCartItems(key, updated);
    if (state.currentUserId) {
      void syncWithServer(updated);
    }
  },
  updateQuantity: (id, size, quantity) => {
    const state = get();
    if (quantity <= 0) {
      state.removeItem(id, size);
      return;
    }
    if (quantity > MAX_STOCK_PER_ITEM) {
      set({ error: "Product is not available in this quantity" });
      return;
    }
    const updated = state.items.map((i) =>
      i.id === id && i.size === size ? { ...i, quantity } : i
    );
    set({ items: updated, error: null });
    const key = getCartStorageKey(state.currentUserId);
    saveStoredCartItems(key, updated);
    if (state.currentUserId) {
      void syncWithServer(updated);
    }
  },
  clearCart: () => {
    const state = get();
    set({ items: [], error: null });
    const key = getCartStorageKey(state.currentUserId);
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // safe fallback
      }
    }
    if (state.currentUserId) {
      void syncWithServer([]);
    }
  },
  subtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  itemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));

/**
 * Handles user authentication transition:
 * - When logging in: merges guest cart into user-scoped cart, syncs with database.
 * - When logging out: resets active session to guest cart.
 */
export async function syncCartWithUser(nextUserUid: string | null) {
  if (typeof window === "undefined") return;

  if (nextUserUid) {
    // 1. User logged in
    const guestItems = loadStoredCartItems(GUEST_CART_KEY);
    const userStorageKey = getCartStorageKey(nextUserUid);
    const userLocalItems = loadStoredCartItems(userStorageKey);

    // Merge guest items into user items
    const mergedMap = new Map<string, CartItem>();
    for (const item of userLocalItems) {
      mergedMap.set(`${item.id}-${item.size}`, { ...item });
    }
    for (const gItem of guestItems) {
      const key = `${gItem.id}-${gItem.size}`;
      const existing = mergedMap.get(key);
      if (existing) {
        existing.quantity = Math.min(MAX_STOCK_PER_ITEM, existing.quantity + gItem.quantity);
      } else {
        mergedMap.set(key, { ...gItem });
      }
    }

    const mergedItems = Array.from(mergedMap.values());

    // Clear guest cart once merged
    try {
      window.localStorage.removeItem(GUEST_CART_KEY);
    } catch {
      // safe fallback
    }

    saveStoredCartItems(userStorageKey, mergedItems);
    useCartStore.setState({
      items: mergedItems,
      currentUserId: nextUserUid,
      hasHydrated: true,
      error: null,
    });

    // Try fetching remote cart from PostgreSQL to combine or sync
    try {
      const user = firebaseAuth?.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const remoteItems: CartItem[] = (data.items || []).map((ri: {
            productId: string;
            title: string;
            price: number;
            compareAtPrice: number | null;
            image: string;
            quantity: number;
            size: string;
            sku: string;
          }) => ({
            id: ri.productId,
            title: ri.title,
            price: ri.price,
            compareAtPrice: ri.compareAtPrice,
            image: ri.image,
            quantity: ri.quantity,
            size: ri.size || "M",
            sku: ri.sku || "",
          }));

          if (remoteItems.length > 0 && mergedItems.length === 0) {
            saveStoredCartItems(userStorageKey, remoteItems);
            useCartStore.setState({ items: remoteItems });
          } else {
            // Push merged local to server
            void syncWithServer(mergedItems);
          }
        }
      }
    } catch {
      // safe fallback
    }
  } else {
    // 2. User logged out -> Switch back to guest cart
    const guestItems = loadStoredCartItems(GUEST_CART_KEY);
    useCartStore.setState({
      items: guestItems,
      currentUserId: null,
      hasHydrated: true,
      error: null,
    });
  }
}

/**
 * Initializes cart on initial page load
 */
export function initializeCartStore() {
  if (typeof window === "undefined") return;
  const initialItems = loadStoredCartItems(GUEST_CART_KEY);
  useCartStore.setState({
    items: initialItems,
    hasHydrated: true,
    currentUserId: null,
  });
}

export function resetCartStorage() {
  const currentUid = useCartStore.getState().currentUserId;
  const key = getCartStorageKey(currentUid);
  useCartStore.setState({ items: [], error: null });
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
      window.localStorage.removeItem(GUEST_CART_KEY);
      window.localStorage.removeItem("studio-cart-storage");
    } catch {
      // safe fallback
    }
  }
}
