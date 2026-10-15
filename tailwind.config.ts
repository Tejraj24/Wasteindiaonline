import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAFAF8",           // Warm White: primary page background
          surface: "#FFFFFF",      // Pure White: cards, panels, clean content surfaces
          surfaceSubtle: "#F4F2EC", // Light warm grey for inputs, hovers, subtle sections
          black: "#111111",        // Ink Black: headings, body text, primary actions
          border: "#E8E6E1",       // Soft Grey: hairline dividers, borders
          muted: "#706E68",        // Accessible neutral grey (WCAG AA compliant, 4.6:1+ contrast)
          gold: "#B89A62",         // Champagne Gold: restrained decorative accents
          goldMuted: "rgba(184, 154, 98, 0.12)", // Subtle gold wash for badges
          blue: "#050fff",         // Legacy accent
          dark: "#000000",         // Preserved for true dark overlays
          light: "#ffffff",        // Pure white
          grey: "#f4f4f4",         // Legacy grey
          faded: "#706E68",        // Updated to accessible grey
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "'Cormorant Garamond'", "var(--font-instrument-serif)", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        tenor: ["var(--font-tenor-sans)", "'Tenor Sans'", "Tenor Sans Fallback", "Arial", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "'Cormorant Garamond'", "Georgia", "serif"],
        anton: ["var(--font-anton)", "Impact", "Anton", "Haettenschweiler", "Arial Black", "sans-serif"],
        reenie: ["var(--font-reenie)", "'Reenie Beanie'", "cursive", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.15em",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.32, 0.72, 0, 1)",
        "wipe": "cubic-bezier(0.65, 0.01, 0.05, 0.99)",
      }
    },
  },
  plugins: [],
};
export default config;
