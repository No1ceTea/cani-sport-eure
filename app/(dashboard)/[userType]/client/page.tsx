"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Assure-toi d'importer le client Supabase

export default function ClientDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("Événement 1");
  const [isLoading, setIsLoading] = useState(true);

  // Données fictives
  const results = [
    { competition: "Course nationale", type: "Trail", lieu: "Vernon", distance: "15km", classement: "12ème", date: "12/09/2025" },
    { competition: "Course régionale", type: "Cross", lieu: "Vernon", distance: "15km", classement: "12ème", date: "12/09/2025" },
    { competition: "Course départementale", type: "Cross", lieu: "Vernon", distance: "15km", classement: "12ème", date: "12/09/2025" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Rediriger l'utilisateur non connecté vers la page de connexion
        return;
      }

      // Vérifier le rôle de l'utilisateur
      const { user } = session;
      const isAdmin = user?.user_metadata?.administrateur;

      if (isAdmin) {
        setUserType("admin");
      } else {
        setUserType("client");
      }

      // Redirection en cas d'accès non autorisé à la page /admin
      if (pathname.includes("/admin") && !isAdmin) {
        router.push("/unauthorized");
      }

      setIsLoading(false); // Fin du chargement
    };

    checkUser();
  }, [router, pathname]);

  if (isLoading) {
    return <div>Loading...</div>; // Affiche un écran de chargement pendant la vérification
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Tableau des résultats */}
        <div className="bg-white shadow-lg rounded-lg p-4 col-span-1">
          <div className="border-b pb-2 flex space-x-4">
            <button className="font-bold border-b-2 border-blue-500">Mes derniers résultats</button>
            <button className="text-gray-500">Voir tous mes résultats</button>
          </div>
          <table className="table w-full mt-4">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th>Compétition</th>
                <th>Type</th>
                <th>Lieu</th>
                <th>Distance</th>
                <th>Classement</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index} className="border-b">
                  <td>{res.competition}</td>
                  <td>{res.type}</td>
                  <td>{res.lieu}</td>
                  <td>{res.distance}</td>
                  <td>{res.classement}</td>
                  <td>{res.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Carte Statistique */}
        <div className="bg-white shadow-lg rounded-lg p-4 col-span-1">
          <h2 className="font-semibold">Nombre de kilomètres parcourus par compétition</h2>
          <select
            className="select select-bordered w-full mt-2"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option>Événement 1</option>
            <option>Événement 2</option>
          </select>

          <div className="mt-4">
            <span className="text-sm">Nombre de participants du club : 4</span>
            <div className="relative w-full bg-gray-200 h-6 rounded-lg mt-2">
              <div className="bg-blue-500 h-6 rounded-lg" style={{ width: "75%" }}></div>
            </div>
            <p className="text-2xl font-bold mt-2 text-blue-700">75%</p>
          </div>
        </div>

        {/* Blocs vides */}
        <div className="bg-white shadow-lg rounded-lg h-40"></div>
        <div className="bg-white shadow-lg rounded-lg h-40"></div>
      </div>
    </div>
  );
}
