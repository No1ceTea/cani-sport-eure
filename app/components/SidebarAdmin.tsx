"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function SidebarAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("sb:token"); // 🔹 Supprime le cookie de session (remplace "sb:token" si nécessaire)
    router.push("/"); // 🔹 Redirige vers la page d'accueil
  };

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Événements", path: "/evenements" },
    { name: "Agenda", path: "/agenda" },
    { name: "Adhérents", path: "/admin/adherents" },
    { name: "Résultats", path: "/resultats" },
    { name: "Articles", path: "/articles" },
    { name: "Stockage", path: "/stockage" },
    { name: "Album", path: "/album" },
    { name: "Catalogue de sorties", path: "/catalogue" },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white p-5 h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      <nav className="space-y-4 flex-1">
        {menuItems.map(({ name, path }) => (
          <Link key={name} href={path} className="block hover:underline">
            {name}
          </Link>
        ))}
      </nav>
      
      {/* 🔹 Bouton Déconnexion en bas */}
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded w-full"
      >
        Déconnexion
      </button>
    </aside>
  );
}
