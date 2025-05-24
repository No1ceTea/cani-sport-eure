"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../Auth/AuthProvider";
import BlueBackground from "../backgrounds/BlueBackground";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { user, role } = useAuth();
  const pathname = usePathname();
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-blue-900 text-white border-t-2 border-blue-800">
      <BlueBackground>
        <div className="py-12 px-5">
          <div className="container mx-auto">
            {/* Section principale */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
              {/* Logo et brève description */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start">
                <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/Logo-ContourBlanc-SansFond.png"
                    alt="Cani-Sports Eure"
                    width={140}
                    height={170}
                    className="h-auto"
                    priority
                  />
                </div>
                <p className="text-gray-300 text-sm max-w-xs text-center md:text-left">
                  Cani-Sports Eure est une association dédiée à la pratique des
                  sports canins dans le département de l'Eure, favorisant le
                  bien-être du chien et de son maître.
                </p>
              </div>

              {/* Navigation */}
              <div className="md:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {/* Menu Informations */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-white border-b border-blue-700 pb-2">
                      Informations
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/#accueil"
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                        >
                          <span className="mr-2">›</span> Le Club
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/articles"
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                        >
                          <span className="mr-2">›</span> Articles
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                        >
                          <span className="mr-2">›</span> Contact
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Menu Ressources */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-white border-b border-blue-700 pb-2">
                      Ressources
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="https://sublimtout.com/200-canisports-eure"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                        >
                          <span className="mr-2">›</span> Boutique
                        </a>
                      </li>
                      {(role === "adherent" || role === "admin") && (
                        <>
                          <li>
                            <Link
                              href="/dashboard/client"
                              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                            >
                              <span className="mr-2">›</span> Tableau de bord
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/creation-profil"
                              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                            >
                              <span className="mr-2">›</span> Mon profil
                            </Link>
                          </li>
                        </>
                      )}
                      {role === "admin" && (
                        <li>
                          <Link
                            href="/Document"
                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                          >
                            <span className="mr-2">›</span> Documents
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Menu Événements */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-white border-b border-blue-700 pb-2">
                      Événements
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/listeEvenement"
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                        >
                          <span className="mr-2">›</span> Agenda
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/calendrier"
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:translate-x-1 transform"
                        >
                          <span className="mr-2">›</span> Calendrier
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section réseaux sociaux */}
            <div className="border-t border-blue-800 pt-6 pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                {/* Réseaux sociaux */}
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://instagram.com/canisports_eure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-full transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Image
                      src="/logos/instagram.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a
                    href="https://facebook.com/canisports.eure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-full transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Image
                      src="/logos/facebook.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm">Facebook</span>
                  </a>
                  <a
                    href="mailto:cani.sports.eure@gmail.com"
                    className="group flex items-center bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-full transition-all duration-300"
                    aria-label="Email"
                  >
                    <Image
                      src="/icons/email.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm">Nous contacter</span>
                  </a>
                </div>

                {/* Copyright */}
                <div className="text-sm text-gray-400">
                  © {year} Cani Sports - Eure | Tous droits réservés
                </div>
              </div>
            </div>

            {/* Liens légaux */}
            <div className="text-center mt-4">
              <div className="text-xs text-gray-400 flex justify-center gap-4 flex-wrap">
                <Link
                  href="/mentions-legales"
                  className="hover:text-white transition-colors"
                >
                  Mentions légales
                </Link>
                <Link
                  href="/politique-confidentialite"
                  className="hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
                <Link href="/cgv" className="hover:text-white transition-colors">
                  Conditions générales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </BlueBackground>
    </footer>
  );
}
