import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "./client";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  isDefault: boolean;
};

function requireDb() {
  if (!firebaseDb) {
    throw new Error("Firestore is not configured. Add the Firebase environment variables.");
  }
  return firebaseDb;
}

export async function ensureUserProfile(uid: string, email: string, name: string) {
  const profileRef = doc(requireDb(), "users", uid);
  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    await setDoc(profileRef, {
      uid,
      name,
      email,
      phone: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  const snapshot = await getDoc(profileRef);
  return snapshot.data() as UserProfile;
}

export async function getUserProfile(uid: string) {
  const snapshot = await getDoc(doc(requireDb(), "users", uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, updates: Pick<UserProfile, "name" | "phone">) {
  await setDoc(
    doc(requireDb(), "users", uid),
    { ...updates, uid, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

function addressCollection(uid: string) {
  return collection(requireDb(), "addresses", uid, "items");
}

export async function listAddresses(uid: string) {
  const snapshot = await getDocs(query(addressCollection(uid), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Address));
}

export async function createAddress(uid: string, address: Omit<Address, "id">) {
  const existing = await listAddresses(uid);
  const shouldDefault = address.isDefault || existing.length === 0;
  if (shouldDefault) {
    await Promise.all(existing.map((item) => updateDoc(doc(addressCollection(uid), item.id), { isDefault: false })));
  }
  const result = await addDoc(addressCollection(uid), {
    ...address,
    isDefault: shouldDefault,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return result.id;
}

export async function updateAddress(uid: string, id: string, address: Omit<Address, "id">) {
  if (address.isDefault) {
    const existing = await listAddresses(uid);
    await Promise.all(existing.filter((item) => item.id !== id).map((item) => updateDoc(doc(addressCollection(uid), item.id), { isDefault: false })));
  }
  await updateDoc(doc(addressCollection(uid), id), { ...address, updatedAt: serverTimestamp() });
}

export async function deleteAddress(uid: string, id: string) {
  await deleteDoc(doc(addressCollection(uid), id));
}
