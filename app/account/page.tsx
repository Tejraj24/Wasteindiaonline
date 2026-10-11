"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuth } from "@/components/auth/AuthProvider";
import { Address, createAddress, deleteAddress, getUserProfile, listAddresses, updateAddress, updateUserProfile, UserProfile } from "@/lib/firebase/account";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/components/WishlistProvider";
import { BackButton } from "@/components/navigation/BackButton";

const accountSections = ["Profile", "Wishlist", "Orders", "Addresses", "Settings"] as const;
type AccountSection = (typeof accountSections)[number];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function AccountContent() {
  const router = useRouter();
  const { user, isAdmin, loading, logout, resendVerification, refreshVerification } = useAuth();
  const { items: wishlistItems, loading: wishlistLoading, error: wishlistError, remove: removeWishlistItem } = useWishlist();
  const { addItem } = useCart();
  const [activeSection, setActiveSection] = useState<AccountSection>("Profile");

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, user, isAdmin, router]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [addressForm, setAddressForm] = useState<Omit<Address, "id">>({
    fullName: "", phone: "", pincode: "", state: "", city: "", addressLine1: "", addressLine2: "", isDefault: false,
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const providerLabel = useMemo(() => {
    const providerId = user?.providerData[0]?.providerId;
    if (providerId === "google.com") return "Google";
    if (providerId === "password") return "Email";
    return providerId ? providerId.replace(".com", "") : "Firebase";
  }, [user]);

  const initials = (user?.displayName || user?.email || "W").trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!user) return;
    Promise.all([getUserProfile(user.uid), listAddresses(user.uid)])
      .then(([loadedProfile, loadedAddresses]) => {
        setProfile(loadedProfile);
        setProfileForm({ name: loadedProfile?.name ?? user.displayName ?? "", phone: loadedProfile?.phone ?? "" });
        setAddresses(loadedAddresses);
      })
      .catch(() => setError("We could not load your account details. Please try again."))
      .finally(() => setIsLoadingData(false));
  }, [user]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || profileForm.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    setIsSaving(true); setError(""); setMessage("");
    try {
      await updateUserProfile(user.uid, { name: profileForm.name.trim(), phone: profileForm.phone.trim() });
      setProfile((current) => current ? { ...current, ...profileForm } : current);
      setMessage("Profile saved.");
    } catch { setError("We could not save your profile."); } finally { setIsSaving(false); }
  }

  async function submitAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !addressForm.fullName.trim() || !/^\d{6}$/.test(addressForm.pincode)) {
      setError("Enter a full name and a valid six-digit pincode.");
      return;
    }
    setIsSaving(true); setError(""); setMessage("");
    try {
      if (editingAddressId) await updateAddress(user.uid, editingAddressId, addressForm);
      else await createAddress(user.uid, addressForm);
      setAddresses(await listAddresses(user.uid));
      resetAddressForm();
      setMessage("Address saved.");
    } catch { setError("We could not save this address."); } finally { setIsSaving(false); }
  }

  function resetAddressForm() {
    setEditingAddressId(null);
    setAddressForm({ fullName: "", phone: "", pincode: "", state: "", city: "", addressLine1: "", addressLine2: "", isDefault: false });
  }

  async function removeAddress(id: string) {
    if (!user) return;
    setIsSaving(true); setError("");
    try { await deleteAddress(user.uid, id); setAddresses(await listAddresses(user.uid)); }
    catch { setError("We could not delete this address."); } finally { setIsSaving(false); }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setIsLoggingOut(false);
    }
  }

  function moveToCart(item: (typeof wishlistItems)[number]) {
    addItem({
      id: item.productId,
      title: item.name,
      price: item.price,
      compareAtPrice: null,
      image: item.image,
      size: "M",
      sku: item.productId,
    });
    void removeWishlistItem(item.productId, "Moved to Cart");
  }

  return (
    <main className="min-h-screen bg-brand-bg px-6 pb-24 pt-36 text-brand-black md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-brand-border pb-8">
          <div className="mb-4 flex items-center justify-between">
            <BackButton fallbackHref="/shop" label="Back to shop" variant="default" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">WASTE. / Private account</p>
          </div>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h1 className="font-editorial text-[clamp(4rem,12vw,8rem)] leading-[0.78] tracking-[-0.06em] text-brand-black">Your account</h1>
            <p className="max-w-xs text-xs leading-5 text-brand-muted">A considered space for your WASTE. profile and future collection activity.</p>
          </div>
        </div>

        <div className="grid gap-12 py-10 md:grid-cols-[190px_minmax(0,1fr)] md:gap-20 md:py-16">
          <nav aria-label="Account sections" className="flex gap-6 overflow-x-auto border-b border-brand-border pb-5 md:block md:space-y-5 md:border-b-0 md:pb-0">
            {accountSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`shrink-0 text-left text-[10px] uppercase tracking-[0.2em] transition ${
                  activeSection === section ? "font-medium text-brand-black" : "text-brand-muted hover:text-brand-black"
                }`}
                aria-current={activeSection === section ? "page" : undefined}
              >
                <span className={activeSection === section ? "mr-2 inline-block h-px w-5 bg-brand-gold align-middle" : "mr-7 inline-block w-0"} />
                {section}
              </button>
            ))}
          </nav>

          <section aria-live="polite" className="min-w-0">
            {activeSection === "Profile" && (
              <div>
                <div className="flex flex-col gap-8 border-b border-brand-border pb-10 sm:flex-row sm:items-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-24 w-24 rounded-full object-cover ring-1 ring-brand-border" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-black font-editorial text-4xl text-white" aria-hidden="true">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">Member profile</p>
                    <h2 className="mt-3 font-editorial text-4xl leading-none tracking-[-0.04em] text-brand-black">{user?.displayName || "WASTE. member"}</h2>
                    <p className="mt-3 text-sm text-brand-muted">{user?.email}</p>
                    <span className={`mt-4 inline-flex text-[10px] uppercase tracking-[0.18em] ${user?.emailVerified ? "text-emerald-700" : "text-amber-700"}`}>
                      {user?.emailVerified ? "Verified" : "Verify email"}
                    </span>
                  </div>
                </div>

                <dl className="grid gap-8 py-8 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Email</dt>
                    <dd className="mt-3 break-words text-sm text-brand-black">{user?.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Authentication provider</dt>
                    <dd className="mt-3 text-sm text-brand-black">{providerLabel}</dd>
                  </div>
                </dl>

                {!user?.emailVerified && (
                  <div className="mb-8 border border-amber-300 bg-amber-50/60 p-5">
                    <p className="text-sm text-amber-900">Verify your email to keep your account secure.</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <button type="button" onClick={() => void resendVerification().then(() => setMessage("Verification email sent.")).catch(() => setError("We could not send a verification email."))} className="text-[10px] uppercase tracking-[0.18em] text-brand-black underline">Resend verification</button>
                      <button type="button" onClick={() => void refreshVerification().then(() => setMessage("Verification status refreshed.")).catch(() => setError("We could not refresh verification status."))} className="text-[10px] uppercase tracking-[0.18em] text-brand-muted underline">Refresh status</button>
                    </div>
                  </div>
                )}
                <form onSubmit={saveProfile} className="max-w-xl border-t border-brand-border pt-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Edit profile</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <input required value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} placeholder="Full name" className="min-h-12 border-b border-brand-border bg-transparent text-sm text-brand-black outline-none placeholder:text-brand-muted/50 focus:border-brand-black" />
                    <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} placeholder="Phone number" className="min-h-12 border-b border-brand-border bg-transparent text-sm text-brand-black outline-none placeholder:text-brand-muted/50 focus:border-brand-black" />
                  </div>
                  <div className="mt-6 flex items-center gap-6">
                    <button disabled={isSaving || isLoadingData} className="border-b border-brand-black pb-2 text-[10px] uppercase tracking-[0.2em] text-brand-black transition hover:opacity-60 disabled:opacity-40">{isSaving ? "Saving" : "Save profile"}</button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="border-b border-brand-border pb-2 text-[10px] uppercase tracking-[0.2em] text-brand-muted transition hover:border-brand-black hover:text-brand-black disabled:cursor-wait disabled:opacity-50"
                    >
                      {isLoggingOut ? "Logging out" : "Log out"}
                    </button>
                  </div>
                </form>
                {(message || error) && <p className={`mt-5 text-sm ${error ? "text-red-600" : "text-emerald-700"}`} role={error ? "alert" : "status"}>{error || message}</p>}
              </div>
            )}

            {activeSection === "Wishlist" && (
              <div className="max-w-4xl">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">Account / Wishlist</p>
                {wishlistLoading ? (
                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((item) => <div key={item} className="h-36 animate-pulse border border-brand-border bg-brand-surfaceSubtle" />)}
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="mt-10 border-y border-brand-border py-16 sm:py-24">
                    <h2 className="font-editorial text-5xl leading-none tracking-[-0.05em] text-brand-black sm:text-7xl">No saved pieces yet.</h2>
                    <p className="mt-6 max-w-sm text-sm leading-6 text-brand-muted">Keep the pieces that speak to you close.</p>
                    <button type="button" onClick={() => window.location.href = "/shop"} className="mt-8 border-b border-brand-black pb-2 text-[10px] uppercase tracking-[0.2em] text-brand-black transition hover:opacity-60">Explore Collection</button>
                  </div>
                ) : (
                  <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                      <article key={item.productId} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden border border-brand-border bg-brand-surfaceSubtle">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" />
                          <span className="absolute left-3 top-3 border border-emerald-200 bg-brand-surface/90 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-emerald-800 backdrop-blur-sm">Available</span>
                        </div>
                        <div className="pt-4">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">{item.category || "Collection"}</p>
                          <h2 className="mt-2 text-sm uppercase leading-5 tracking-[0.08em] text-brand-black">{item.name.split(" — ")[0]}</h2>
                          <p className="mt-2 text-sm font-medium text-brand-black">{formatPrice(item.price)}</p>
                          <div className="mt-5 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.16em]">
                            <button type="button" onClick={() => moveToCart(item)} className="border-b border-brand-black pb-1 text-brand-black transition hover:opacity-60">Move to cart</button>
                            <button type="button" onClick={() => void removeWishlistItem(item.productId)} className="text-brand-muted underline transition hover:text-brand-black">Remove</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {wishlistError && <p className="mt-5 text-sm text-red-600" role="alert">{wishlistError}</p>}
              </div>
            )}
            {activeSection === "Orders" && (
              <Placeholder title="Orders" message="No orders yet" detail="Your order history will appear here after your first purchase." />
            )}
            {activeSection === "Addresses" && (
              <div className="max-w-3xl">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">Account / Addresses</p>
                <div className="mt-10 grid gap-4">
                  {addresses.length === 0 && <p className="border-y border-brand-border py-12 font-editorial text-4xl text-brand-black">No saved addresses</p>}
                  {addresses.map((address) => (
                    <article key={address.id} className="border border-brand-border bg-brand-surface p-5 shadow-sm">
                      <div className="flex justify-between gap-4 text-sm font-medium text-brand-black"><p>{address.fullName}</p>{address.isDefault && <span className="text-[10px] uppercase tracking-[0.15em] text-brand-gold">Default</span>}</div>
                      <p className="mt-3 text-sm leading-6 text-brand-muted">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</p>
                      <div className="mt-5 flex gap-5 text-[10px] uppercase tracking-[0.15em]"><button type="button" onClick={() => { setEditingAddressId(address.id); setAddressForm({ ...address, id: undefined } as Omit<Address, "id">); }} className="text-brand-black underline">Edit</button><button type="button" onClick={() => void removeAddress(address.id)} className="text-brand-muted underline hover:text-brand-black">Delete</button></div>
                    </article>
                  ))}
                </div>
                <form onSubmit={submitAddress} className="mt-10 border-t border-brand-border pt-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">{editingAddressId ? "Edit address" : "Add address"}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {(["fullName", "phone", "pincode", "state", "city", "addressLine1", "addressLine2"] as const).map((field) => <input key={field} value={addressForm[field]} onChange={(event) => setAddressForm({ ...addressForm, [field]: event.target.value })} placeholder={field === "addressLine1" ? "Address line 1" : field === "addressLine2" ? "Address line 2" : field.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())} className="min-h-12 border-b border-brand-border bg-transparent text-sm text-brand-black outline-none placeholder:text-brand-muted/50 focus:border-brand-black sm:last:col-span-2" />)}
                  </div>
                  <label className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-brand-muted"><input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} /> Set as default</label>
                  <div className="mt-6 flex gap-5"><button disabled={isSaving} className="border-b border-brand-black pb-2 text-[10px] uppercase tracking-[0.2em] text-brand-black transition hover:opacity-60 disabled:opacity-40">{isSaving ? "Saving" : "Save address"}</button>{editingAddressId && <button type="button" onClick={resetAddressForm} className="text-[10px] uppercase tracking-[0.2em] text-brand-muted underline hover:text-brand-black">Cancel</button>}</div>
                </form>
                {(message || error) && <p className={`mt-5 text-sm ${error ? "text-red-600" : "text-emerald-700"}`} role={error ? "alert" : "status"}>{error || message}</p>}
              </div>
            )}
            {activeSection === "Settings" && (
              <Placeholder title="Settings" message="Account settings" detail="Profile preferences and communication settings will be available here soon." />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Placeholder({ title, message, detail }: { title: string; message: string; detail: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">Account / {title}</p>
      <div className="mt-10 border-y border-brand-border py-16 sm:py-24">
        <h2 className="font-editorial text-5xl leading-none tracking-[-0.05em] text-brand-black sm:text-7xl">{message}</h2>
        <p className="mt-6 max-w-sm text-sm leading-6 text-brand-muted">{detail}</p>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGate>
      <AccountContent />
    </AuthGate>
  );
}
