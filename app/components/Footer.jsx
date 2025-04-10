"use client";

import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-start items-center justify-between gap-10 text-sm">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/logo-noir-SansFond.png"
              alt="Cani-Sports Eure Logo"
              className="w-20 md:w-28"
              width={50}
              height={50}
            />
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-2">Informations</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Le Club</a></li>
                <li><a href="#" className="hover:underline">Articles</a></li>
                <li><a href="#" className="hover:underline">Boutique</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Ressources</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Documents</a></li>
                <li><a href="#" className="hover:underline">Mon profil</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Événements</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Événements</a></li>
                <li><a href="#" className="hover:underline">Tableau de bord</a></li>
              </ul>
            </div>
          </div>

          {/* Réseaux + copyright */}
          <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
            <div className="flex items-center gap-6 text-2xl">
              <a
                href="https://instagram.com/canisports_eure"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                <FaInstagram />
              </a>
              <a
                href="mailto:cani.sports.eure@gmail.com"
                className="hover:text-blue-300"
              >
                <FaEnvelope />
              </a>
              <a
                href="https://facebook.com/CanisportsEure"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                <FaFacebook />
              </a>
            </div>
            <p className="text-xs mt-2">&copy; Cani Sports - Eure, Tous droits réservés</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
