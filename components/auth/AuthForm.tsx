"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { UserRole } from "@/lib/auth/roles";

type AuthMode = "login" | "signup";

function firebaseErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);
    if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
      return "The email or password is incorrect.";
    }
    if (code.includes("email-already-in-use")) return "An account already exists for this email.";
    if (code.includes("weak-password")) return "Choose a stronger password.";
    if (code.includes("popup-closed-by-user")) return "Google sign-in was cancelled.";
    if (code.includes("popup-blocked")) return "Your browser blocked the Google sign-in window.";
    if (
      code.includes("provider-already-linked") ||
      code.includes("account-exists-with-different-credential") ||
      code.includes("credential-already-in-use")
    ) {
      return "An account already exists with a different sign-in method or provider identity.";
    }
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function resolveRedirectPath(role: UserRole, redirectParam: string | null): string {
  if (role === "ADMIN") {
    if (redirectParam && redirectParam.startsWith("/admin")) {
      return redirectParam;
    }
    return "/admin";
  }

  // CUSTOMER
  if (
    redirectParam &&
    !redirectParam.startsWith("/admin") &&
    !redirectParam.startsWith("/login") &&
    !redirectParam.startsWith("/signup")
  ) {
    return redirectParam;
  }
  return "/";
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || searchParams.get("next");
  const { user, role, loading, login, signUp, signInWithGoogle, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already authenticated when visiting /login or /signup
  useEffect(() => {
    if (!loading && user) {
      const destination = resolveRedirectPath(role, redirectParam);
      router.replace(destination);
    }
  }, [loading, user, role, redirectParam, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      let result;
      if (mode === "login") {
        result = await login(email, password);
      } else {
        result = await signUp(email, password);
      }
      const destination = resolveRedirectPath(result.role, redirectParam);
      router.replace(destination);
    } catch (authError) {
      setError(firebaseErrorMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function googleSignIn() {
    setError("");
    setIsSubmitting(true);
    try {
      const result = await signInWithGoogle();
      const destination = resolveRedirectPath(result.role, redirectParam);
      router.replace(destination);
    } catch (authError) {
      setError(firebaseErrorMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">WASTE. / Account</p>
      <h1 className="mt-5 font-editorial text-[clamp(4rem,14vw,7rem)] leading-[0.78] tracking-[-0.06em]">
        {mode === "login" ? "Welcome back" : "Join WASTE."}
      </h1>
      <p className="mt-8 max-w-sm text-sm leading-6 text-white/55">
        {mode === "login"
          ? "Continue to your WASTE. account."
          : "Create an account for a more considered way to shop."}
      </p>

      {!isConfigured && (
        <p
          className="mt-8 border border-amber-400/40 bg-amber-400/10 p-4 text-xs leading-5 text-amber-200"
          role="alert"
        >
          Authentication is not configured yet. Add the Firebase environment variables before using this form.
        </p>
      )}

      <form onSubmit={submit} className="mt-10 space-y-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 min-h-12 w-full border-b border-white/25 bg-transparent px-0 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Password</span>
          <input
            required
            minLength={6}
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 min-h-12 w-full border-b border-white/25 bg-transparent px-0 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white"
            placeholder="••••••••"
          />
        </label>
        {error && (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        <button
          disabled={isSubmitting || !isConfigured}
          className="w-full bg-white py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-brand-blue hover:text-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
        >
          {isSubmitting ? "Please wait" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/30">
        <span className="h-px flex-1 bg-white/15" />
        <span>Or</span>
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <button
        type="button"
        onClick={googleSignIn}
        disabled={isSubmitting || !isConfigured}
        className="w-full border border-white/25 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue with Google
      </button>

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-white/50">
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="transition hover:text-white"
        >
          {mode === "login" ? "Create account" : "Already a member"}
        </Link>
        {mode === "login" && (
          <Link href="/forgot-password" className="transition hover:text-white">
            Forgot password
          </Link>
        )}
      </div>
    </div>
  );
}
