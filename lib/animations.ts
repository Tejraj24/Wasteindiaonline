import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

// Initialize GSAP plugins in browser
export function initGSAP() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, Observer);
  }
}

// Custom easing definitions matching Odd Ritual
export const EASINGS = {
  ease1: "power3.out",
  ease2: "power2.inOut",
  ease3: "power4.inOut",
  expo: "expo.inOut",
  editorial: "cubic-bezier(0.32, 0.72, 0, 1)",
  wipe: "cubic-bezier(0.65, 0.01, 0.05, 0.99)",
};

export const CLIP_PATHS = {
  full: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  topClosed: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  bottomClosed: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
};
