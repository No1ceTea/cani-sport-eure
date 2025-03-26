"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../components/Auth/AuthProvider"; // ✅ Utilisation du contexte
import BlueBackground from "../backgrounds/BlueBackground";
import LogoutButton from "../Auth/LogoutButton";

export default function Sidebar() {
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    console.log("Rôle détecté :", role);
    console.log("User :", user);
  }, [user, role]);

  return (
    <>
      {/* Bouton d'ouverture de la sidebar */}
      <button
        className="fixed top-4 right-4 primary_button shadow-lg transition p-2 z-[9999]"
        onClick={() => {
          document.getElementById("sidebar")?.classList.toggle("translate-x-full");
        }}
      >
        <Image
          src="/icons/align-right.svg"
          alt="Menu"
          className="w-6 h-6"
          width={100}
          height={100}
        />
      </button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className="fixed top-0 right-0 h-full w-64 shadow-lg transform translate-x-full transition-transform duration-300 z-[9999] border-l-2 border-black"
      >
        <div className="absolute inset-0 z-[9998]">
          <BlueBackground maxSize />
        </div>

        <div className="relative z-[9999] flex flex-col items-center mt-16 space-y-4">
          <button
            className="absolute top-0 right-0 translate-y-[-90%] p-2 drop-shadow-lg"
            onClick={() => {
              document.getElementById("sidebar")?.classList.add("translate-x-full");
            }}
          >
            <Image
              src="/icons/cross.svg"
              alt="Fermer"
              width={24}
              height={24}
              className="filter invert"
            />
          </button>

          <ul className="primary_title tracking-wide space-y-4 text-center">
            <li>
              <a href="/#accueil" className="hover:text-gray-300">Le Club</a>
            </li>
            <li>
              <a href="/articles" className="hover:text-gray-300">Articles</a>
            </li>
            <li>
              <a href="/listeEvenement" className="hover:text-gray-300">Événements</a>
            </li>
            <li>
              <a href="/SortieCanine" className="hover:text-gray-300">Catalogue des sorties</a>
            </li>
            <li>
              <a href="/resultats" className="hover:text-gray-300">Resultats</a>
            </li>
            <li>
              <a href="/agenda" className="hover:text-gray-300">
                Agenda
              </a>
            </li>
            <li>
              <a href="https://sublimtout.com/200-canisports-eure" className="hover:text-gray-300">Boutique</a>
            </li>

            {/* ✅ Si connecté (adhérent ou admin) */}
            {(role === "adherent" || role === "admin") && (
              <>
                <li>
                  <a href="/creation-profil" className="hover:text-gray-300">Mon profil</a>
                </li>
                <li>
                  <a href="/dashboard/client" className="hover:text-gray-300">Tableau de bord</a>
                </li>
                <li>
                  <a href="/Document" className="hover:text-gray-300">Documents</a>
                </li>
              </>
            )}

            {/* ✅ Si admin */}
            {role === "admin" && (
              <li>
                <a href="/dashboard/admin" className="hover:text-gray-300">Admin</a>
              </li>
            )}

            {/* 🔒 Se connecter / Se déconnecter */}
            {!user && (
              <li>
                <a href="/connexion" className="hover:text-yellow_primary">Se connecter</a>
              </li>
            )}
            {user && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
