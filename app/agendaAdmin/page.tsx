"use client"; // Indique que ce composant s'exécute côté client

import Calendar from "@/app/components/Calendar"; // Composant calendrier
import SidebarAdmin from "../components/SidebarAdmin"; // Barre latérale pour administrateur
import { useRouter } from "next/navigation"; // Hook de navigation
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification
import { useEffect } from "react"; // Hook d'effet React

export default function AgendaPage() {
  const { role, isLoading } = useAuth(); // Récupération du rôle et état de chargement
  const router = useRouter(); // Initialisation du router pour la navigation

  // Protection de la route - redirection si non admin
  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion"); // Redirection vers la page de connexion
    }
  }, [role, isLoading, router]);

  // Ne rien afficher pendant le chargement ou si l'utilisateur n'est pas admin
  if (!isLoading && role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin /> {/* Barre latérale d'administration */}

      <main className="flex-1 flex justify-center items-start pt-12 pb-12">
        <div className="w-full max-w-[1500px] max-h-[675px] px-6 overflow-auto">
          <Calendar mode="admin" /> {/* Affichage du calendrier en mode administrateur */}
        </div>
      </main>
    </div>
  );
}