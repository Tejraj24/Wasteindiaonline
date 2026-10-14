import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center bg-brand-bg px-6 pb-24 pt-36 text-brand-black md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <Suspense fallback={<div className="h-96 animate-pulse border border-brand-border bg-brand-surfaceSubtle" />}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </main>
  );
}
