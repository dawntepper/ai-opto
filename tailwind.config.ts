import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1a365d",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#48bb78",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#f56565",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#e2e8f0",
          foreground: "#1a365d",
        },
        accent: {
          DEFAULT: "#edf2f7",
          foreground: "#1a365d",
        },
        popover: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        green: {
          900: "#064e3b",  // Darker green for borders
          800: "#065f46",  // Slightly lighter but still dark green
        },
      },
      borderColor: {
        DEFAULT: "#065f46",  // Dark green border color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;