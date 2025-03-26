"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
//import { deleteCookie } from "cookies-next";
import BlueBackground from "./backgrounds/BlueBackground";
import AddButtonAdmin from "./AddButtonAdmin";

interface SidebarAdminProps {
  onAdd?: () => void;
}

export default function SidebarAdmin({ onAdd }: SidebarAdminProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "sb:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "administrateur=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  
    // 🔹 Redirige vers la page d'accueil et recharge la page
    router.push("/");
  };

  const menuItems = [
    { name: "Accueil", path: "/" },
    { name: "Dashboard", path: "/dashboard/admin" },
    { name: "Événements", path: "/evenements" },
    { name: "Agenda", path: "/agendaAdmin" },
    { name: "Adhérents", path: "/dashboard/admin/adherents" },
    { name: "Résultats", path: "/resultats" },
    { name: "Articles", path: "/articleAdmin" },
    { name: "Stockage", path: "/DocumentManager" },
    { name: "Album", path: "/AlbumManager" },
    { name: "Catalogue de sorties", path: "/catalogue" },
  ];

  return (
    <div>
      <BlueBackground>
        <aside className="w-64 text-white p-5 h-screen flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
          <nav className="space-y-4 flex-1">
            {menuItems.map(({ name, path }) => (
              <Link key={name} href={path} className="block hover:underline">
                {name}
              </Link>
            ))}
          </nav>
          <AddButtonAdmin onAdd={onAdd} />
        </aside>
      </BlueBackground>
      </div>
  );
}
