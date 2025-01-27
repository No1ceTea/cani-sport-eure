"use client";

import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/logo-noir-SansFond.png"
              alt="Cani-Sports Eure Logo"
              className="w-20 md:w-28"
            />
          </div>

          {/* Liens de navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Le Club
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Boutique
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    ACtualités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Documents
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Mon profil
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Événements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Tableau de bord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Liens réseaux sociaux */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/canisports_eure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 text-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href="mailto:cani.sports.eure@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 text-2xl"
              >
                <FaEnvelope />
              </a>
              <a
                href="https://facebook.com/CanisportsEure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 text-2xl"
              >
                <FaFacebook />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; Cani-Sports - Eure, Tous droits réservés</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
