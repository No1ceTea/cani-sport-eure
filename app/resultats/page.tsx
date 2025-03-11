"use client";

import React, { useState } from "react";

const results = [
  { name: "Courmaceul Mickael", location: "Vernon", distance: "15km", rank: "12ème" },
];

const events = [
  { name: "Courmaceul Mickael", location: "Vernon", distance: "10km" },
];

const ResultsPage: React.FC = () => {
  const [selectedTabComp, setSelectedTabComp] = useState("Trail"); // État pour les boutons de la compétition
  const [selectedTabEvent, setSelectedTabEvent] = useState("Trail"); // État pour les boutons de l'événement

  return (
    <div className="relative min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 w-full text-left">Résultats</h1>
      <div className="bg-[#475C99] p-8 rounded-3xl w-full max-w-7xl border-2 border-black min-h-[500px]">
        <div className="grid grid-cols-2 gap-12">
          {/* Compétition */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white text-center">Compétition</h2>
            <div className="bg-white text-black p-6 rounded-xl shadow-md">
              <div className="flex justify-between rounded-lg overflow-hidden mb-2 p-1">
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

              <table className="w-full text-left mt-2">
                <thead>
                  <tr>
                    <th className="border-b py-2 text-sm">Nom</th>
                    <th className="border-b py-2 text-sm">Lieu</th>
                    <th className="border-b py-2 text-sm">Distance</th>
                    <th className="border-b py-2 text-sm">Classement</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm">{result.name}</td>
                      <td className="py-2 text-sm">{result.location}</td>
                      <td className="py-2 text-sm">{result.distance}</td>
                      <td className="py-2 text-sm">{result.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Évènement */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white text-center">Evénements</h2>
            <div className="bg-white text-black p-6 rounded-xl shadow-md">
              <div className="flex justify-between rounded-lg overflow-hidden mb-2 p-1">
                {["Cross", "Trail", "Marche", "VTT"].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTabEvent(tab)}
                    className={`flex-1 px-4 py-2 text-center border border-gray-300 mx-1 ${
                      selectedTabEvent === tab
                        ? "bg-[#031F73] text-white"
                        : "bg-[#475C99] text-white border-[#475C99]"
                    } ${index === 0 ? "rounded-tl-lg" : ""} ${index === 3 ? "rounded-tr-lg" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <table className="w-full text-left mt-2">
                <thead>
                  <tr>
                    <th className="border-b py-2 text-sm">Nom</th>
                    <th className="border-b py-2 text-sm">Lieu</th>
                    <th className="border-b py-2 text-sm">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm">{event.name}</td>
                      <td className="py-2 text-sm">{event.location}</td>
                      <td className="py-2 text-sm">{event.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
