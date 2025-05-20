"use client"; // Indique que ce composant s'exécute côté client

import { useState, useEffect } from "react"; // Importation des hooks React
import Calendar from "@/app/components/Calendar"; // Composant calendrier
import SidebarAdmin from "../components/SidebarAdmin"; // Barre latérale pour administrateur
import { useRouter } from "next/navigation"; // Hook de navigation
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification
import { motion, AnimatePresence } from "framer-motion"; // Animations

export default function AgendaPage() {
  const { role, isLoading } = useAuth(); // Récupération du rôle et état de chargement
  const router = useRouter(); // Initialisation du router pour la navigation
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month"); // État de la vue actuelle du calendrier
  const [isFullscreen, setIsFullscreen] = useState(false); // État du mode plein écran
  const [isConfigOpen, setIsConfigOpen] = useState(false); // État de l'ouverture du panneau de configuration

  // Protection de la route - redirection si non admin
  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion"); // Redirection vers la page de connexion
    }
  }, [role, isLoading, router]);

  // Fonction pour changer la date (à implémenter avec votre composant Calendar)
  const handleDateChange = (direction: "prev" | "next") => {
    // Logique à implémenter pour changer la date
    console.log(`Change date: ${direction}`);
    // Exemple: CalendarRef.current.navigateToDate(newDate);
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Chargement de l&apos;agenda...</p>
        </div>
      </div>
    );
  }

  // Redirection automatique si non admin (déjà géré par useEffect)
  if (!isLoading && role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {!isFullscreen && <SidebarAdmin />}

      <main className={`flex-1 flex flex-col ${isFullscreen ? 'px-4' : ''}`}>
        {/* En-tête avec contrôles et navigation */}
        <header className="bg-white shadow-sm z-10">
          
          {/* Panel de configuration conditionnel */}
          <AnimatePresence>
            {isConfigOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 overflow-hidden"
              >
                <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50">
                  <h2 className="text-sm font-medium text-gray-700 mb-3">Options d&apos;affichage</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600 mr-2" />
                        Afficher les événements passés
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600 mr-2" />
                        Afficher les weekends
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600 mr-2" />
                        Afficher les détails des événements
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Zone de calendrier */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden">
            <Calendar 
              mode="admin" 
            />
          </div>
        </div>
        
        {/* Légende et informations */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span>Événements du club</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>Compétitions</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              <span>Entraînements</span>
            </div>
            <div className="flex items-center ml-auto">
              <span className="text-gray-500 text-xs">Dernière synchronisation: aujourd&apos;hui à 10:45</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}