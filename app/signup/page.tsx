import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create Account — WASTE",
  description: "Create an account for a considered way to shop at WASTE.",
};

const MOBILE_BG_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792943350/Picsart_26-10-21_00-15-06-053_g3lf92.png";

export default function SignupPage() {
  return (
    <main className="signup-mobile-bg relative min-h-screen w-full flex items-center justify-center bg-brand-bg bg-cover bg-center bg-no-repeat text-brand-black px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:px-12 md:pb-24 md:pt-36 overflow-x-hidden md:bg-none">
      <style>{`
        @media (max-width: 767px) {
          .signup-mobile-bg {
            background-image: url(${MOBILE_BG_IMAGE_URL});
          }
        }
      `}</style>

      {/* Mobile-only subtle dark wash to ensure complete text readability over high-contrast highlights */}
      <div
        className="absolute inset-0 bg-black/40 pointer-events-none z-0 md:hidden"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[460px] md:max-w-6xl">
        <div className="w-full bg-transparent">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse border border-brand-border bg-brand-surfaceSubtle/40" />
            }
          >
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
