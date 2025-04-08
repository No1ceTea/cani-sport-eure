"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaTimes } from "react-icons/fa";

// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ModalEdit = ({ isOpen, onClose, sortie }) => {
  if (!isOpen || !sortie) return null;

  const [title, setTitle] = useState(sortie.titre);
  const [sport, setSport] = useState(sortie.categorie);
  const [uploadDate, setUploadDate] = useState(sortie.date + "T" + sortie.heure);

  // 🧠 Met à jour les champs quand une nouvelle sortie est passée en prop
  useEffect(() => {
    setTitle(sortie.titre);
    setSport(sortie.categorie);
    setUploadDate(sortie.date + "T" + sortie.heure);
  }, [sortie]);

  // 🔒 Empêcher le scroll arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("gpx_tracks")
      .update({
        name: title,
        sport: sport,
        date_time: new Date(uploadDate).toISOString(),
      })
      .match({ id: sortie.id });

    if (error) {
      console.error("❌ Erreur de mise à jour :", error);
    } else {
      onClose();
      window.location.reload(); // ✅ Recharge la page après mise à jour
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">Modifier la sortie</h2>

        {/* Titre */}
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />

        {/* Catégorie */}
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        >
          <option value="Cross">Cross</option>
          <option value="Marche">Marche</option>
          <option value="Trail">Trail</option>
          <option value="VTT">VTT</option>
          <option value="Trottinette">Trottinette</option>
        </select>

        {/* Date et heure */}
        <input
          type="datetime-local"
          value={uploadDate}
          onChange={(e) => setUploadDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />

        {/* Bouton Update */}
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default ModalEdit;
