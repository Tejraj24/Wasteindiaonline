import { firebaseAuth } from "./client";

export type WishlistItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category?: string;
  createdAt?: unknown;
};

/**
 * Retrieves the current Firebase user ID token for secure API authorization.
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const currentUser = firebaseAuth?.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in to access the wishlist.");
  }

  const token = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Fetches the authenticated user's wishlist from PostgreSQL via the Prisma API.
 */
export async function listWishlistItems(_uid?: string): Promise<WishlistItem[]> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/wishlist", {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "We could not load your wishlist.");
  }

  return response.json();
}

/**
 * Saves a product snapshot to the user's wishlist in PostgreSQL.
 */
export async function saveWishlistItem(_uid: string, item: WishlistItem): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/wishlist", {
    method: "POST",
    headers,
    body: JSON.stringify({ item }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "We could not save this item to your wishlist.");
  }
}

/**
 * Removes a product from the user's wishlist in PostgreSQL.
 */
export async function removeWishlistItem(_uid: string, productId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/wishlist", {
    method: "DELETE",
    headers,
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "We could not remove this item from your wishlist.");
  }
}
