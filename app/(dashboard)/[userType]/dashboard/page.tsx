"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const adminCookie = cookies.find((row) => row.startsWith("administrateur="));
    const isAdmin = adminCookie ? adminCookie.split("=")[1] === "true" : false;

    setUserType(isAdmin ? "admin" : "client");

    // 🔹 Empêcher un client d'accéder au /admin/dashboard
    if (pathname.includes("/admin") && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [router, pathname]);

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {userType === "admin" ? "Dashboard Administrateur" : "Dashboard Client"}
      </h1>
      <p>Bienvenue sur votre espace {userType}.</p>
    </div>
  );
}
