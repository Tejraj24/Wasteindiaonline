"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps {
  /**
   * The destination route when direct entry or external arrival occurred.
   * Defaults to "/shop".
   */
  fallbackHref?: string;

  /**
   * Accessible text label for the button.
   * Defaults to "Back".
   */
  label?: string;

  /**
   * Optional custom classes for styling overrides.
   */
  className?: string;

  /**
   * Visual style variant.
   * - "default": Minimalist luxury e-commerce style with subtle arrow motion.
   * - "breadcrumb": Muted, compact style that sits cleanly beside breadcrumb navigation.
   * - "pill": Subtle bordered pill button for prominent action placement.
   */
  variant?: "default" | "breadcrumb" | "pill";

  /**
   * Whether to display the back arrow icon.
   * Defaults to true.
   */
  showIcon?: boolean;

  /**
   * Whether to display the text label visibly, or only to screen readers.
   * Defaults to true.
   */
  showLabel?: boolean;

  /**
   * Optional custom click handler invoked before navigation.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Sanitizes the fallback URL to prevent open-redirect vulnerabilities,
 * external protocol links, or endless navigation loops.
 */
export function sanitizeFallbackHref(fallbackHref?: string, currentPathname?: string): string {
  if (!fallbackHref || typeof fallbackHref !== "string") {
    return "/shop";
  }

  const trimmed = fallbackHref.trim();

  // Reject external protocols, protocol-relative, script or data URIs
  if (
    trimmed.startsWith("//") ||
    trimmed.includes("://") ||
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:")
  ) {
    return "/shop";
  }

  // Must begin with a single slash
  if (!trimmed.startsWith("/")) {
    return "/shop";
  }

  // Prevent navigation loop where fallback destination is identical to current path
  if (currentPathname && trimmed === currentPathname) {
    return currentPathname === "/shop" ? "/" : "/shop";
  }

  return trimmed;
}

/**
 * Determines whether the user navigated from an internal WASTE route in the current tab session.
 * Does not rely on window.history.length alone, protecting users arriving from Google,
 * Instagram, or external referrers from being ejected from the site.
 */
export function canNavigateBack(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const rawCount = sessionStorage.getItem("waste_nav_count");
    const navCount = rawCount !== null ? Number(rawCount) : 0;
    if (navCount > 0 && window.history.length > 1) {
      return true;
    }
  } catch {
    // sessionStorage might be restricted in privacy mode
  }

  // Fallback: Check if document.referrer belongs to the same origin
  if (
    typeof document !== "undefined" &&
    document.referrer &&
    document.referrer.startsWith(window.location.origin) &&
    window.history.length > 1
  ) {
    return true;
  }

  return false;
}

const variantStyles: Record<NonNullable<BackButtonProps["variant"]>, string> = {
  default:
    "group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80 py-1.5",
  breadcrumb:
    "group inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-white/45 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80 py-1",
  pill:
    "group inline-flex items-center gap-2 border border-white/20 bg-white/[0.04] px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-white/60 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80",
};

export function BackButton({
  fallbackHref = "/shop",
  label = "Back",
  className = "",
  variant = "default",
  showIcon = true,
  showLabel = true,
  onClick,
}: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
      if (event.defaultPrevented) return;
    }

    const safeDestination = sanitizeFallbackHref(fallbackHref, pathname);

    if (canNavigateBack()) {
      router.back();
    } else {
      router.push(safeDestination);
    }
  };

  const baseStyle = variantStyles[variant] || variantStyles.default;
  const iconSize = variant === "breadcrumb" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyle} ${className}`}
      data-cursor="BACK"
      aria-label={label}
    >
      {showIcon && (
        <ArrowLeft
          className={`${iconSize} transition-transform duration-200 group-hover:-translate-x-1`}
          aria-hidden="true"
          strokeWidth={1.5}
        />
      )}
      {showLabel ? (
        <span>{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </button>
  );
}
