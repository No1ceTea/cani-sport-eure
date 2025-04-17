// Import des outils d'analyse, métadonnées et styles
import { Analytics } from "@vercel/analytics/next"; // Analyse d'utilisation Vercel
import type { Metadata } from "next"; // Type pour les métadonnées
import "./globals.css"; // Styles globaux de l'application
import { Inter } from "next/font/google"; // Police Inter de Google Fonts
import { SpeedInsights } from "@vercel/speed-insights/next"; // Mesure des performances
import { AuthProvider } from "./components/Auth/AuthProvider"; // Contexte d'authentification

// Configuration de la police Inter
const inter = Inter({ subsets: ["latin"] });

// Métadonnées de l'application (titre, description)
export const metadata: Metadata = {
  title: "Cani-Sports Eure",
  description: "Site officiel de Cani-Sports Eure",
};

// Layout racine qui englobe toute l'application
export default function RootLayout({
  children, // Contenu des pages enfants
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Fournit le contexte d'authentification à toute l'application */}
          {children} {/* Affiche le contenu de chaque page */}
          <SpeedInsights /> {/* Mesure les performances */}
          <Analytics /> {/* Collecte les données analytiques */}
        </AuthProvider>
      </body>
    </html>
  );
}
