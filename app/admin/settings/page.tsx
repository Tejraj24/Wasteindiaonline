"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Settings,
  Save,
  Loader2,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    storeName: "WASTE.",
    logo: "",
    supportEmail: "concierge@wasteindiaonline.com",
    phone: "+91 98765 43210",
    address: "Studio Waste, New Delhi, India",
    currency: "INR",
    instagram: "https://instagram.com",
    twitter: "",
    announcement: "Complimentary carbon-neutral domestic delivery across India.",
  });

  async function loadSettings() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setForm({
          storeName: data.storeName || "WASTE.",
          logo: data.logo || "",
          supportEmail: data.supportEmail || "concierge@wasteindiaonline.com",
          phone: data.phone || "+91 98765 43210",
          address: data.address || "Studio Waste, New Delhi, India",
          currency: data.currency || "INR",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          announcement: data.announcement || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      setSuccess("Store settings updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update settings";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / SETTINGS / STORE CONFIGURATION
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Store Configurations
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Customize branding, concierge contact, announcements, and global store settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-xs font-semibold uppercase tracking-wider">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 rounded-lg bg-blue-600/10 border border-blue-500/20 px-3.5 py-2 text-blue-400 shadow-sm"
        >
          <Sliders className="h-4 w-4" />
          <span>Store Configuration</span>
        </Link>
        <Link
          href="/admin/settings/account"
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Admin Account & Security</span>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-200">
            <Store className="h-4 w-4 text-blue-400" />
            <h2>Store Identity & Brand</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Storefront Name *
              </label>
              <input
                required
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Currency Code
              </label>
              <input
                disabled
                type="text"
                value={form.currency}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 font-mono text-xs text-zinc-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Brand Logo URL (Optional)
            </label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              placeholder="https://..."
              className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Global Announcement */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-200">
            <Bell className="h-4 w-4 text-amber-400" />
            <h2>Storefront Top Banner Announcement</h2>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Banner Message
            </label>
            <input
              type="text"
              value={form.announcement}
              onChange={(e) => setForm({ ...form, announcement: e.target.value })}
              placeholder="e.g. Complimentary carbon-neutral domestic delivery across India."
              className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Appears at the very top of all customer-facing storefront pages.
            </p>
          </div>
        </div>

        {/* Concierge & Contact */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-200">
            <Mail className="h-4 w-4 text-purple-400" />
            <h2>Contact & Concierge</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Studio Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Studio Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-200">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h2>Social Profiles</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/wasteindia"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                placeholder="https://x.com/wasteindia"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
