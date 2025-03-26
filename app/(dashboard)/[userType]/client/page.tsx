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
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState<{ participants: number; kmParcourus: number; kmMax: number }>({ participants: 0, kmParcourus: 0, kmMax: 0 });
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [eventMap, setEventMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession.session) return router.replace("/connexion");

      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) return router.replace("/connexion");

      const uid = userData.user.id;
      setUserId(uid);

      const isAdmin = userData.user.user_metadata?.administrateur === true;
      if (isAdmin) return router.replace("/dashboard/admin");

      setUserType("client");

      const { data: results } = await supabase
        .from("resultats")
        .select(`nomActivite, lieu, distance, classement, date, id_type, type:titre`)
        .eq("id_profil", uid)
        .order("date", { ascending: false })
        .limit(5);

      if (results) setResultsData(results);

      const { data: participations } = await supabase
        .from("participation")
        .select("id_evenement")
        .eq("id_profil", uid);

      const eventIds = participations?.map((p: any) => p.id_evenement) || [];

      const { data: events } = await supabase
        .from("evenements")
        .select("id, titre")
        .in("id", eventIds);

      const names = events?.map((e: any) => e.titre) || [];
      const map: Record<string, number> = {};
      events?.forEach((e: any) => (map[e.titre] = e.id));

      setEventNames(names);
      setEventMap(map);

      if (names.length > 0) setSelectedEvent(names[0]);

      setIsLoading(false);
    };

    fetchData();
  }, [router, supabase]);

  useEffect(() => {
    const fetchStatsForEvent = async () => {
      if (!userId || !selectedEvent || !eventMap[selectedEvent]) return;

      const eventId = eventMap[selectedEvent];

      const { data: participants } = await supabase
        .from("participation")
        .select("id")
        .eq("id_evenement", eventId);

      const { data: distances } = await supabase
        .from("resultats")
        .select("distance")
        .eq("id_profil", userId)
        .eq("nomActivite", selectedEvent);

      const kmParcourus = distances?.reduce((sum: number, res: any) => sum + parseFloat(res.distance || 0), 0) || 0;
      const kmMax = (participants?.length || 0) * 15; // valeur hypothétique

      setEventStats({
        participants: participants?.length || 0,
        kmParcourus,
        kmMax,
      });
    };

    fetchStatsForEvent();
  }, [selectedEvent, userId, supabase, eventMap]);

  if (isLoading) return <p>Chargement...</p>;
  if (!userType) return null;

  const pourcentage = Math.round((eventStats.kmParcourus / eventStats.kmMax) * 100);

  return (
    <div>
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
                {resultsData.map((res, index) => (
                  <tr key={index} className="border-b">
                    <td>{res.nomActivite}</td>
                    <td>{res.type || "N/A"}</td>
                    <td>{res.lieu}</td>
                    <td>{res.distance} km</td>
                    <td>{res.classement}</td>
                    <td>{new Date(res.date).toLocaleDateString()}</td>
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
              {eventNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>

            <div className="mt-4">
              <span className="text-sm">Nombre de participants du club : {eventStats.participants}</span>
              <div className="relative w-full bg-gray-200 h-6 rounded-lg mt-2">
                <div className="bg-blue-500 h-6 rounded-lg" style={{ width: `${pourcentage}%` }}></div>
              </div>
              <p className="text-2xl font-bold mt-2 text-blue-700">{pourcentage}%</p>
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
};

export default ClientDashboardPage;
