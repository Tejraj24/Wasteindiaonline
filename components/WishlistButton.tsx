"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { WishlistItem } from "@/lib/firebase/wishlist";

export function WishlistButton({ item, compact = false }: { item: WishlistItem; compact?: boolean }) {
  const { user } = useAuth();
  const { isSaved, toggle } = useWishlist();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const saved = isSaved(item.productId);

  async function handleToggle() {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setIsSaving(true);
    setSaveError("");
    try {
      await toggle(item);
    } catch (error) {
      console.error("Unable to update wishlist.", error);
      setSaveError("Wishlist is unavailable. Check your Firestore permissions.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        aria-label={saved ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
        aria-pressed={saved}
        className={`group/heart flex items-center justify-center transition ${compact ? "gap-3 text-[10px] uppercase tracking-[0.2em] text-brand-black" : "h-11 w-11 rounded-full border border-brand-border bg-brand-surface/90 text-brand-black shadow-sm backdrop-blur-sm hover:border-brand-black md:opacity-0 md:group-hover:opacity-100"} ${saved ? "text-brand-gold" : "text-brand-black"} ${isSaving ? "animate-pulse" : ""}`}
      >
        <svg viewBox="0 0 24 24" className={`${compact ? "h-4 w-4" : "h-5 w-5"} transition-transform duration-300 group-hover/heart:scale-110 ${saved ? "fill-current" : "fill-none"}`} aria-hidden="true">
          <path d="M20.8 8.7c0 5.1-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        {compact && <span>{saved ? "Saved" : "Save for later"}</span>}
      </button>
      {saveError && (
        <p className={`${compact ? "mt-2" : "absolute right-0 top-full mt-2 w-56"} text-[9px] uppercase leading-4 tracking-[0.1em] text-red-700`} role="alert">
          {saveError}
        </p>
      )}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Sign in to save">
          <div className="w-full max-w-sm border border-brand-border bg-brand-surface p-7 text-brand-black shadow-2xl md:p-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted">Private collection</p>
            <h2 className="mt-4 font-editorial text-4xl leading-none tracking-[-0.04em] text-brand-black">Sign in to save pieces to your collection.</h2>
            <div className="mt-8 flex items-center gap-5">
              <a href="/login" className="bg-brand-black px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-brand-black/85">Sign in</a>
              <button type="button" onClick={() => setShowAuthPrompt(false)} className="text-[10px] uppercase tracking-[0.18em] text-brand-muted transition hover:text-brand-black">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
