"use client"; // Indique que ce composant s'exécute côté client

import { useEffect, useState } from "react"; // Hooks React pour les effets et états
import { useRouter, usePathname } from "next/navigation"; // Hooks de navigation Next.js
import SidebarAdmin from "../../../components/SidebarAdmin"; // Barre latérale admin
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Client Supabase
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification

export default function DashboardPage() {
  const router = useRouter(); // Pour la navigation programmatique
  const pathname = usePathname(); // Pour obtenir le chemin actuel
  const supabase = createClientComponentClient(); // Initialisation du client Supabase
  const { role, isLoading } = useAuth(); // Récupération du rôle utilisateur et état de chargement

  // États pour les filtres et sélections
  const [selectedEvent, setSelectedEvent] = useState("Nom événements"); // Événement sélectionné
  const [selectedActivity, setSelectedActivity] = useState<string>(""); // Activité sélectionnée
  const [selectedProfil, setSelectedProfil] = useState<string>(""); // Profil utilisateur sélectionné

  // États pour les données depuis la base de données
  const [resultats, setResultats] = useState<any[]>([]); // Résultats sportifs
  const [evenements, setEvenements] = useState<any[]>([]); // Liste des événements
  const [participants, setParticipants] = useState<any[]>([]); // Liste des participations
  const [activityNames, setActivityNames] = useState<string[]>([]); // Noms d'activités uniques
  const [profilNoms, setProfilNoms] = useState<string[]>([]); // Noms des profils

  // États pour les statistiques
  const [eventParticipantCount, setEventParticipantCount] = useState(0); // Nombre de participants par événement
  const [kmParcourus, setKmParcourus] = useState(0); // Kilomètres parcourus
  const [kmMax, setKmMax] = useState(0); // Objectif de kilomètres
  const [totalUsers, setTotalUsers] = useState<number>(0); // Nombre total d'utilisateurs
  const [totalChiens, setTotalChiens] = useState<number>(0); // Nombre total de chiens
  const [totalDocuments, setTotalDocuments] = useState<number>(0); // Nombre total de documents
  const [totalKmClub, setTotalKmClub] = useState<number>(0); // Total des kilomètres du club

  // Effet pour charger les données principales et calculer les statistiques
  useEffect(() => {
    const fetchData = async () => {
      // Récupération des différentes données depuis Supabase
      const { data: resultatsData } = await supabase.from("resultats").select("*, profils(prenom, nom)");
      const { data: evenementsData } = await supabase.from("evenements").select("*");
      const { data: participationData } = await supabase.from("participation").select("*");
      const { data: allResults } = await supabase.from("resultats").select("nomActivite, distance, profils(prenom, nom)");

      // Mise à jour des états avec les données récupérées
      setResultats(resultatsData || []);
      setEvenements(evenementsData || []);
      setParticipants(participationData || []);

      if (allResults) {
        // Extraction des activités uniques
        const uniqueActivities = [...new Set(allResults.map((res: any) => res.nomActivite).filter(Boolean))];
        setActivityNames(uniqueActivities);
        if (uniqueActivities.length > 0) setSelectedActivity(uniqueActivities[0]);

        // Calcul du total des kilomètres pour le club
        const totalKm = allResults.map(r => parseFloat(r.distance)).filter(k => !isNaN(k)).reduce((acc, val) => acc + val, 0);
        setTotalKmClub(totalKm);

        // Extraction des profils uniques
        const uniquePrenoms = [...new Set(allResults.map((r: any) => r.profils?.prenom).filter(Boolean))];
        setProfilNoms(uniquePrenoms);
        if (uniquePrenoms.length > 0) setSelectedProfil(uniquePrenoms[0]);
      }

      // Calcul des statistiques pour l'événement sélectionné
      if (selectedEvent !== "Nom événements") {
        const selected = evenementsData?.find(e => e.titre === selectedEvent);
        const resultatsFiltres = resultatsData?.filter(r => r.id_evenement === selected?.id) || [];
        const participationFiltree = participationData?.filter(p => p.id_evenement === selected?.id) || [];

        const kmRealises = resultatsFiltres.map(r => parseFloat(r.distance)).filter(k => !isNaN(k)).reduce((acc, val) => acc + val, 0);
        const kmPrevus = participationFiltree.length * 10; // 10km par participant comme objectif

        setEventParticipantCount(participationFiltree.length);
        setKmParcourus(kmRealises);
        setKmMax(kmPrevus);
      }
    };

    // Récupération des statistiques globales
    const fetchStats = async () => {
      // Requêtes parallèles pour les statistiques
      const [{ count: userCount }, { count: chienCount }, { count: docCount }] = await Promise.all([
        supabase.from("profils").select("id", { count: "exact", head: true }),
        supabase.from("chiens").select("id", { count: "exact", head: true }),
        supabase.from("club_documents").select("id", { count: "exact", head: true }),
      ]);
      
      // Mise à jour des compteurs
      if (userCount !== null) setTotalUsers(userCount);
      if (chienCount !== null) setTotalChiens(chienCount);
      if (docCount !== null) setTotalDocuments(docCount);
    };

    // Exécution des requêtes uniquement si l'utilisateur est admin
    if (role === "admin") {
      fetchData();
      fetchStats();
    }
  }, [role, selectedEvent]); // Relancer si le rôle ou l'événement change

  // Protection de la route - redirection si non admin
  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [isLoading, role]);

  // Calculs pour les statistiques d'affichage
  const kmPourcentage = kmMax > 0 ? Math.min((kmParcourus / kmMax) * 100, 100) : 0; // Pourcentage de km réalisés
  const countByType = (type: string) => evenements.filter(ev => ev.type?.toLowerCase() === type.toLowerCase()).length; // Nombre d'événements par type
  const pourcentageExterne = evenements.length > 0 ? Math.round((countByType("externe") / evenements.length) * 100) : 0; // Pourcentage d'événements externes

  // Filtrage des résultats par profil sélectionné
  const filteredResultats = resultats.filter(r => r.profils?.prenom === selectedProfil);

  // Affichage d'un indicateur de chargement
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg">Chargement...</p></div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin /> {/* Barre latérale d'administration */}
      
      <main className="flex-1 p-8 py-16 overflow-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Cartes de statistiques globales */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Total adhérents</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Total chiens</h3>
            <p className="text-3xl font-bold">{totalChiens}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Documents uploadés</h3>
            <p className="text-3xl font-bold">{totalDocuments}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Total km parcourus (club)</h3>
            <p className="text-3xl font-bold">{totalKmClub.toFixed(1)} km</p>
          </div>

          {/* Graphique de répartition des événements */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold mb-4">Répartition des évènements</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#2f4591] rounded-sm" /> {/* Carré de couleur pour légende */}
                  <span className="text-sm italic text-gray-800">Externe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#d9e1f2] rounded-sm" /> {/* Carré de couleur pour légende */}
                  <span className="text-sm italic text-gray-800">Interne</span>
                </div>
              </div>
              <div className="relative w-20 h-20">
                {/* Graphique circulaire */}
                <div className="radial-progress text-[#2f4591]" style={{ "--value": pourcentageExterne, "--size": "5rem", "--thickness": "8px" } as React.CSSProperties}>
                  <span className="text-black text-lg">{pourcentageExterne} %</span>
                </div>
              </div>
            </div>
          </div>

          {/* Suivi des kilomètres parcourus par événement */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Kilomètres parcourus</h3>
            {/* Sélection de l'événement */}
            <select className="select select-bordered w-full mb-4" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              <option>Nom événements</option>
              {evenements.map((ev) => (
                <option key={ev.id}>{ev.titre}</option>
              ))}
            </select>
            <p>Participants : {eventParticipantCount}</p>
            {/* Barre de progression */}
            <progress className="progress progress-primary w-full mt-2" value={kmPourcentage} max="100"></progress>
            <p className="text-sm text-gray-600 mt-2">Réalisés : {kmParcourus.toFixed(1)} km / Max : {kmMax.toFixed(1)} km</p>
          </div>

          {/* Tableau de performance par adhérent */}
          <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
            <h3 className="text-xl font-bold mb-4">Performance par adhérent</h3>
            {/* Sélection du profil */}
            <select className="select select-bordered w-full max-w-xs mb-4" value={selectedProfil} onChange={(e) => setSelectedProfil(e.target.value)}>
              {profilNoms.map((prenom, index) => (
                <option key={index} value={prenom}>{prenom}</option>
              ))}
            </select>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Prénom</th>
                    <th className="px-4 py-2 text-left">Lieu</th>
                    <th className="px-4 py-2 text-left">Distance</th>
                    <th className="px-4 py-2 text-left">Classement</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Listing des résultats de l'adhérent sélectionné */}
                  {filteredResultats.map((res, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="px-4 py-2">{res.profils?.prenom}</td>
                      <td className="px-4 py-2">{res.lieu}</td>
                      <td className="px-4 py-2">{res.distance}</td>
                      <td className="px-4 py-2">{res.classement}</td>
                      <td className="px-4 py-2">{res.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tableau des résultats du club */}
          <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
            <h3 className="text-xl font-bold mb-4">Résultats du club</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Adhérents</th>
                    <th className="px-4 py-2 text-left">Compétition</th>
                    <th className="px-4 py-2 text-left">Lieu</th>
                    <th className="px-4 py-2 text-left">Distance</th>
                    <th className="px-4 py-2 text-left">Classement</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Listing de tous les résultats */}
                  {resultats.map((res, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="px-4 py-2">{res.profils?.prenom} {res.profils?.nom}</td>
                      <td className="px-4 py-2">{res.nomActivite}</td>
                      <td className="px-4 py-2">{res.lieu}</td>
                      <td className="px-4 py-2">{res.distance}</td>
                      <td className="px-4 py-2">{res.classement}</td>
                      <td className="px-4 py-2">{res.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
