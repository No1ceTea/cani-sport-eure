"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const subCategoryMap: Record<string, number> = {
  Cross: 1,
  Trail: 2,
  Marche: 3,
  VTT: 4,
};

const ResultsPage: React.FC = () => {
  const [resultatTypes, setResultatTypes] = useState<{ id: number; nom_resultat: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTabComp, setSelectedTabComp] = useState("Cross");
  const [data, setData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedFilter = selectedCategory !== null ? selectedTabComp : "";

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("resultatType")
        .select("id, nom_resultat");

      if (error) {
        setErrorMessage("Erreur lors du chargement des catégories");
      } else if (data) {
        setResultatTypes(data);
        if (data.length > 0 && selectedCategory === null) {
          setSelectedCategory(data[0].id);
        }
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === null) return;

    const fetchData = async () => {
      setErrorMessage("");

      const { data: resultsData, error } = await supabase
        .from("resultats")
        .select(`
          *,
          chiens ( prenom ),
          profils ( nom, prenom )
        `)
        .eq("id_type", selectedCategory)
        .eq("id_categorie", subCategoryMap[selectedFilter]);

      if (error) {
        setErrorMessage("Erreur lors de la récupération des résultats");
        console.error(error);
      } else {
        setData(resultsData || []);
      }
    };

    fetchData();
  }, [selectedCategory, selectedFilter]);

  return (
    <div className="relative min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 w-full text-left">Résultats</h1>

      <div className="bg-[#475C99] p-8 rounded-3xl w-full max-w-7xl border-2 border-black min-h-[500px]">
        <div className="mb-6 text-center">
          <label className="text-white text-lg font-semibold">Afficher :</label>
          <select
            className="ml-2 p-2 border border-gray-300 rounded-lg"
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
          >
            {resultatTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nom_resultat}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white text-black p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Résultats</h2>
          <div className="flex justify-between rounded-lg overflow-hidden mb-4 p-1">
            {["Cross", "Trail", "Marche", "VTT"].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setSelectedTabComp(tab)}
                className={`flex-1 px-4 py-2 text-center border border-gray-300 mx-1 ${
                  selectedTabComp === tab
                    ? "bg-[#031F73] text-white"
                    : "bg-[#475C99] text-white border-[#475C99]"
                } ${index === 0 ? "rounded-tl-lg" : ""} ${index === 3 ? "rounded-tr-lg" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {data.length === 0 ? (
            <p className="text-center text-gray-500">Aucun résultat disponible.</p>
          ) : (
            <table className="w-full text-left mt-2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="border p-2 text-sm">Nom activité</th>
                  <th className="border p-2 text-sm">Lieu</th>
                  <th className="border p-2 text-sm">Région</th>
                  <th className="border p-2 text-sm">Distance</th>
                  <th className="border p-2 text-sm">Participant</th>
                  <th className="border p-2 text-sm">Chien</th>
                  <th className="border p-2 text-sm">Temps</th>
                  <th className="border p-2 text-sm">Min/km</th>
                  <th className="border p-2 text-sm">Vitesse</th>
                  <th className="border p-2 text-sm">Km A/R</th>
                  <th className="border p-2 text-sm">Classement</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white text-center"}
                  >
                    <td className="border p-2 text-sm text-center">{item.nomActivite}</td>
                    <td className="border p-2 text-sm text-center">{item.lieu}</td>
                    <td className="border p-2 text-sm text-center">{item.region}</td>
                    <td className="border p-2 text-sm text-center">{item.distance}</td>
                    <td className="border p-2 text-sm text-center">
                      {item.profils ? `${item.profils.nom} ${item.profils.prenom}` : ""}
                    </td>
                    <td className="border p-2 text-sm text-center">{item.chiens?.prenom}</td>
                    <td className="border p-2 text-sm text-center">{item.temps}</td>
                    <td className="border p-2 text-sm text-center">{item.minKm}</td>
                    <td className="border p-2 text-sm text-center">{item.vitesse}</td>
                    <td className="border p-2 text-sm text-center">{item.kmAR}</td>
                    <td className="border p-2 text-sm text-center">{item.classement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
