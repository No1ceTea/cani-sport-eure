// ✅ VERSION FULLY RESPONSIVE
"use client"; // Indique que ce composant s'exécute côté client

import { useEffect, useState } from "react"; // Hooks React pour les effets et l'état
import { useRouter } from "next/navigation"; // Navigation entre pages
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Client Supabase
import { useAuth } from "../../../components/Auth/AuthProvider"; // Contexte d'authentification

import Sidebar from "@/app/components/sidebars/Sidebar"; // Barre latérale
import Footer from "@/app/components/sidebars/Footer"; // Pied de page

const ClientDashboardPage: React.FC = () => {
  const router = useRouter(); // Hook de navigation
  const supabase = createClientComponentClient(); // Initialisation du client Supabase
  const { user, role, isLoading } = useAuth(); // Récupération des données d'authentification

  // États pour stocker les données du tableau de bord
  const [userId, setUserId] = useState<string | null>(null); // ID de l'utilisateur
  const [resultsData, setResultsData] = useState<any[]>([]); // Résultats sportifs
  const [eventStats, setEventStats] = useState({ participants: 0, kmParcourus: 0, kmMax: 0 }); // Statistiques par événement
  const [eventNames, setEventNames] = useState<string[]>([]); // Liste des noms d'événements
  const [eventMap, setEventMap] = useState<Record<string, number>>({}); // Mapping nom->id des événements
  const [selectedEvent, setSelectedEvent] = useState<string>(""); // Événement sélectionné
  const [activityNames, setActivityNames] = useState<string[]>([]); // Liste des activités sportives
  const [selectedActivity, setSelectedActivity] = useState<string>(""); // Activité sélectionnée
  const [dog, setDog] = useState<any | null>(null); // Données du chien de l'utilisateur

  // Protection de la route - redirection si non connecté ou non autorisé
  useEffect(() => {
    if (!isLoading && (!user || (role !== "adherent" && role !== "admin"))) {
      router.replace("/connexion");
    }
  }, [isLoading, user, role]);

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      const uid = user?.id;
      if (!uid) return;

      setUserId(uid);

      // Récupération des activités uniques de l'utilisateur
      const { data: allResults } = await supabase
        .from("resultats")
        .select("nomActivite")
        .eq("id_profil", uid);

      if (allResults) {
        const uniqueActivities = [...new Set(allResults.map((res: any) => res.nomActivite).filter(Boolean))];
        setActivityNames(uniqueActivities);
        if (uniqueActivities.length > 0) setSelectedActivity(uniqueActivities[0]);
      }

      // Récupération des résultats sportifs
      const { data: results } = await supabase
        .from("resultats")
        .select("nomActivite, lieu, distance, classement, date, id_type")
        .eq("id_profil", uid)
        .order("date", { ascending: false });

      if (results) setResultsData(results);

      // Récupération des participations aux événements
      const { data: participations } = await supabase
        .from("participation")
        .select("id_evenement")
        .eq("id_profil", uid);

      const eventIds = participations?.map((p: any) => p.id_evenement) || [];

      // Récupération des détails des événements
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

      // Récupération des données du chien
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

  // Chargement des statistiques pour l'événement sélectionné
  useEffect(() => {
    const fetchStatsForEvent = async () => {
      if (!userId || !selectedEvent || !eventMap[selectedEvent]) return;

      const eventId = eventMap[selectedEvent];

      // Récupération du nombre de participants
      const { data: participants } = await supabase
        .from("participation")
        .select("id")
        .eq("id_evenement", eventId);

      // Récupération des distances parcourues
      const { data: distances } = await supabase
        .from("resultats")
        .select("distance")
        .eq("id_profil", userId)
        .eq("id_evenement", eventId);

      const kmParcourus = distances?.reduce((sum: number, res: any) => sum + parseFloat(res.distance || 0), 0) || 0;
      const kmMax = (participants?.length || 0) * 15; // Calcul de l'objectif (15km par participant)

      setEventStats({
        participants: participants?.length || 0,
        kmParcourus,
        kmMax,
      });
    };

    fetchStatsForEvent();
  }, [selectedEvent, userId, supabase, eventMap]);

  // Affichage d'un chargement pendant la récupération des données
  if (isLoading || !user || (role !== "adherent" && role !== "admin")) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // Calculs pour les statistiques d'affichage
  const pourcentage = eventStats.kmMax > 0 ? Math.round((eventStats.kmParcourus / eventStats.kmMax) * 100) : 0;
  const totalKm = resultsData.reduce((sum, r) => sum + parseFloat(r.distance || 0), 0); // Distance totale
  const bestRank = resultsData.reduce((min, r) => Math.min(min, parseInt(r.classement || "999")), 999); // Meilleur classement
  const podiums = resultsData.filter((r) => parseInt(r.classement || "999") <= 3).length; // Nombre de podiums
  const lastResult = [...resultsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]; // Dernier résultat

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        {/* Titre principal */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tableau de bord</h1>

        {/* Cartes de statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Carte de dernière compétition */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Dernière compétition</h2>
            {lastResult ? (
              <p>{lastResult.nomActivite} à {lastResult.lieu} – {lastResult.distance} km – Classement : {lastResult.classement}</p>
            ) : <p>Aucune donnée.</p>}
          </div>

          {/* Carte de distance totale */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Distance totale parcourue</h2>
            <p className="text-blue-700 text-xl font-bold">{totalKm.toFixed(1)} km</p>
          </div>

          {/* Carte des podiums */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Podiums</h2>
            <p className="text-blue-700 text-xl font-bold">{podiums}</p>
          </div>

          {/* Carte du meilleur classement */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-1">Meilleur classement</h2>
            <p className="text-blue-700 text-xl font-bold">{bestRank === 999 ? "N/A" : bestRank + "ᵒ"}</p>
          </div>

          {/* Carte du chien */}
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

        {/* Section des résultats et statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Tableau des résultats récents */}
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
                  {/* Liste des résultats */}
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

          {/* Graphique des kilomètres par compétition */}
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
              {/* Barre de progression */}
              <div className="relative w-full bg-gray-200 h-6 rounded mt-2">
                <div className="bg-blue-500 h-6 rounded" style={{ width: `${pourcentage}%` }}></div>
              </div>
              <p className="text-blue-700 text-xl font-bold mt-2">{pourcentage}%</p>

              {/* Légende du graphique */}
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

          {/* Statistiques par activité */}
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

      <Sidebar /> {/* Barre latérale de navigation */}
      <Footer /> {/* Pied de page */}
    </div>
  );
};

export default ClientDashboardPage;