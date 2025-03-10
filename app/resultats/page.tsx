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
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Résultats</h1>
      <div className="bg-[#475C99] p-6 rounded-3xl w-full max-w-8xl border-2 border-black">
        <div className="grid grid-cols-2 gap-12">
          {/* Compétition */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white text-center">Compétition</h2>
            <div className="bg-white text-black p-6 rounded-xl shadow-md" style={{ padding: "5px" }}>
              <div className="flex justify-between border border-gray-300 rounded-lg overflow-hidden mb-2 p-1">
                {["Cross", "Trail", "Marche", "VTT"].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTabComp(tab)} // Met à jour l'état des boutons de la compétition
                    className={`flex-1 px-4 py-2 text-center border border-gray-300 mx-1 ${
                      selectedTabComp === tab
                        ? "bg-[#475C99] text-white"
                        : "bg-transparent text-[#475C99] border-[#475C99]"
                    } ${index === 0 ? "rounded-tl-lg" : ""} ${index === 3 ? "rounded-tr-lg" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <table className="w-full text-left mt-4">
                <thead>
                  <tr>
                    <th className="border-b py-2">Nom</th>
                    <th className="border-b py-2">Lieu</th>
                    <th className="border-b py-2">Distance</th>
                    <th className="border-b py-2">Classement</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="py-2">{result.name}</td>
                      <td className="py-2">{result.location}</td>
                      <td className="py-2">{result.distance}</td>
                      <td className="py-2">{result.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Évènement */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white text-center">Évènement</h2>
            <div className="bg-white text-black p-6 rounded-xl shadow-md">
              <div className="flex justify-between border border-gray-300 rounded-lg overflow-hidden mb-2 p-1">
                {["Cross", "Trail", "Marche", "VTT"].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTabEvent(tab)} // Met à jour l'état des boutons de l'événement
                    className={`flex-1 px-4 py-2 text-center border border-gray-300 mx-1 ${
                      selectedTabEvent === tab
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-black"
                    } ${index === 0 ? "rounded-tl-lg" : ""} ${index === 3 ? "rounded-tr-lg" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <table className="w-full text-left mt-4">
                <thead>
                  <tr>
                    <th className="border-b py-2">Nom</th>
                    <th className="border-b py-2">Lieu</th>
                    <th className="border-b py-2">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index}>
                      <td className="py-2">{event.name}</td>
                      <td className="py-2">{event.location}</td>
                      <td className="py-2">{event.distance}</td>
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
