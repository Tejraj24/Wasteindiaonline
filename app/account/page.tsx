"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuth } from "@/components/auth/AuthProvider";
import { Address, createAddress, deleteAddress, getUserProfile, listAddresses, updateAddress, updateUserProfile, UserProfile } from "@/lib/firebase/account";
import { useEffect } from "react";

const accountSections = ["Profile", "Wishlist", "Orders", "Addresses", "Settings"] as const;
type AccountSection = (typeof accountSections)[number];

function AccountContent() {
  const router = useRouter();
  const { user, logout, resendVerification, refreshVerification } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>("Profile");
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

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-white/15 pb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">WASTE. / Private account</p>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h1 className="font-editorial text-[clamp(4rem,12vw,8rem)] leading-[0.78] tracking-[-0.06em]">Your account</h1>
            <p className="max-w-xs text-xs leading-5 text-white/45">A considered space for your WASTE. profile and future collection activity.</p>
          </div>
        </div>

        <div className="grid gap-12 py-10 md:grid-cols-[190px_minmax(0,1fr)] md:gap-20 md:py-16">
          <nav aria-label="Account sections" className="flex gap-6 overflow-x-auto border-b border-white/15 pb-5 md:block md:space-y-5 md:border-b-0 md:pb-0">
            {accountSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`shrink-0 text-left text-[10px] uppercase tracking-[0.2em] transition ${
                  activeSection === section ? "text-white" : "text-white/35 hover:text-white"
                }`}
                aria-current={activeSection === section ? "page" : undefined}
              >
                <span className={activeSection === section ? "mr-2 inline-block h-px w-5 bg-brand-blue align-middle" : "mr-7 inline-block w-0"} />
                {section}
              </button>
            ))}
          </nav>

          <section aria-live="polite" className="min-w-0">
            {activeSection === "Profile" && (
              <div>
                <div className="flex flex-col gap-8 border-b border-white/15 pb-10 sm:flex-row sm:items-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-24 w-24 rounded-full object-cover ring-1 ring-white/20" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue font-editorial text-4xl text-white" aria-hidden="true">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Member profile</p>
                    <h2 className="mt-3 font-editorial text-4xl leading-none tracking-[-0.04em]">{user?.displayName || "WASTE. member"}</h2>
                    <p className="mt-3 text-sm text-white/55">{user?.email}</p>
                    <span className={`mt-4 inline-flex text-[10px] uppercase tracking-[0.18em] ${user?.emailVerified ? "text-green-300" : "text-amber-200"}`}>
                      {user?.emailVerified ? "Verified" : "Verify email"}
                    </span>
                  </div>
                </div>

                <dl className="grid gap-8 py-8 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-white/40">Email</dt>
                    <dd className="mt-3 break-words text-sm">{user?.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-white/40">Authentication provider</dt>
                    <dd className="mt-3 text-sm">{providerLabel}</dd>
                  </div>
                </dl>

                {!user?.emailVerified && (
                  <div className="mb-8 border-y border-amber-300/20 bg-amber-300/5 p-5">
                    <p className="text-sm text-amber-100">Verify your email to keep your account secure.</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <button type="button" onClick={() => void resendVerification().then(() => setMessage("Verification email sent.")).catch(() => setError("We could not send a verification email."))} className="text-[10px] uppercase tracking-[0.18em] text-white underline">Resend verification</button>
                      <button type="button" onClick={() => void refreshVerification().then(() => setMessage("Verification status refreshed.")).catch(() => setError("We could not refresh verification status."))} className="text-[10px] uppercase tracking-[0.18em] text-white/55 underline">Refresh status</button>
                    </div>
                  </div>
                )}
                <form onSubmit={saveProfile} className="max-w-xl border-t border-white/15 pt-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Edit profile</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <input required value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} placeholder="Full name" className="min-h-12 border-b border-white/25 bg-transparent text-sm outline-none focus:border-white" />
                    <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} placeholder="Phone number" className="min-h-12 border-b border-white/25 bg-transparent text-sm outline-none focus:border-white" />
                  </div>
                  <button disabled={isSaving || isLoadingData} className="mt-6 border-b border-white pb-2 text-[10px] uppercase tracking-[0.2em] disabled:opacity-40">{isSaving ? "Saving" : "Save profile"}</button>
                </form>
                {(message || error) && <p className={`mt-5 text-sm ${error ? "text-red-300" : "text-green-300"}`} role={error ? "alert" : "status"}>{error || message}</p>}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="border-b border-white pb-2 text-[10px] uppercase tracking-[0.2em] transition hover:border-brand-blue hover:text-brand-blue disabled:cursor-wait disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out" : "Log out"}
                </button>
              </div>
            )}

            {activeSection === "Wishlist" && (
              <Placeholder title="Wishlist" message="Wishlist is empty" detail="Pieces you save for later will appear here." />
            )}
            {activeSection === "Orders" && (
              <Placeholder title="Orders" message="No orders yet" detail="Your order history will appear here after your first purchase." />
            )}
            {activeSection === "Addresses" && (
              <div className="max-w-3xl">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Account / Addresses</p>
                <div className="mt-10 grid gap-4">
                  {addresses.length === 0 && <p className="border-y border-white/15 py-12 font-editorial text-4xl">No saved addresses</p>}
                  {addresses.map((address) => (
                    <article key={address.id} className="border border-white/15 p-5">
                      <div className="flex justify-between gap-4 text-sm"><p>{address.fullName}</p>{address.isDefault && <span className="text-[10px] uppercase tracking-[0.15em] text-brand-blue">Default</span>}</div>
                      <p className="mt-3 text-sm leading-6 text-white/55">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</p>
                      <div className="mt-5 flex gap-5 text-[10px] uppercase tracking-[0.15em]"><button type="button" onClick={() => { setEditingAddressId(address.id); setAddressForm({ ...address, id: undefined } as Omit<Address, "id">); }} className="underline">Edit</button><button type="button" onClick={() => void removeAddress(address.id)} className="text-white/50 underline">Delete</button></div>
                    </article>
                  ))}
                </div>
                <form onSubmit={submitAddress} className="mt-10 border-t border-white/15 pt-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{editingAddressId ? "Edit address" : "Add address"}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {(["fullName", "phone", "pincode", "state", "city", "addressLine1", "addressLine2"] as const).map((field) => <input key={field} value={addressForm[field]} onChange={(event) => setAddressForm({ ...addressForm, [field]: event.target.value })} placeholder={field === "addressLine1" ? "Address line 1" : field === "addressLine2" ? "Address line 2" : field.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())} className="min-h-12 border-b border-white/25 bg-transparent text-sm outline-none focus:border-white sm:last:col-span-2" />)}
                  </div>
                  <label className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-white/55"><input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} /> Set as default</label>
                  <div className="mt-6 flex gap-5"><button disabled={isSaving} className="border-b border-white pb-2 text-[10px] uppercase tracking-[0.2em] disabled:opacity-40">{isSaving ? "Saving" : "Save address"}</button>{editingAddressId && <button type="button" onClick={resetAddressForm} className="text-[10px] uppercase tracking-[0.2em] text-white/50 underline">Cancel</button>}</div>
                </form>
                {(message || error) && <p className={`mt-5 text-sm ${error ? "text-red-300" : "text-green-300"}`} role={error ? "alert" : "status"}>{error || message}</p>}
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
      <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Account / {title}</p>
      <div className="mt-10 border-y border-white/15 py-16 sm:py-24">
        <h2 className="font-editorial text-5xl leading-none tracking-[-0.05em] sm:text-7xl">{message}</h2>
        <p className="mt-6 max-w-sm text-sm leading-6 text-white/45">{detail}</p>
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
