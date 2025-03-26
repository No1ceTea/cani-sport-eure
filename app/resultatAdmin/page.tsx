"use client";

import { useState, useEffect } from "react";
import CatalogueResultats from "../components/CatalogueResultats";
import SidebarAdmin from "../components/SidebarAdmin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Auth/AuthProvider";

export default function ResultatsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
        if (!isLoading && role !== "admin") {
          router.push("/connexion");
        }
      }, [role, isLoading, router]);
  
    useEffect(() => {
      if (role !== "admin") return;
    });

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />
      <CatalogueResultats isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
