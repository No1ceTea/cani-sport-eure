"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/app/components/Auth/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const { role, isLoading } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState("Nom événements");
  const [resultats, setResultats] = useState<any[]>([]);
  const [evenements, setEvenements] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activityNames, setActivityNames] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [selectedProfil, setSelectedProfil] = useState<string>("");
  const [profilNoms, setProfilNoms] = useState<string[]>([]);

  const [eventParticipantCount, setEventParticipantCount] = useState(0);
  const [kmParcourus, setKmParcourus] = useState(0);
  const [kmMax, setKmMax] = useState(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalChiens, setTotalChiens] = useState<number>(0);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [totalKmClub, setTotalKmClub] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: resultatsData } = await supabase.from("resultats").select("*, profils(prenom, nom)");
      const { data: evenementsData } = await supabase.from("evenements").select("*");
      const { data: participationData } = await supabase.from("participation").select("*");
      const { data: allResults } = await supabase.from("resultats").select("nomActivite, distance, profils(prenom, nom)");

      setResultats(resultatsData || []);
      setEvenements(evenementsData || []);
      setParticipants(participationData || []);

      if (allResults) {
        const uniqueActivities = [...new Set(allResults.map((res: any) => res.nomActivite).filter(Boolean))];
        setActivityNames(uniqueActivities);
        if (uniqueActivities.length > 0) setSelectedActivity(uniqueActivities[0]);

        const totalKm = allResults.map(r => parseFloat(r.distance)).filter(k => !isNaN(k)).reduce((acc, val) => acc + val, 0);
        setTotalKmClub(totalKm);

        const uniquePrenoms = [...new Set(allResults.map((r: any) => r.profils?.prenom).filter(Boolean))];
        setProfilNoms(uniquePrenoms);
        if (uniquePrenoms.length > 0) setSelectedProfil(uniquePrenoms[0]);
      }

      if (selectedEvent !== "Nom événements") {
        const selected = evenementsData?.find(e => e.titre === selectedEvent);
        const resultatsFiltres = resultatsData?.filter(r => r.id_evenement === selected?.id) || [];
        const participationFiltree = participationData?.filter(p => p.id_evenement === selected?.id) || [];

        const kmRealises = resultatsFiltres.map(r => parseFloat(r.distance)).filter(k => !isNaN(k)).reduce((acc, val) => acc + val, 0);
        const kmPrevus = participationFiltree.length * 10;

        setEventParticipantCount(participationFiltree.length);
        setKmParcourus(kmRealises);
        setKmMax(kmPrevus);
      }
    };

    const fetchStats = async () => {
      const [{ count: userCount }, { count: chienCount }, { count: docCount }] = await Promise.all([
        supabase.from("profils").select("id", { count: "exact", head: true }),
        supabase.from("chiens").select("id", { count: "exact", head: true }),
        supabase.from("club_documents").select("id", { count: "exact", head: true }),
      ]);
      if (userCount !== null) setTotalUsers(userCount);
      if (chienCount !== null) setTotalChiens(chienCount);
      if (docCount !== null) setTotalDocuments(docCount);
    };

    if (role === "admin") {
      fetchData();
      fetchStats();
    }
  }, [role, selectedEvent]);

  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [isLoading, role]);

  const kmPourcentage = kmMax > 0 ? Math.min((kmParcourus / kmMax) * 100, 100) : 0;
  const countByType = (type: string) => evenements.filter(ev => ev.type?.toLowerCase() === type.toLowerCase()).length;
  const pourcentageExterne = evenements.length > 0 ? Math.round((countByType("externe") / evenements.length) * 100) : 0;

  const filteredResultats = resultats.filter(r => r.profils?.prenom === selectedProfil);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg">Chargement...</p></div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


          {/* Statistiques globales */}
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

          {/* Carte des événements */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold mb-4">Répartition des évènements</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#2f4591] rounded-sm" />
                  <span className="text-sm italic text-gray-800">Externe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#d9e1f2] rounded-sm" />
                  <span className="text-sm italic text-gray-800">Interne</span>
                </div>
              </div>
              <div className="relative w-20 h-20">
                <div className="radial-progress text-[#2f4591]" style={{ "--value": pourcentageExterne, "--size": "5rem", "--thickness": "8px" } as React.CSSProperties}>
                  <span className="text-black text-lg">{pourcentageExterne} %</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kilomètres parcourus */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Kilomètres parcourus</h3>
            <select className="select select-bordered w-full mb-4" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              <option>Nom événements</option>
              {evenements.map((ev) => (
                <option key={ev.id}>{ev.titre}</option>
              ))}
            </select>
            <p>Participants : {eventParticipantCount}</p>
            <progress className="progress progress-primary w-full mt-2" value={kmPourcentage} max="100"></progress>
            <p className="text-sm text-gray-600 mt-2">Réalisés : {kmParcourus.toFixed(1)} km / Max : {kmMax.toFixed(1)} km</p>
          </div>

          

          {/* Performance par adhérent */}
          <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
            <h3 className="text-xl font-bold mb-4">Performance par adhérent</h3>
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


          

           {/* Résultats du club */}
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
