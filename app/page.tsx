"use client";

import TitleSection from "./accueil/TitleSection";
import PresentationSection from "./accueil/PresentationSection";
import AgendaSection from "./accueil/AgendaSection";
import Sponsor from "./accueil/Sponsor";

import ScrollLock from "./components/ScrollLock";
import Sidebar from "./components/sidebars/Sidebar";

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >
      <ScrollLock />
      
      <TitleSection />
      <PresentationSection />
      <AgendaSection />
      <Sponsor />

      <Sidebar />
    </main>
  );
}