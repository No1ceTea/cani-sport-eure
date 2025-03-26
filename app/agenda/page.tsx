"use client";

import Calendar from "@/app/components/Calendar";
import Sidebar from "../components/sidebars/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import { useState, useEffect } from "react";

export default function AgendaPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== "adherent" && role !== "admin") {
      router.push("/connexion"); // ou une page "Accès refusé"
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    if (role !== "admin" && role !== "adherent") return;
  });

  return (
    <div className="min-h-screen px-10 py-6">
      <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">
        Événement
      </h1>
      <Calendar readOnly />
      <Sidebar />
    </div>
  );
}
