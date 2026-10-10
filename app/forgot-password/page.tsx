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
    <main className="flex min-h-screen items-center bg-black px-6 pb-24 pt-36 text-white md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <BackButton fallbackHref="/login" label="Back to login" variant="default" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">WASTE. / Account</p>
          </div>
          <h1 className="mt-5 font-editorial text-[clamp(4rem,14vw,7rem)] leading-[0.78] tracking-[-0.06em]">Reset password</h1>
          <p className="mt-8 text-sm leading-6 text-white/55">Enter your email and we will send instructions if an account exists.</p>
          <form onSubmit={submit} className="mt-10">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Email</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full border-b border-white/25 bg-transparent text-sm text-white outline-none focus:border-white" />
            </label>
            {message && <p className="mt-5 text-sm text-green-300" role="status">{message}</p>}
            {error && <p className="mt-5 text-sm text-red-300" role="alert">{error}</p>}
            {!isConfigured && <p className="mt-5 text-xs text-amber-200" role="alert">Firebase environment variables are required before password reset can be used.</p>}
            <button disabled={isSubmitting || !isConfigured} className="mt-7 w-full bg-white py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-black disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? "Please wait" : "Send instructions"}
            </button>
          </form>
          <Link href="/login" className="mt-8 inline-block text-[10px] uppercase tracking-[0.16em] text-white/50 transition hover:text-white">Back to login</Link>
        </div>
      </div>
    </main>
  );
}
