"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("Nom événements");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUserRole = async () => {
      console.log("🔍 Vérification du rôle sur la page admin...");

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log("❌ Erreur de récupération de l'utilisateur, redirection.");
        router.push("/connexion");
        return;
      }

      const isAdmin = userData.user.user_metadata?.administrateur === true;
      console.log("🟢 Rôle utilisateur :", userData.user.user_metadata);

      if (!isAdmin) {
        console.log("🔴 Redirection de l'utilisateur NON ADMIN vers /unauthorized");
        router.push("/unauthorized");
        return;
      }

      setUserType("admin"); // Mise à jour correcte
    };

    checkUserRole();
  }, [router, pathname, supabase.auth]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Tableau des résultats du club */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Résultats du club</h3>
            <table className="table w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th>Adhérents</th>
                  <th>Compétition</th>
                  <th>Lieu</th>
                  <th>Distance</th>
                  <th>Classement</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mickael Courmaceul</td>
                  <td>Course nationale</td>
                  <td>Vernon</td>
                  <td>15km</td>
                  <td>12ème</td>
                  <td>12/09/2025</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Performance par adhérent */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Performance par adhérent</h3>
            <table className="table w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th>Adhérent</th>
                  <th>Lieu</th>
                  <th>Distance</th>
                  <th>Classement</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mickael Courmaceul</td>
                  <td>Vernon</td>
                  <td>15km</td>
                  <td>12ème</td>
                  <td>12/09/2025</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Nombre de participants par événement */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Nombre de participants par événements</h3>
            <select
              className="select select-bordered w-full mb-4"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option>Nom événements</option>
            </select>
            <div className="radial-progress text-blue-500" style={{ "--value": 25 } as React.CSSProperties}>
              25%
            </div>
          </div>

          {/* Nombre de kilomètres parcourus */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Nombre de kilomètres parcourus par compétition</h3>
            <p>Nombre de participants du club : 4</p>
            <div className="flex items-center mt-3">
              <progress className="progress progress-primary w-full" value="75" max="100"></progress>
              <span className="ml-3 text-xl font-bold">75%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Km parcourus par les participants (33.3 km)</p>
            <p className="text-sm text-gray-600">Km parcourus maximal (44.4 km)</p>
          </div>

          {/* Nombre d'événements */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Nombre d&apos;événements</h3>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-blue-500"></div>
              <span>Externe</span>
              <div className="h-4 w-4 bg-gray-300"></div>
              <span>Interne</span>
            </div>
            <div className="radial-progress text-blue-500 mt-4" style={{ "--value": 25 } as React.CSSProperties}>
              25%
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
