import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next"
import "./globals.css"

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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
