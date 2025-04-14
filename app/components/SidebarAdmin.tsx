"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import BlueBackground from "./backgrounds/BlueBackground";
import AddButtonAdmin from "./AddButtonAdmin";

interface SidebarAdminProps {
  onAdd?: () => void;
}

export default function SidebarAdmin({ onAdd }: SidebarAdminProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "sb:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "administrateur=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
  };

  const pathname = usePathname();

  const menuItems = [
    { name: "Accueil", path: "/" },
    { name: "Dashboard", path: "/dashboard/admin" },
    { name: "Événements", path: "/evenements" },
    { name: "Agenda", path: "/agendaAdmin" },
    { name: "Adhérents", path: "/dashboard/admin/adherents" },
    { name: "Résultats", path: "/resultatAdmin" },
    { name: "Articles", path: "/articleAdmin" },
    { name: "Stockage", path: "/DocumentManager" },
    { name: "Album", path: "/AlbumManager" },
    { name: "Catalogue de sorties", path: "/catalogue" },
  ];

  return (
    <>
      {/* Bouton menu pour mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar responsive */}
      <div className={`fixed md:relative top-0 left-0 z-40 h-full w-64 transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <BlueBackground>
          <aside className="text-white p-5 h-screen flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Admin</h2>
            <nav className="space-y-4 flex-1">
            {menuItems.map(({ name, path }) => (
              <Link
                key={name}
                href={path}
                className={`block hover:underline ${pathname === path ? "font-bold" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {name}
              </Link>
            ))}
            </nav>
            <AddButtonAdmin onAdd={onAdd} />
          </aside>
        </BlueBackground>
      </div>
    </>
  );
}
