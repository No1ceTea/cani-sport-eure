// ✅ VERSION FULLY RESPONSIVE
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../../../components/Auth/AuthProvider";

import Sidebar from "@/app/components/sidebars/Sidebar";
import Footer from "@/app/components/sidebars/Footer";

const ClientDashboardPage: React.FC = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, role, isLoading } = useAuth();

  const [userId, setUserId] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState({ participants: 0, kmParcourus: 0, kmMax: 0 });
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [eventMap, setEventMap] = useState<Record<string, number>>({});
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [activityNames, setActivityNames] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [dog, setDog] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || (role !== "adherent" && role !== "admin"))) {
      router.replace("/connexion");
    }
  }, [isLoading, user, role]);

  useEffect(() => {
    const fetchData = async () => {
      const uid = user?.id;
      if (!uid) return;

      setUserId(uid);

      const { data: allResults } = await supabase
        .from("resultats")
        .select("nomActivite")
        .eq("id_profil", uid);

      if (allResults) {
        const uniqueActivities = [...new Set(allResults.map((res: any) => res.nomActivite).filter(Boolean))];
        setActivityNames(uniqueActivities);
        if (uniqueActivities.length > 0) setSelectedActivity(uniqueActivities[0]);
      }

      const { data: results } = await supabase
        .from("resultats")
        .select("nomActivite, lieu, distance, classement, date, id_type")
        .eq("id_profil", uid)
        .order("date", { ascending: false });

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

      const { data: chien } = await supabase
        .from("chiens")
        .select("*")
        .eq("id_profil", uid)
        .limit(1)
        .single();

      setDog(chien || null);
    };

    if (!isLoading && user) fetchData();
  }, [isLoading, user]);

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
        .eq("id_evenement", eventId);

      const kmParcourus = distances?.reduce((sum: number, res: any) => sum + parseFloat(res.distance || 0), 0) || 0;
      const kmMax = (participants?.length || 0) * 15;

      setEventStats({
        participants: participants?.length || 0,
        kmParcourus,
        kmMax,
      });
    };

    fetchStatsForEvent();
  }, [selectedEvent, userId, supabase, eventMap]);

  if (isLoading || !user || (role !== "adherent" && role !== "admin")) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  const pourcentage = eventStats.kmMax > 0 ? Math.round((eventStats.kmParcourus / eventStats.kmMax) * 100) : 0;
  const totalKm = resultsData.reduce((sum, r) => sum + parseFloat(r.distance || 0), 0);
  const bestRank = resultsData.reduce((min, r) => Math.min(min, parseInt(r.classement || "999")), 999);
  const podiums = resultsData.filter((r) => parseInt(r.classement || "999") <= 3).length;
  const lastResult = [...resultsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Dernière compétition</h2>
            {lastResult ? (
              <p>{lastResult.nomActivite} à {lastResult.lieu} – {lastResult.distance} km – Classement : {lastResult.classement}</p>
            ) : <p>Aucune donnée.</p>}
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Distance totale parcourue</h2>
            <p className="text-blue-700 text-xl font-bold">{totalKm.toFixed(1)} km</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Podiums</h2>
            <p className="text-blue-700 text-xl font-bold">{podiums}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Meilleur classement</h2>
            <p className="text-blue-700 text-xl font-bold">{bestRank === 999 ? "N/A" : bestRank + "ᵒ"}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Mon compagnon</h2>
            {dog ? (
              <>
                <p><strong>Nom:</strong> {dog.prenom}</p>
                <p><strong>Race:</strong> {dog.race}</p>
                <p><strong>Âge:</strong> {dog.age} ans</p>
              </>
            ) : <p>Pas de chien enregistré.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow rounded p-4">
            <div className="border-b pb-2 mb-4 flex flex-wrap gap-2">
              <button className="font-bold border-b-2 border-blue-500">Mes derniers résultats</button>
              <button className="text-gray-500">Voir tous mes résultats</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2 text-left">Compétition</th>
                    <th className="p-2 text-left">Lieu</th>
                    <th className="p-2 text-left">Distance</th>
                    <th className="p-2 text-left">Classement</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsData.map((res, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{res.nomActivite}</td>
                      <td className="p-2">{res.lieu}</td>
                      <td className="p-2">{res.distance} km</td>
                      <td className="p-2">{res.classement}</td>
                      <td className="p-2">{new Date(res.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-2">Kilomètres parcourus par compétition</h2>
            <select
              className="w-full mt-2 p-2 border rounded"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              {eventNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
            <div className="mt-4">
              <p className="text-sm">Participants du club : {eventStats.participants}</p>
              <div className="relative w-full bg-gray-200 h-6 rounded mt-2">
                <div className="bg-blue-500 h-6 rounded" style={{ width: `${pourcentage}%` }}></div>
              </div>
              <p className="text-blue-700 text-xl font-bold mt-2">{pourcentage}%</p>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500"></div>
                  <span>Km parcourus ({eventStats.kmParcourus.toFixed(1)} km)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300"></div>
                  <span>Objectif ({eventStats.kmMax.toFixed(1)} km)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-2">Activité : statistiques</h2>
            <select
              className="w-full mt-2 p-2 border rounded"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              {activityNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>

            {selectedActivity && (
              <p className="text-gray-700 text-sm mt-4">Activité sélectionnée : <strong>{selectedActivity}</strong></p>
            )}
          </div>
        </div>
      </div>

      <Sidebar />
      <Footer />
    </div>
  );
};

export default ClientDashboardPage;