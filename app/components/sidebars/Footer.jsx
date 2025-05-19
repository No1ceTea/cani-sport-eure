"use client"; // ✅ Utilisation du contexte

import { use, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../Auth/AuthProvider"; // ✅ Utilisation du contexte
import BlueBackground from "../backgrounds/BlueBackground";

export default function Footer() {
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    console.log("Rôle détecté :", role);
    console.log("User :", user);
  }, [user, role]);

  const pathname = usePathname();

  return (
    <footer className="bg-blue-900 text-white border-t-2 border-black">
      <BlueBackground>
        <div className="py-10 px-5">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
            {/* Colonne de gauche : Logo centré */}
            <div className="flex items-center justify-center md:justify-start">
              <img
                src="/Logo-ContourBlanc-SansFond.png"
                alt="Cani-Sports Eure"
                className="h-36 md:h-40"
              />
            </div>

            {/* Colonne du centre : Navigation + Réseaux Sociaux + Copyright */}
            <div className="flex flex-col items-center md:items-start">
              {/* Section Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
                <div>
                  <h3 className="primary_title mb-2">Informations</h3>
                  <ul className="text-sm space-y-1">
                    <li>
                      <a
                        href="/#accueil"
                        className="primary_text hover:underline"
                      >
                        Le Club
                      </a>
                    </li>
                    <li>
                      <a
                        href="/articles"
                        className="primary_text hover:underline"
                      >
                        Articles
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="primary_title mb-2">Ressources</h3>
                  <ul className="text-sm space-y-1">
                    <li>
                      <a
                        href="https://sublimtout.com/200-canisports-eure"
                        className="primary_text hover:underline"
                      >
                        Boutique
                      </a>
                    </li>
                    {(role === "adherent" || role === "admin" ) && (
                      <>
                        <li>
                          <a
                            href="/dashboard/client"
                            className="primary_text hover:underline"
                          >
                            Tableau de bord
                          </a>
                        </li>
                        <li>
                          <a
                            href="/creation-profil"
                            className="primary_text hover:underline"
                          >
                            Mon profil
                          </a>
                        </li>
                      </>
                    )}
                    {role === "admin" && (
                      <>
                        <li>
                          <a
                            href="/Document"
                            className="primary_text hover:underline"
                          >
                            Documents
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="primary_title mb-2">Évènements</h3>
                  <ul className="text-sm space-y-1">
                    <li>
                      <a
                        href="/listeEvenement"
                        className="primary_text hover:underline"
                      >
                        Évènements
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section Réseaux Sociaux */}
              <div className="primary_text mt-4 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 pb-4 w-full">
                <a
                  href="https://instagram.com/canisports_eure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <img
                    src="/logos/instagram.svg"
                    alt="Instagram"
                    className="h-5"
                  />
                  <span>@canisports_eure</span>
                </a>
                <a
                  href="mailto:cani.sports.eure@gmail.com"
                  className="flex items-center space-x-2"
                >
                  <img src="/icons/email.svg" alt="Email" className="h-5" />
                  <span>cani.sports.eure@gmail.com</span>
                </a>
                <a
                  href="https://facebook.com/canisports.eure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <img
                    src="/logos/facebook.svg"
                    alt="Facebook"
                    className="h-5"
                  />
                  <span>CanisportsEure</span>
                </a>
              </div>

              {/* Barre de séparation */}
              <div className="w-full border-t border-gray-400 my-4"></div>

              {/* Copyright */}
              <p className="text-sm text-center md:text-left">
                © Cani Sports - Eure, Tous droits réservés
              </p>
            </div>

            {/* Colonne de droite vide (pour l’équilibre sur PC) */}
            <div className="hidden md:block"></div>
          </div>
        </div>
      </BlueBackground>
    </footer>
  );
}
