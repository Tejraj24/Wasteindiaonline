"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { UserRole } from "@/lib/auth/roles";
import { BackButton } from "@/components/navigation/BackButton";

type AuthMode = "login" | "signup";

function firebaseErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);
    if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
      return "The email or password is incorrect.";
    }
    if (code.includes("email-already-in-use")) return "An account already exists for this email.";
    if (code.includes("weak-password")) return "Choose a stronger password.";
    if (
      code.includes("popup-closed-by-user") ||
      code.includes("cancelled-popup-request") ||
      code.includes("user-cancelled") ||
      code.includes("redirect-cancelled-by-user")
    ) {
      return "Google sign-in was cancelled.";
    }
    if (code.includes("popup-blocked")) return "Your browser blocked the Google sign-in window.";
    if (code.includes("unauthorized-domain")) {
      return "This domain is not authorized for Google Sign-In in Firebase Console.";
    }
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
  const { user, role, loading, login, signUp, signInWithGoogle, isConfigured, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Surface auth errors returned from redirect resolution (e.g. mobile return or popup cancellation)
  useEffect(() => {
    if (authError) {
      setError(firebaseErrorMessage({ code: authError }));
      clearAuthError();
    }
  }, [authError, clearAuthError]);

  // If user is already authenticated when visiting /login or /signup
  useEffect(() => {
    if (!loading && user) {
      let targetDestination = redirectParam;
      if (!targetDestination && typeof window !== "undefined") {
        try {
          targetDestination = sessionStorage.getItem("waste_auth_redirect_target");
          sessionStorage.removeItem("waste_auth_redirect_target");
        } catch {}
      }
      const destination = resolveRedirectPath(role, targetDestination);
      console.log("[Auth Diagnostic] AuthForm navigating authenticated user:", {
        destination,
        role,
        uid: user.uid,
      });
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
      const result = await signInWithGoogle(redirectParam);
      const destination = resolveRedirectPath(result.role, redirectParam);
      router.replace(destination);
    } catch (authError) {
      setError(firebaseErrorMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* Navigation / Category Header */}
      <div className="mb-6 flex items-center justify-between">
        <BackButton
          fallbackHref="/"
          label="Home"
          variant="default"
          className="text-white md:text-black hover:text-white/80 md:hover:text-black/80"
        />
        <p className="text-[10px] uppercase tracking-[0.28em] text-white md:text-black font-semibold font-medium">
          WASTE. / Account
        </p>
      </div>

      {/* Heading with constrained width for intentional line breaks */}
      <h1 className="mt-4 font-editorial text-[clamp(2.5rem,5.5vw,3.75rem)] leading-[0.9] tracking-[-0.04em] text-white md:text-black max-w-[280px]">
        {mode === "login" ? "Welcome back" : "Join WASTE."}
      </h1>

      <p className="mt-3.5 max-w-sm text-xs sm:text-sm leading-relaxed text-white md:text-black font-semibold">
        {mode === "login"
          ? "Continue to your WASTE. account."
          : "Create an account for a more considered way to shop."}
      </p>

      {!isConfigured && (
        <p
          className="mt-6 border border-amber-300 bg-amber-50/90 p-4 text-xs leading-5 text-amber-900 rounded-[3px]"
          role="alert"
        >
          Authentication is not configured yet. Add the Firebase environment variables before using this form.
        </p>
      )}

      {/* Form Fields */}
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.22em] text-white md:text-black font-semibold font-medium">
            Email
          </span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 h-12 w-full border-b border-[#C8C4BA] bg-transparent px-0 py-2.5 text-sm font-semibold text-white md:text-black outline-none transition-colors duration-200 placeholder:font-semibold placeholder:text-white md:placeholder:text-black hover:border-brand-black/60 focus:border-brand-black"
            placeholder="your@example.com"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.22em] text-white md:text-black font-semibold font-medium">
            Password
          </span>
          <input
            required
            minLength={6}
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 h-12 w-full border-b border-[#C8C4BA] bg-transparent px-0 py-2.5 text-sm text-white md:text-black outline-none transition-colors duration-200 placeholder:text-white md:placeholder:text-black hover:border-brand-black/60 focus:border-brand-black"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="text-xs text-red-600 bg-red-50/90 border-l-2 border-red-600 px-3 py-2 leading-relaxed rounded-[2px]" role="alert">
            {error}
          </p>
        )}

        <button
          disabled={isSubmitting || !isConfigured}
          className="w-full h-12 rounded-[4px] bg-brand-black py-0 px-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-200 hover:bg-brand-black/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:border disabled:border-brand-border disabled:bg-brand-surfaceSubtle disabled:text-white font-semibold flex items-center justify-center shadow-sm border border-white/20 md:border-transparent"
        >
          {isSubmitting ? "Please wait" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white md:text-black font-semibold">
        <span className="h-px flex-1 bg-[#E4E1DA]" />
        <span>Or</span>
        <span className="h-px flex-1 bg-[#E4E1DA]" />
      </div>

      {/* Outlined Google Sign-In with matching height and geometry */}
      <button
        type="button"
        onClick={googleSignIn}
        disabled={isSubmitting || !isConfigured}
        className="w-full h-12 rounded-[4px] border border-[#D0CCC3] bg-white/95 py-0 px-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-black shadow-sm transition-all duration-200 hover:border-brand-black hover:bg-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center"
      >
        Continue with Google
      </button>

      {/* Footer Links */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-white md:text-black font-semibold font-medium">
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="transition-colors hover:text-white/80 md:hover:text-black"
        >
          {mode === "login" ? "Create account" : "Already a member"}
        </Link>
        {mode === "login" && (
          <Link
            href="/forgot-password"
            className="transition-colors hover:text-white/80 md:hover:text-black"
          >
            Forgot password
          </Link>
        )}
      </div>
    </div>
  );
}
