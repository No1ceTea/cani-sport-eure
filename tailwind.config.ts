import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue_primary: "#1E3A8A",
        black_stroke: "#050403",
      },
      fontFamily: {
        opendyslexic: ["OpenDyslexic", "sans-serif"],
        calibri: ["Calibri", "sans-serif"],
      },
      borderWidth: {
        2: "2px", // Épaisseur du contour conforme à Figma
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1E3A8A",
          black_stroke: "#050403",
        },
      },
    ],
  },
};
