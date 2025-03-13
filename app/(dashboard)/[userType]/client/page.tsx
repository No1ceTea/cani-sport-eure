"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Sidebar from "@/app/components/sidebars/Sidebar";
import Footer from "@/app/components/sidebars/Footer";

const ClientDashboardPage: React.FC = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userType, setUserType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("Événement 1");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Données fictives
  const results = [
    { competition: "Course nationale", type: "Trail", lieu: "Vernon", distance: "15km", classement: "12ème", date: "12/09/2025" },
    { competition: "Course régionale", type: "Cross", lieu: "Vernon", distance: "15km", classement: "12ème", date: "12/09/2025" },
    { competition: "Course départementale", type: "Cross", lieu: "Vernon", distance: "15km", classement: "12ème", date: "12/09/2025" },
  ];


  useEffect(() => {
    const checkUser = async () => {
      // 🔹 Vérifie si l'utilisateur est connecté
      const { data: userSession } = await supabase.auth.getSession();
  
      if (!userSession.session) {
        console.log("🔴 Utilisateur non connecté, redirection vers /connexion");
        router.replace("/connexion");
        return;
      }
  
      // 🔹 Récupère les données utilisateur
      const { data: userData, error } = await supabase.auth.getUser();
  
      if (error || !userData?.user) {
        console.log("❌ Erreur lors de la récupération de l'utilisateur :", error);
        router.replace("/connexion");
        return;
      }
  
      console.log("🔍 Données de l'utilisateur :", userData.user.user_metadata);
  
      // ✅ Stocke l'UUID de l'utilisateur
      setUserId(userData.user.id);
  
      const isAdmin = userData.user.user_metadata?.administrateur === true;
  
      if (isAdmin) {
        console.log("🔴 Admin détecté, redirection vers /dashboard/admin");
        router.replace("/dashboard/admin");
      } else {
        console.log("✅ Utilisateur adhérent détecté, accès autorisé !");
        setUserType("client");
      }
      
      console.log(userData.user.id)

      setIsLoading(false);
    };
  
    checkUser();
  }, [router, supabase.auth]);
  

  if (isLoading) return <p>Chargement...</p>;
  if (!userType) return null; // 🔹 Évite l'affichage du contenu avant redirection

  return (
    <div  className="">
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
      <Sidebar />
      <Footer />
    </div>
  );
}

export default ClientDashboardPage;
