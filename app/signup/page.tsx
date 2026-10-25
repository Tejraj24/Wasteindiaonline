import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create Account — WASTE",
  description: "Create an account for a considered way to shop at WASTE.",
};

const DESKTOP_BG_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792952936/creat-account-desktop_oeuc2e.png";
const MOBILE_BG_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792943350/Picsart_26-10-21_00-15-06-053_g3lf92.png";

export default function SignupPage() {
  return (
    <main className="signup-responsive-bg relative min-h-screen w-full flex items-center overflow-x-hidden bg-cover bg-center md:bg-[position:75%_center] lg:bg-[position:right_center] bg-no-repeat text-white">
      <style>{`
        .signup-responsive-bg {
          background-image: url(${MOBILE_BG_IMAGE_URL});
        }
        @media (min-width: 768px) {
          .signup-responsive-bg {
            background-image: url(${DESKTOP_BG_IMAGE_URL});
          }
        }
      `}</style>

      {/* Editorial dark wash: subtle dark wash on mobile, left vignette on desktop for transparent form legibility */}
      <div
        className="absolute inset-0 bg-black/40 md:bg-gradient-to-r md:from-black/75 md:via-black/35 md:to-transparent pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Two-zone editorial composition: left-aligned transparent form container showcasing the editorial visual on desktop */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center md:justify-start px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-16">
        <div className="w-full max-w-[460px] bg-transparent">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-[6px] border border-white/20 bg-black/20" />
            }
          >
            <AuthForm mode="signup" isDarkTheme={true} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
