"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/app/components/Auth/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("Nom événements");
  const [resultats, setResultats] = useState<any[]>([]);
  const [evenements, setEvenements] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [eventParticipantCount, setEventParticipantCount] = useState(0);
  const [kmParcourus, setKmParcourus] = useState(0);
  const [kmMax, setKmMax] = useState(0);
  const supabase = createClientComponentClient();
  const { role, isLoading } = useAuth();
  const [activityNames, setActivityNames] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: resultatsData } = await supabase.from("resultats").select("*, profils(prenom, nom)");
      const { data: evenementsData } = await supabase.from("evenements").select("*");
      const { data: participationData } = await supabase.from("participation").select("*");
      const { data: allResults } = await supabase
        .from("resultats")
        .select("nomActivite");

      if (allResults) {
        const uniqueActivities = [...new Set(allResults.map((res: any) => res.nomActivite).filter(Boolean))];
        setActivityNames(uniqueActivities);
        if (uniqueActivities.length > 0) setSelectedActivity(uniqueActivities[0]);
      }

      setResultats(resultatsData || []);
      setEvenements(evenementsData || []);
      setParticipants(participationData || []);

      if (selectedEvent !== "Nom événements") {
        const selected = evenementsData?.find(e => e.titre === selectedEvent);
        const resultatsFiltres = resultatsData?.filter(r => r.id_evenement === selected?.id) || [];
        const participationFiltree = participationData?.filter(p => p.id_evenement === selected?.id) || [];

        const kmRealises = resultatsFiltres
          .map(r => parseFloat(r.distance))
          .filter(k => !isNaN(k))
          .reduce((acc, val) => acc + val, 0);
        const kmPrevus = participationFiltree.length * 10;

        setEventParticipantCount(participationFiltree.length);
        setKmParcourus(kmRealises);
        setKmMax(kmPrevus);
      }
    };

    if (role === "admin") {
      fetchData();
    }

  }, [role, selectedEvent]);

  const kmPourcentage = kmMax > 0 ? Math.min((kmParcourus / kmMax) * 100, 100) : 0;

  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [isLoading, role]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  const countByType = (type: string) => evenements.filter(ev => ev.type?.toLowerCase() === type.toLowerCase()).length;
  const total = evenements.length;
  const externe = countByType("externe");
  const pourcentageExterne = total > 0 ? Math.round((externe / total) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

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

          {/* Performance par adhérent */}
          <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
            <h3 className="text-xl font-bold mb-4">Performance par adhérent</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Adhérent</th>
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

          {/* Nombre de participants par événements - version maquette */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <h3 className="text-md font-semibold mb-4">Nombre de participants par évènements</h3>
            <select
              className="select select-bordered w-full max-w-xs mb-4"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option>Nom événements</option>
              {evenements.map((ev) => (
                <option key={ev.id}>{ev.titre}</option>
              ))}
            </select>
            <div className="relative w-20 h-20">
              <div className="radial-progress text-[#2f4591]" style={{ "--value": eventParticipantCount * 10, "--size": "5rem", "--thickness": "8px" } as React.CSSProperties}>
                <span className="text-black text-lg">{eventParticipantCount * 10} %</span>
              </div>
            </div>
          </div>

          {/* Nombre de kilomètres parcourus */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Nombre de kilomètres parcourus par compétition</h3>
            <select
              className="select select-bordered w-full mb-4"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option>Nom événements</option>
              {evenements.map((ev) => (
                <option key={ev.id}>{ev.titre}</option>
              ))}
            </select>
            <p>Nombre de participants du club : {eventParticipantCount}</p>
            <div className="flex items-center mt-3">
              <progress className="progress progress-primary w-full" value={kmPourcentage} max="100"></progress>
              <span className="ml-3 text-xl font-bold">{kmPourcentage.toFixed(0)}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Km parcourus par les participants ({kmParcourus.toFixed(1)} km)</p>
            <p className="text-sm text-gray-600">Km parcourus maximal ({kmMax.toFixed(1)} km)</p>
          </div>

          {/* Nombre d'événements (style maquette) */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold mb-4">Nombre d’évènement</h3>
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

          {/* Statistiques par activité (via nomActivite) */}
          <div className="bg-white shadow-lg rounded-lg p-4 col-span-1">
            <h2 className="font-semibold">Activité : statistiques</h2>
            <select
              className="select select-bordered w-full mt-2"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              {activityNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>

            {selectedActivity && (
              <div className="mt-4">
                <p className="text-gray-700 text-sm">Activité sélectionnée : <strong>{selectedActivity}</strong></p>
                {/* Tu peux ajouter ici d'autres infos, ou des stats personnalisées à partir de selectedActivity */}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
