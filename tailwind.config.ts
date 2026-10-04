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
          blue: "#050fff",
          dark: "#000000",
          light: "#ffffff",
          grey: "#f4f4f4",
          muted: "#686060",
          faded: "#818181",
        }
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
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
