import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center bg-black px-6 pb-24 pt-36 text-white md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <Suspense fallback={<div className="h-96 animate-pulse bg-white/5" />}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </main>
  );
}
