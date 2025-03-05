import { useState } from "react";
import Image from "next/image";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant avec SVG */}
      <button
        className="fixed top-4 right-4 primary_button shadow-lg transition p-2 z-99"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/icons/align-right.svg" alt="Menu" className="w-6 h-6" />
      </button>

      {/* Overlay avec une teinte bleu foncé et plus opaque */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blue_primary opacity-30 z-90"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar avec le plus haut `z-index` pour être toujours visible */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-99`}
      >
        {/* Bouton de fermeture avec SVG */}
        <button
          className="absolute top-4 right-4 p-2 drop-shadow-lg"
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

        {/* Contenu de la sidebar */}
        <div className="flex flex-col items-center mt-16 space-y-4">
          <ul className="primary_title tracking-wide space-y-4 text-center">
            <li><a href="#" className="hover:text-gray-300">Le Club</a></li>
            <li><a href="#" className="hover:text-gray-300">Actualités</a></li>
            <li><a href="#" className="hover:text-gray-300">Événements</a></li>
            <li><a href="#" className="hover:text-gray-300">Articles</a></li>
            <li><a href="#" className="hover:text-gray-300">Documents</a></li>
            <li><a href="#" className="hover:text-gray-300">Tableau de bord</a></li>
            <li><a href="#" className="hover:text-gray-300">Boutique</a></li>
            <li><a href="#" className="hover:text-gray-300">Réglages</a></li>
            <li><a href="#" className="hover:text-gray-300">Mon profil</a></li>
            <li><a href="#" className="hover:text-gray-300">Admin</a></li>
            <li><a href="#" className="hover:text-yellow_primary">Se déconnecter</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;