import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseDb } from "./client";

export type WishlistItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category?: string;
  createdAt?: unknown;
};

function requireDb() {
  if (!firebaseDb) {
    throw new Error("Firestore is not configured. Add the Firebase environment variables.");
  }
  return firebaseDb;
}

function wishlistCollection(uid: string) {
  return collection(requireDb(), "users", uid, "wishlist");
}

export async function listWishlistItems(uid: string) {
  const snapshot = await getDocs(wishlistCollection(uid));
  return snapshot.docs.map((item) => item.data() as WishlistItem);
}

export async function saveWishlistItem(uid: string, item: WishlistItem) {
  await setDoc(doc(wishlistCollection(uid), item.productId), {
    ...item,
    createdAt: serverTimestamp(),
  });
}

export async function removeWishlistItem(uid: string, productId: string) {
  await deleteDoc(doc(wishlistCollection(uid), productId));
}
