"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaTimes } from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ModalEditResultat = ({ isOpen, onClose, data }) => {
  const [temps, setTemps] = useState("");
  const [vitesse, setVitesse] = useState("");
  const [distance, setDistance] = useState("");
  const [region, setRegion] = useState("");
  const [lieu, setLieu] = useState("");
  const [nomActivite, setNomActivite] = useState("");
  const [classement, setClassement] = useState("");

  useEffect(() => {
    if (data) {
      setTemps(data.temps || "");
      setVitesse(data.vitesse || "");
      setDistance(data.distance || "");
      setRegion(data.region || "");
      setLieu(data.lieu || "");
      setNomActivite(data.nomActivite || "");
      setClassement(data.classement || "");
    }
  }, [data]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("resultats")
      .update({
        temps,
        vitesse,
        distance,
        region,
        lieu,
        nomActivite,
        classement,
      })
      .match({ id: data.id });

    if (error) {
      console.error("❌ Erreur de mise à jour :", error);
    } else {
      onClose();
      window.location.reload();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Modifier un Résultat</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Temps"
            value={temps}
            onChange={(e) => setTemps(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Vitesse"
            value={vitesse}
            onChange={(e) => setVitesse(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Région"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Lieu"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Nom de l'activité"
            value={nomActivite}
            onChange={(e) => setNomActivite(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Classement"
            value={classement}
            onChange={(e) => setClassement(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default ModalEditResultat;
