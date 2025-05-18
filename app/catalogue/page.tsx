"use client"; // Indique que ce composant s'exécute côté client

import { useState, useEffect } from "react"; // Hooks React pour l'état et les effets
import CatalogueSorties from "../components/CatalogueSorties"; // Composant affichant la liste des sorties
import SidebarAdmin from "../components/SidebarAdmin"; // Barre latérale d'administration
import { useRouter } from "next/navigation"; // Navigation programmatique
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification

export default function CataloguePage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler l'ouverture de la modal d'ajout
  const { role, isLoading } = useAuth(); // Récupération du rôle et état de chargement
  const router = useRouter(); // Initialisation du router

  // Protection de la route - redirection si non admin
  useEffect(() => {
      if (!isLoading && role !== "admin") {
        router.push("/connexion"); // Redirection vers la page de connexion
      }
    }, [role, isLoading, router]);

  // Hook d'effet supplémentaire (incomplet/inutile)
  useEffect(() => {
    if (role !== "admin") return;
    // Note: cet effet ne fait rien actuellement
  });
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Barre latérale avec bouton d'ajout */}
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />
      
      {/* Composant principal affichant les sorties */}
      <CatalogueSorties isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
