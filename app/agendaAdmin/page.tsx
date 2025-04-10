// ✅ agendaAdmin/page.tsx
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
    <div className="flex overflow-hidden">
      <SidebarAdmin />
      <Calendar />
    </div>
  );
}
