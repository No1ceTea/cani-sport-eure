"use client";

import Title from "./components/accueil/TitleSection";
import Presentation from "./components/accueil/PresentationSection";
import Agenda from "./components/accueil/AgendaSection";
import Sponsor from "./components/accueil/SponsorSection";
/*
import Evenements from "./components/accueil/EvenementsSection";
import Articles from "./components/accueil/ArticlesSection";
import Resultats from "./components/accueil/ResultatsSection";
*/

import Sidebar from "./components/sidebars/Sidebar";
import Footer from "./components/sidebars/Footer";

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >

      <Title />
      <Presentation />
      <Agenda />
      <Sponsor />
      {/*
      <Evenements />
      <Articles />
      <Resultats />
      */}

      <Sidebar />
      <Footer />
    </main>
  );
}