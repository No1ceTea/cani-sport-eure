"use client";

import TitleSection from "./components/accueil/TitleSection";
import PresentationSection from "./components/accueil/PresentationSection";
import Sponsor from "./components/accueil/Sponsor";

import Sidebar from "./components/sidebars/Sidebar";

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >

      <TitleSection />
      <PresentationSection />
      <Sponsor />

      <Sidebar />
    </main>
  );
}