"use client"; // Obligatoire pour interagir avec le DOM

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import Sidebar from "../components/sidebars/Sidebar";

const TitleSection = () => {
  const router = useRouter();
  const pathname = usePathname(); // Récupère l'URL actuelle sans le hash

  const handleScroll = () => {
    const section = document.getElementById("presentation");

    if (section) {
      // Vérifier si on est sur la bonne page avant de modifier l'URL
      if (pathname === "/") {
        router.replace("#presentation", { scroll: false }); // Change l'URL sans recharger
      }

      // Scroll fluide
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="accueil"
      className="h-screen bg-cover bg-center px-6 sm:px-16 relative grid grid-cols-5"
      style={{ backgroundImage: "url('/photos/MainPage_bg.jpg')" }}
    >
      
      {/* LOGO */}
      <div className="col-span-5 flex justify-between items-center p-4 absolute top-0 left-0 w-full">
        <Image
          src="/logo-noir-SansFond.png"
          alt="Logo Client"
          width={100}
          height={50}
          className="object-contain"
        />
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="col-span-3 flex flex-col justify-center pl-6 sm:pl-16">
        <h1 className="primary_title text-4xl sm:text-6xl text-left">
          CANI-SPORTS EURE
        </h1>
        <p className="primary_text mt-4 max-w-lg text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* ESPACE VIDE POUR AÉRATION */}
      <div className="col-span-1"></div>

      {/* BOUTON "NOUS DÉCOUVRIR" */}
      <div className="col-span-1 flex items-end justify-end pb-10 pr-10">
        <button onClick={handleScroll} className="primary_button flex items-center">
          <span className="mr-3">Nous découvrir</span>
          <Image
            src="/icons/angle-double-down-anim.gif"
            alt="Animation Descente"
            className="w-6 h-6 filter invert"
            width={24}
            height={24}
            priority
          />
        </button>
      </div>

      <Sidebar></Sidebar>
    </section>
  );
};

export default TitleSection;