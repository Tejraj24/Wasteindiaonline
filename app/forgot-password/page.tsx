"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BackButton } from "@/components/navigation/BackButton";

export default function ForgotPasswordPage() {
  const { sendPasswordReset, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setMessage("If an account exists for this email, reset instructions have been sent.");
    } catch {
      setError("We could not send reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center bg-brand-bg px-6 pb-24 pt-36 text-brand-black md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <BackButton fallbackHref="/login" label="Back to login" variant="default" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">WASTE. / Account</p>
          </div>
          <h1 className="mt-5 font-editorial text-[clamp(4rem,14vw,7rem)] leading-[0.78] tracking-[-0.06em] text-brand-black">Reset password</h1>
          <p className="mt-8 text-sm leading-6 text-brand-muted">Enter your email and we will send instructions if an account exists.</p>
          <form onSubmit={submit} className="mt-10">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Email</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full border-b border-brand-border bg-transparent text-sm text-brand-black outline-none placeholder:text-brand-muted/50 focus:border-brand-black" />
            </label>
            {message && <p className="mt-5 text-sm text-emerald-700" role="status">{message}</p>}
            {error && <p className="mt-5 text-sm text-red-600" role="alert">{error}</p>}
            {!isConfigured && <p className="mt-5 border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900" role="alert">Firebase environment variables are required before password reset can be used.</p>}
            <button disabled={isSubmitting || !isConfigured} className="mt-7 w-full bg-brand-black py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-black/90 disabled:cursor-not-allowed disabled:border disabled:border-brand-border disabled:bg-brand-surfaceSubtle disabled:text-brand-muted">
              {isSubmitting ? "Please wait" : "Send instructions"}
            </button>
          </form>
          <Link href="/login" className="mt-8 inline-block text-[10px] uppercase tracking-[0.16em] text-brand-muted transition hover:text-brand-black">Back to login</Link>
        </div>
      </div>
    </main>
  );
}
