"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { DOMParser } from "@xmldom/xmldom";
import { FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa";

// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ModalAdd = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [sport, setSport] = useState("Cross");
  const [uploadDate, setUploadDate] = useState("");
  const [uploadTime, setUploadTime] = useState("");
  const [title, setTitle] = useState("");

  // Fonction pour normaliser le nom de fichier
  const normalizeFileName = (filename) => {
    return filename
      .normalize("NFD") // Décomposer les accents
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^a-zA-Z0-9_\-.]/g, "_") // Remplacer les caractères spéciaux
      .replace(/_+/g, "_") // Éviter les répétitions d’underscores
      .trim();
  };

  const handleUpload = async () => {
    if (!file || !title || !sport || !uploadDate || !uploadTime) {
      setMessage("❌ Veuillez remplir tous les champs.");
      return;
    }
  
    setUploading(true);
    setMessage("📡 Upload en cours...");
  
    const dateTime = `${uploadDate}T${uploadTime}`;
    const sanitizedFileName = normalizeFileName(file.name);
    const filePath = `gpx-files/${sanitizedFileName}`;
  
    // 📌 Étape 1 : Lire le fichier GPX
    const fileContent = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileContent, "text/xml");
  
    // 📌 Étape 2 : Extraire les coordonnées GPS
    const trkpts = xmlDoc.getElementsByTagName("trkpt");
    let coordinates = [];
  
    for (let i = 0; i < trkpts.length; i++) {
      const lat = trkpts[i].getAttribute("lat");
      const lon = trkpts[i].getAttribute("lon");
      const eleTag = trkpts[i].getElementsByTagName("ele");
      const ele = eleTag.length > 0 ? eleTag[0].textContent : "0"; // Élément optionnel
      coordinates.push(`${lon} ${lat} ${ele}`);
    }
  
    if (coordinates.length === 0) {
      setMessage("❌ Impossible d'extraire les coordonnées GPS du fichier.");
      setUploading(false);
      return;
    }
  
    // 📌 Étape 3 : Transformer en WKT (Well-Known Text)
    const linestringZ = `LINESTRINGZ(${coordinates.join(", ")})`;
    console.log("📌 WKT corrigé :", linestringZ);
  
    // 📌 Étape 4 : Upload du fichier GPX
    const { error: uploadError } = await supabase.storage
      .from("gpx-files")
      .upload(filePath, file, { upsert: true });
  
    if (uploadError) {
      console.error("❌ Erreur d'upload :", uploadError);
      setMessage("❌ Erreur lors de l'upload.");
      setUploading(false);
      return;
    }
  
    // 📌 Étape 5 : Récupération de l'URL publique
    const { data: publicUrlData } = await supabase.storage.from("gpx-files").getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl || `https://your-supabase-url/storage/v1/object/public/${filePath}`;
  
    // 📌 Étape 6 : Envoi en base de données avec `geom`
    const { error: dbError } = await supabase.from("gpx_tracks").insert([
      {
        name: title,
        sport: sport,
        date_time: new Date(dateTime).toISOString(),
        file_url: publicUrl,
        geom: linestringZ, // ✅ Ajout du champ `geom`
      },
    ]);
  
    if (dbError) {
      console.error("❌ Erreur d'insertion en base :", dbError);
      setMessage("❌ Erreur d'insertion en base.");
    } else {
      setMessage("✅ Fichier GPX ajouté avec succès !");
      onClose(); // ✅ Ferme le modal après succès
    }
  
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Bouton de fermeture */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
          <FaTimes />
        </button>

        {/* 📌 Titre avec trait en dessous */}
        <h2 className="text-2xl font-bold mb-4">Ajouter une sortie</h2>
        <hr className="mb-6 border-gray-300" />  {/* ✅ Trait horizontal ajouté ici */}

        {/* 📌 Titre */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Nom de la sortie"
          />
        </div>

        {/* 📌 Catégories */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Catégories</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="Cross">Cross</option>
            <option value="Marche">Marche</option>
            <option value="Trail">Trail</option>
            <option value="VTT">VTT</option>
            <option value="Trottinette">Trottinette</option>
          </select>
        </div>

        {/* 📌 Date et Heure */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2 relative">
            <label className="block text-sm font-semibold">Date</label>
            <div className="relative">
              <input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded pl-10"
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="w-1/2 relative">
            <label className="block text-sm font-semibold">Heure</label>
            <div className="relative">
              <input
                type="time"
                value={uploadTime}
                onChange={(e) => setUploadTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded pl-10"
              />
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* 📌 Upload fichier GPX */}
        <div className="mb-4 text-left">
          <input type="file" accept=".gpx" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="fileUpload" />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer bg-blue-700 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-900 inline-block"
          >
            Ajouter un fichier GPX
          </label>
          {file && <p className="mt-2 text-sm">{file.name}</p>}
        </div>

        {/* 📌 Bouton principal */}
        <div className="text-center mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-700 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-900"
          >
            {uploading ? "Ajout en cours..." : "Ajouter une sortie"}
          </button>
        </div>

        {/* 📌 Message d'état */}
        {message && <p className="text-center text-sm mt-2 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ModalAdd;
