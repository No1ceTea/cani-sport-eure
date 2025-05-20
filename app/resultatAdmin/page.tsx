"use client";

import { useState, useEffect } from "react";
import CatalogueResultats from "../components/CatalogueResultats";
import SidebarAdmin from "../components/SidebarAdmin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";

export default function ResultatsPage() {
  // États existants
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, isLoading } = useAuth();
  const router = useRouter();

  // États pour l'UI
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);

  // Redirection si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  // Simuler le chargement des données
  useEffect(() => {
    if (role === "admin") {
      const timer = setTimeout(() => {
        setLoadingContent(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [role]);

  // État de chargement initial
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement de l&apos;administration...
          </p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas admin, ne pas afficher le contenu
  if (!isLoading && role !== "admin") return null;

  return (
    <div className="bg-gray-50 flex h-screen overflow-hidden">
      {/* Sidebar pour desktop */}
      <div className="">
        <SidebarAdmin />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* En-tête */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gestion des résultats
              </h1>
            </div>
          </div>
        </header>

        {/* Zone de contenu principal */}
        <div className="flex-1 overflow-auto">
          {loadingContent ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-3 text-gray-600">
                  Chargement des résultats...
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 lg:p-8">
              <CatalogueResultats
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
