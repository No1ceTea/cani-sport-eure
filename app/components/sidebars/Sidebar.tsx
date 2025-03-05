import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant avec SVG */}
      <button
        className="fixed top-4 right-4 primary_button shadow-lg transition p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/icons/align-right.svg" alt="Menu" className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <div className="p-5">
          <h2 className="text-lg font-bold">Menu</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="block text-gray-700 hover:text-blue-500">Accueil</a></li>
            <li><a href="#" className="block text-gray-700 hover:text-blue-500">À propos</a></li>
            <li><a href="#" className="block text-gray-700 hover:text-blue-500">Contact</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;