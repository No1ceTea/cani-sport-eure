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
        blue: "#475C99",
        darkBlue: "#031F73",
        black: "#050403",
        yellow:"#FED100",
        red:"BB1119",
        green: "#4EC052",
      },
      opacity:{
        '89':'0.89',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["corporate"], // Ajoutez les thèmes que vous souhaitez utiliser
  },
} satisfies Config;
