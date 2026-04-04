import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#001e40",
        "primary-container": "#003366",
        secondary: "#006d3d",
        "secondary-container": "#97f3b5",
        "secondary-fixed": "#9af6b8",
        "secondary-fixed-dim": "#7ed99e",
        tertiary: "#381300",
        "tertiary-fixed": "#ffdbca",
        "tertiary-fixed-dim": "#ffb690",
        background: "#f9f9fc",
        "on-background": "#1a1c1e",
        surface: "#f9f9fc",
        "surface-dim": "#dadadc",
        "surface-bright": "#f9f9fc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f6",
        "surface-container": "#eeeef0",
        "surface-container-high": "#e8e8ea",
        "surface-container-highest": "#e2e2e5",
        outline: "#737780",
        "outline-variant": "#c3c6d1",
        "on-surface": "#1a1c1e",
        "on-surface-variant": "#43474f",
        brand: {
          50: "#eefbf4",
          100: "#d7f5e4",
          500: "#1f8f55",
          600: "#197545",
          700: "#145c37",
        },
        ink: {
          50: "#f7f8f9",
          100: "#edf0f2",
          700: "#39424e",
          900: "#18212b",
        },
      },
      fontFamily: {
        headline: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 14px 40px -24px rgba(24, 33, 43, 0.35)",
        ambient: "0 12px 32px rgba(26, 28, 30, 0.06)",
        soft: "0 18px 45px -28px rgba(0, 30, 64, 0.28)",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #001e40 0%, #003366 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
