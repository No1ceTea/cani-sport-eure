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
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 flex justify-center items-start pt-40 pb-12 overflow-auto">
        <div className="w-full max-w-[1500px] px-6">
        <Calendar mode="admin" />
        </div>
      </main>
    </div>
  );
}
