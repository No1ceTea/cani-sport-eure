import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Cani-Sports Eure",
  description: "Site officiel de Cani-Sports Eure",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
