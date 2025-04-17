"use client";

import Calendar from "@/app/components/Calendar";
import SidebarAdmin from "../components/SidebarAdmin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import { useEffect } from "react";

export default function AgendaPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  if (!isLoading && role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />

      <main className="flex-1 flex justify-center items-start pt-12 pb-12">
        <div className="w-full max-w-[1500px] max-h-[675px] px-6 overflow-auto">
        <Calendar mode="admin" />
        </div>
      </main>
    </div>
  );
}