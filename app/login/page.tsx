import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

/**
 * --------------------------------------------------------------------------
 * LOGIN CARD BACKGROUND TRANSPARENCY CONFIGURATION
 * --------------------------------------------------------------------------
 * Adjust this single value (1–5) to control the form container's background opacity:
 * - Level 1 = 0% background opacity (fully transparent)
 * - Level 2 = 10% background opacity
 * - Level 3 = 20% background opacity
 * - Level 4 = 40% background opacity
 * - Level 5 = 60% background opacity
 */
type TransparencyLevel = 1 | 2 | 3 | 4 | 5;

const LOGIN_CARD_TRANSPARENCY_LEVEL: TransparencyLevel = 4;

const TRANSPARENCY_BG_MAP: Record<TransparencyLevel, string> = {
  1: "transparent",
  2: "rgba(255, 255, 255, 0.10)",
  3: "rgba(255, 255, 255, 0.20)",
  4: "rgba(255, 255, 255, 0.40)",
  5: "rgba(255, 255, 255, 0.60)",
};

const DESKTOP_BG_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792906509/login-bg-image_cbaotv.jpg";
const MOBILE_BG_IMAGE_URL =
  "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792922323/mobile-loginimage_oc4dx1.jpg";

export default function LoginPage() {
  const cardBackgroundColor =
    TRANSPARENCY_BG_MAP[LOGIN_CARD_TRANSPARENCY_LEVEL] ?? "transparent";

  return (
    <main
      className="login-responsive-bg relative min-h-screen w-full flex items-center overflow-x-hidden bg-cover bg-center md:bg-[position:75%_center] lg:bg-[position:right_center] bg-no-repeat text-brand-black"
    >
      <style>{`
        .login-responsive-bg {
          background-image: url(${MOBILE_BG_IMAGE_URL});
        }
        @media (min-width: 768px) {
          .login-responsive-bg {
            background-image: url(${DESKTOP_BG_IMAGE_URL});
          }
        }
      `}</style>

      {/* 
        Two-zone editorial composition:
        Desktop: The login card is anchored on the left, leaving the right side open to showcase
        the fashion model and garment as the campaign focal point.
      */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-start px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-16">
        {/*
          Form Container:
          Background opacity is controlled via cardBackgroundColor without applying CSS `opacity`
          to the container, ensuring all text, inputs, and buttons retain 100% full opacity.
        */}
        <div
          className="w-full max-w-[460px] rounded-[6px] p-7 sm:p-9 md:p-10 lg:p-11 transition-colors duration-200"
          style={{ backgroundColor: cardBackgroundColor }}
        >
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
