"use client"; // Indique que ce composant s'exécute côté client

import Calendar from "@/app/components/Calendar"; // Composant calendrier pour afficher les événements
import Sidebar from "../components/sidebars/Sidebar"; // Barre latérale de navigation
import { useRouter } from "next/navigation"; // Hook de navigation entre pages
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification
import { useState, useEffect } from "react"; // Hooks React

export default function AgendaPage() {
  const { role, isLoading } = useAuth(); // Récupération du rôle utilisateur et état de chargement
  const router = useRouter(); // Initialisation du router pour la navigation

  // Protection de la route - redirection si ni adhérent ni admin
  useEffect(() => {
    if (!isLoading && role !== "adherent" && role !== "admin") {
      router.push("/connexion"); // Redirection vers la page de connexion
    }
  }, [isLoading, role, router]);

  // Hook d'effet supplémentaire (incomplet/inutile)
  useEffect(() => {
    if (role !== "admin" && role !== "adherent") return;
  });

  return (
    <div className="min-h-screen px-10 py-6">
      {/* Titre principal de la page */}
      <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">
        Événement
      </h1>
      {/* Composant calendrier en mode adhérent */}
      <Calendar mode="adherent" />
      {/* Barre latérale de navigation */}
      <Sidebar />
    </div>
  );
}
