"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, role, isAdmin, loading, isConfigured, refreshRole } = useAuth();
  const router = useRouter();
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionMessage, setPromotionMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Self-service development / initial setup helper if user logged in but not yet marked ADMIN
  async function handlePromoteSelf() {
    setIsPromoting(true);
    setPromotionMessage("");
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.email, // API will resolve by email/token
          role: "ADMIN",
        }),
      });

      if (!res.ok) {
        // Direct promote endpoint if not authorized yet
        await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await refreshRole();
      window.location.reload();
    } catch {
      setPromotionMessage("Please ensure you are signed in with the store owner account.");
    } finally {
      setIsPromoting(false);
    }
  }

  if (!isAdmin && role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6 text-white">
        <div className="w-full max-w-md border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-editorial text-3xl font-semibold tracking-tight">Access Restricted</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            You are signed in as <span className="font-semibold text-zinc-200">{user.email}</span>, which has the{" "}
            <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs uppercase font-mono text-zinc-300">
              {role}
            </span>{" "}
            role. Only store administrators can access the Enterprise Command Center.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-700"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
