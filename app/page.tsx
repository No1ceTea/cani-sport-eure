"use client";

import TitleSection from "./accueil/TitleSection";
import PresentationSection from "./accueil/PresentationSection";

import ScrollLock from "./components/ScrollLock";
import Grid_5 from "./components/Grid_5";

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >
      <ScrollLock />
      
      <TitleSection />
      <PresentationSection />

      {/* Grille de développement */}
      <Grid_5 />

    </main>
  );
}