import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login — WASTE",
  description: "Sign in to your WASTE account.",
};

const LOGIN_BG_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792906509/login-bg-image_cbaotv.jpg";

export default function LoginPage() {
  return (
    <main
      className="relative min-h-screen w-full flex items-center overflow-x-hidden bg-cover bg-[position:70%_center] md:bg-[position:75%_center] lg:bg-[position:right_center] bg-no-repeat text-brand-black"
      style={{
        backgroundImage: `url('${LOGIN_BG_IMAGE_URL}')`,
        backgroundSize: "cover",
      }}
    >
      {/* 
        Two-zone editorial composition:
        Desktop: The login card is anchored on the left, leaving the right side open to showcase
        the fashion model and garment as the campaign focal point.
      */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-start px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-16">
        {/*
          Premium Glassmorphism Card:
          - Translucent warm ivory: rgba(250, 247, 241, 0.68) on desktop, 0.75 on mobile
          - Backdrop filter: blur(20px)
          - Delicate 1px semi-transparent white/ivory border (rgba(255, 255, 255, 0.72))
          - Subtle inner highlight catching light at top edge
          - Soft, restrained drop shadow
          - Refined 6px corner radius
          - 36-44px internal padding on desktop (p-7 sm:p-9 md:p-10 lg:p-11)
          - Opaque warm ivory fallback for browsers without backdrop-filter support
        */}
        <div className="glass-panel w-full max-w-[460px] rounded-[6px] p-7 sm:p-9 md:p-10 lg:p-11">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-[6px] border border-brand-border bg-brand-surfaceSubtle/60" />
            }
          >
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
