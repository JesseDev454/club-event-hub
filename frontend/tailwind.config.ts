import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
      boxShadow: {
        card: "0 14px 40px -24px rgba(24, 33, 43, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
