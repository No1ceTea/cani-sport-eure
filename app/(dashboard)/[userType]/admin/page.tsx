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

  useEffect(() => {
    const fetchData = async () => {
      const { data: resultatsData } = await supabase.from("resultats").select("*, profils(prenom, nom)");
      const { data: evenementsData } = await supabase.from("evenements").select("*");
      const { data: participationData } = await supabase.from("participation").select("*");

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

  console.log("Page admin — isLoading:", isLoading, "role:", role);

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

          {/* Nombre de participants par événements */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Nombre de participants par événements</h3>
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
            <div className="flex flex-col items-center">
              <div className="radial-progress text-blue-500" style={{ "--value": eventParticipantCount * 10 } as React.CSSProperties}>
                {eventParticipantCount}
              </div>
              <p className="mt-2 text-sm text-gray-600">participants</p>
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

          {/* Nombre d'événements */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Nombre d&apos;événements</h3>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-blue-500"></div>
              <span>Externe</span>
              <div className="h-4 w-4 bg-gray-300"></div>
              <span>Interne</span>
            </div>
            <div className="flex flex-col items-center mt-4">
              <div className="radial-progress text-blue-500" style={{ "--value": evenements.length * 10 } as React.CSSProperties}>
                {evenements.length}
              </div>
              <p className="mt-2 text-sm text-gray-600">événements</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}