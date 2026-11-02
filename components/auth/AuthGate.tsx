"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/account");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg px-6 text-brand-black">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted" aria-live="polite">
          Verifying account
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
