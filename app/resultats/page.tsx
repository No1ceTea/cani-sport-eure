"use client";

import React, { useState } from "react";

// Définition des types
type CompetitionResult = {
  name: string;
  dog: string;
  time: string;
  date: string;
  speed: string;
  competitionName: string;
  location: string;
  region: string;
  distance: string;
  pace: string;
  roundTrip: string;
  rank: string;
};

type EventResult = {
  name: string;
  location: string;
  distance: string;
};

// Enum pour la catégorie
enum Category {
  Competition = "Compétition",
  Event = "Événements",
}

// Fonction utilitaire pour vérifier le type
const isCompetitionResult = (item: CompetitionResult | EventResult): item is CompetitionResult => {
  return (item as CompetitionResult).dog !== undefined;
};

// Données des compétitions
const results: CompetitionResult[] = [
  {
    name: "Courmaceul Mickael",
    dog: "Rex",
    time: "25:30:500",
    date: "2024-03-10",
    speed: "12 km/h",
    competitionName: "Trail de Vernon",
    location: "Vernon",
    region: "Normandie",
    distance: "15km",
    pace: "4:10 min/km",
    roundTrip: "30km",
    rank: "12ème",
  },
];

// Données des événements
const events: EventResult[] = [
  {
    name: "Courmaceul Mickael",
    location: "Vernon",
    distance: "10km",
  },
];

const ResultsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Competition);
  const [selectedTabComp, setSelectedTabComp] = useState("Trail");
  const [selectedTabEvent, setSelectedTabEvent] = useState("Trail");
  const data = selectedCategory === Category.Competition ? results : events;

  return (
    <div className="relative min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 w-full text-left">Résultats</h1>
      <div className="bg-[#475C99] p-8 rounded-3xl w-full max-w-7xl border-2 border-black min-h-[500px]">
        <div className="mb-6 text-center">
          <label className="text-white text-lg font-semibold">Afficher :</label>
          <select
            className="ml-2 p-2 border border-gray-300 rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
          >
            <option value={Category.Competition}>Compétition</option>
            <option value={Category.Event}>Événements</option>
          </select>
        </div>

        <div className="bg-white text-black p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">{selectedCategory}</h2>
          <div className="flex justify-between rounded-lg overflow-hidden mb-4 p-1">
            {["Cross", "Trail", "Marche", "VTT"].map((tab, index) => (
              <button
                key={tab}
                onClick={() => selectedCategory === Category.Competition ? setSelectedTabComp(tab) : setSelectedTabEvent(tab)}
                className={`flex-1 px-4 py-2 text-center border border-gray-300 mx-1 ${
                  (selectedCategory === Category.Competition ? selectedTabComp : selectedTabEvent) === tab
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
                <tr className="bg-gray-200">
                  <th className="border p-2 text-sm">Nom</th>
                  {selectedCategory === Category.Competition ? (
                    <>
                      <th className="border p-2 text-sm">Chien</th>
                      <th className="border p-2 text-sm">Temps</th>
                      <th className="border p-2 text-sm">Date</th>
                      <th className="border p-2 text-sm">Vitesse</th>
                      <th className="border p-2 text-sm">Nom Compétition</th>
                      <th className="border p-2 text-sm">Lieu</th>
                      <th className="border p-2 text-sm">Région</th>
                      <th className="border p-2 text-sm">Distance</th>
                      <th className="border p-2 text-sm">Min/km</th>
                      <th className="border p-2 text-sm">Km A/R</th>
                      <th className="border p-2 text-sm">Classement</th>
                    </>
                  ) : (
                    <>
                      <th className="border p-2 text-sm">Lieu</th>
                      <th className="border p-2 text-sm">Distance</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="border p-2 text-sm">{item.name}</td>
                    {isCompetitionResult(item) ? (
                      <>
                        <td className="border p-2 text-sm">{item.dog}</td>
                        <td className="border p-2 text-sm">{item.time}</td>
                        <td className="border p-2 text-sm">{item.date}</td>
                        <td className="border p-2 text-sm">{item.speed}</td>
                        <td className="border p-2 text-sm">{item.competitionName}</td>
                        <td className="border p-2 text-sm">{item.location}</td>
                        <td className="border p-2 text-sm">{item.region}</td>
                        <td className="border p-2 text-sm">{item.distance}</td>
                        <td className="border p-2 text-sm">{item.pace}</td>
                        <td className="border p-2 text-sm">{item.roundTrip}</td>
                        <td className="border p-2 text-sm">{item.rank}</td>
                      </>
                    ) : (
                      <>
                        <td className="border p-2 text-sm">{item.location}</td>
                        <td className="border p-2 text-sm">{item.distance}</td>
                      </>
                    )}
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
