"use client"; // Directive indiquant que ce composant s'exécute côté client

import { useState, useEffect } from "react"; // Hooks React pour gérer l'état et les effets
import CatalogueResultats from "../components/CatalogueResultats"; // Composant pour afficher les résultats
import SidebarAdmin from "../components/SidebarAdmin"; // Barre latérale pour l'administration
import { useRouter } from "next/navigation"; // Hook de routage Next.js
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Hook personnalisé pour vérifier l'authentification

export default function ResultatsPage() {
  // État pour contrôler l'ouverture/fermeture de la modale d'ajout de résultat
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupération du rôle utilisateur et de l'état de chargement depuis le contexte d'authentification
  const { role, isLoading } = useAuth();

  // Accès au router pour les redirections
  const router = useRouter();

  // Redirection vers la page de connexion si l'utilisateur n'est pas administrateur
  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  // Effet supplémentaire pour vérifier le rôle (incomplet, ne fait rien actuellement)
  useEffect(() => {
    if (role !== "admin") return;
  });

  // Rendu de l'interface d'administration des résultats
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Barre latérale avec bouton d'ajout qui ouvre la modale */}
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />

      {/* Catalogue des résultats avec contrôle de la modale */}
      <CatalogueResultats
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
