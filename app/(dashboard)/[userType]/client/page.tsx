"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ClientDashboardPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const adminCookie = cookies.find((row) => row.startsWith("administrateur="));
    const isAdmin = adminCookie ? adminCookie.split("=")[1] === "true" : false;

    setUserType(isAdmin ? "admin" : "client");

    // 🔹 Empêcher un utilisateur non connecté d'accéder
    if (!document.cookie.includes("sb:token")) {
      router.push("/connexion");
    }
  }, [router, pathname]);

  return (
    <div>
      <h1>Dashboard Client</h1>
      <p>Vous êtes sur la page dashboard client.</p>
    </div>
  );
};

export default ClientDashboardPage;
