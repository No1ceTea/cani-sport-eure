"use client";

import { useState, useEffect } from "react";
import CatalogueSorties from "../components/CatalogueSorties";
import SidebarAdmin from "../components/SidebarAdmin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Auth/AuthProvider";

export default function CataloguePage() {
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
      <CatalogueSorties isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
