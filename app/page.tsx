"use client";

import TitleSection from "./components/accueil/TitleSection";
import PresentationSection from "./components/accueil/PresentationSection";
import AgendaPublic from "./components/accueil/AgendaSection";
import Sponsor from "./components/accueil/Sponsor";

import Sidebar from "./components/sidebars/Sidebar";

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >

      <TitleSection />
      <PresentationSection />
      <AgendaPublic />

      <Sponsor />

      <Sidebar />
    </main>
  );
}