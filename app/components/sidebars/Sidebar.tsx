import { useState } from "react";
import Image from "next/image";
import BlueBackground from "../backgrounds/BlueBackground";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant avec un z-index très haut */}
      <button
        className="fixed top-4 right-4 primary_button shadow-lg transition p-2 z-[9999]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/icons/align-right.svg" alt="Menu" className="w-6 h-6" width={100} height={100}/>
      </button>

      {/* Overlay pour l'effet de fondu avec un z-index élevé */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blue_primary opacity-30 z-[9997]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar avec une bordure uniquement à gauche */}
      <div
        className={`fixed top-0 right-0 h-full w-64 shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-[9999] border-l-2 border-black`}
      >
        {/* Fond de la sidebar */}
        <div className="absolute inset-0 z-[9998]">
          <BlueBackground maxSize />
        </div>

        {/* Contenu de la sidebar, doit être positionné au-dessus */}
        <div className="relative z-[9999] flex flex-col items-center mt-16 space-y-4">
          {/* Bouton de fermeture bien calé en haut à droite, de manière responsive */}
          <button
            className="absolute top-0 right-0 translate-y-[-90%] p-2 drop-shadow-lg"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/icons/cross.svg"
              alt="Fermer"
              width={24}
              height={24}
              className="filter invert"
            />
          </button>

          {/* Liste du menu */}
          <ul className="primary_title tracking-wide space-y-4 text-center">
            <li><a href="/#accueil" className="hover:text-gray-300">Le Club</a></li>
            {/* <li><a href="#" className="hover:text-gray-300">Actualités</a></li> */}
            <li><a href="/evenements" className="hover:text-gray-300">Événements</a></li>
            <li><a href="/articles" className="hover:text-gray-300">Articles</a></li>
            <li><a href="/SortieCanine" className="hover:text-gray-300">Catalogue des sorties</a></li>

            <li><a href="https://www.google.fr/" className="hover:text-gray-300">Boutique</a></li>
            {/* <li><a href="#" className="hover:text-gray-300">Réglages</a></li> */}
            
            <li><a href="/creation-profil" className="hover:text-gray-300">Mon profil</a></li>
            <li><a href="/dashboard/client" className="hover:text-gray-300">Tableau de bord</a></li>
            <li><a href="/Document" className="hover:text-gray-300">Documents</a></li>
            <li><a href="/dashboard/admin" className="hover:text-gray-300">Admin</a></li>

            <li><a href="/connexion" className="hover:text-yellow_primary">Se connecter</a></li>
            <li><a href="/connexion#logout" className="hover:text-yellow_primary">Se déconnecter</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;