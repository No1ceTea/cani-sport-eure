"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 1) Initialiser Supabase avec vos variables d'environnement
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2) Enum pour distinguer "Compétition" et "Événements"
enum CategoryGeneral {
  Competition = "Compétition",
  Event = "Événements",
}

// 3) Mapping entre l'enum et la colonne id_type de votre table resultats
//    (Adaptez les valeurs si nécessaire)
const categoryTypeMap: Record<CategoryGeneral, number> = {
  [CategoryGeneral.Competition]: 1, // Par ex. 1 = Compétition
  [CategoryGeneral.Event]: 2,       // Par ex. 2 = Événements
};

// 4) Mapping pour la colonne id_categorie (Cross, Trail, Marche, VTT)
const subCategoryMap: Record<string, number> = {
  Cross: 1,
  Trail: 2,
  Marche: 3,
  VTT: 4,
};

const ResultsPage: React.FC = () => {
  // État pour la catégorie générale (Compétition ou Événements)
  const [selectedCategory, setSelectedCategory] = useState<CategoryGeneral>(CategoryGeneral.Competition);
  // États pour le sous-filtre (Cross, Trail, Marche, VTT)
  const [selectedTabComp, setSelectedTabComp] = useState("Cross");
  const [selectedTabEvent, setSelectedTabEvent] = useState("Cross");
  // État pour stocker les données
  const [data, setData] = useState<any[]>([]);
  // État pour les messages d'erreur éventuels
  const [errorMessage, setErrorMessage] = useState("");

  // Le sous-filtre dépend du type de catégorie
  const selectedFilter = selectedCategory === CategoryGeneral.Competition ? selectedTabComp : selectedTabEvent;

  useEffect(() => {
    const fetchData = async () => {
      setErrorMessage("");

      try {
        // 1. Préparer la requête
        let query = supabase.from("resultats").select("*");

        // 2. Filtrer par type (id_type) en fonction de l'enum
        const typeId = categoryTypeMap[selectedCategory];
        query = query.eq("id_type", typeId);

        // 3. Filtrer par sous-catégorie (id_categorie)
        const catId = subCategoryMap[selectedFilter];
        query = query.eq("id_categorie", catId);

        // 4. Exécuter la requête
        const { data: resultsData, error } = await query;
        if (error) {
          console.error("Erreur lors de la récupération des données :", error);
          setErrorMessage(error.message);
        } else {
          setData(resultsData || []);
        }
      } catch (err: any) {
        console.error("Erreur inattendue :", err);
        setErrorMessage(err.message);
      }
    };

    fetchData();
  }, [selectedCategory, selectedFilter]);

  return (
    <div className="relative min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 w-full text-left">Résultats</h1>

      {/* Affichage d'un éventuel message d'erreur */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="bg-[#475C99] p-8 rounded-3xl w-full max-w-7xl border-2 border-black min-h-[500px]">
        {/* Sélecteur pour Compétition / Événements */}
        <div className="mb-6 text-center">
          <label className="text-white text-lg font-semibold">Afficher :</label>
          <select
            className="ml-2 p-2 border border-gray-300 rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryGeneral)}
          >
            <option value={CategoryGeneral.Competition}>Compétition</option>
            <option value={CategoryGeneral.Event}>Événements</option>
          </select>
        </div>

        <div className="bg-white text-black p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">{selectedCategory}</h2>
          {/* Boutons de sous-catégorie : Cross, Trail, Marche, VTT */}
          <div className="flex justify-between rounded-lg overflow-hidden mb-4 p-1">
            {["Cross", "Trail", "Marche", "VTT"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  selectedCategory === CategoryGeneral.Competition
                    ? setSelectedTabComp(tab)
                    : setSelectedTabEvent(tab)
                }
                className={`flex-1 px-4 py-2 text-center border border-gray-300 mx-1 ${
                  selectedFilter === tab ? "bg-[#031F73] text-white" : "bg-[#475C99] text-white border-[#475C99]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Affichage des résultats */}
          {data.length === 0 ? (
            <p className="text-center text-gray-500">Aucun résultat disponible.</p>
          ) : (
            <table className="w-full text-left mt-2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-sm">ID</th>
                  <th className="border p-2 text-sm">Créé le</th>
                  <th className="border p-2 text-sm">ID Chien</th>
                  <th className="border p-2 text-sm">ID Profil</th>
                  <th className="border p-2 text-sm">ID Catégorie</th>
                  <th className="border p-2 text-sm">ID Type</th>
                  <th className="border p-2 text-sm">Temps</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id || index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="border p-2 text-sm">{item.id}</td>
                    <td className="border p-2 text-sm">{item.created_at}</td>
                    <td className="border p-2 text-sm">{item.id_chien}</td>
                    <td className="border p-2 text-sm">{item.id_profil}</td>
                    <td className="border p-2 text-sm">{item.id_categorie}</td>
                    <td className="border p-2 text-sm">{item.id_type}</td>
                    <td className="border p-2 text-sm">{item.temps}</td>
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
