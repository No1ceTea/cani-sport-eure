"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { DOMParser } from "@xmldom/xmldom";
import * as turf from "@turf/turf";

// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const GpxUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [sport, setSport] = useState("");
  const [uploadDate, setUploadDate] = useState(""); // 📌 Ajout du champ date_time

  // 📌 Fonction pour traiter le fichier GPX
  const parseGpxFile = async (gpxFile) => {
    const text = await gpxFile.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    let points = [];
    const trkpts = xmlDoc.getElementsByTagName("trkpt");

    for (let i = 0; i < trkpts.length; i++) {
      const lat = trkpts[i].getAttribute("lat");
      const lon = trkpts[i].getAttribute("lon");
      const eleTag = trkpts[i].getElementsByTagName("ele");

      const ele = eleTag.length > 0 ? parseFloat(eleTag[0].textContent) : null;

      console.log(`🔍 Point ${i}: lat=${lat}, lon=${lon}, ele=${ele}`);

      points.push([parseFloat(lon), parseFloat(lat), ele]);
    }

    return points;
  };

  const sanitizeFileName = (fileName) => {
    return fileName
      .normalize("NFD") // Supprime les accents
      .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
      .replace(/\s+/g, "_") // Remplace les espaces par des _
      .replace(/[^a-zA-Z0-9._-]/g, ""); // Supprime les caractères spéciaux sauf _ . -
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Aucun fichier sélectionné.");
      return;
    }

    if (!uploadDate) {
      setMessage("❌ Veuillez sélectionner une date et une heure.");
      return;
    }

    setUploading(true);
    setMessage("📡 Upload en cours...");

    const sanitizedFileName = sanitizeFileName(file.name);
    const filePath = `gpx-files/${sanitizedFileName}`;

    // 📌 Étape 1 : Uploader le fichier dans Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gpx-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Erreur d'upload :", uploadError);
      setMessage("❌ Erreur lors de l'upload.");
      setUploading(false);
      return;
    }

    console.log("✅ Fichier GPX uploadé :", uploadData);

    // 📌 Étape 2 : Lire et extraire les coordonnées
    const coordinates = await parseGpxFile(file);
    if (coordinates.length === 0) {
      setMessage("❌ Erreur : Le fichier GPX est vide ou invalide.");
      setUploading(false);
      return;
    }

    // 📌 Étape 3 : Insérer les données dans la base avec `sport` et `date_time`
    const wktLineString = `LINESTRINGZ(${coordinates.map(([lon, lat, ele]) => `${lon} ${lat} ${ele || 0}`).join(", ")})`;

    console.log("🚀 Données envoyées à Supabase :", {
      name: sanitizedFileName,
      sport: sport, // Ajout du sport
      date_time: uploadDate, // 📌 Ajout de la date et l'heure
      geom: `SRID=4326;${wktLineString}`
    });

    const { error: dbError } = await supabase
      .from("gpx_tracks")
      .insert([
        {
          name: sanitizedFileName,
          sport: sport,
          date_time: uploadDate, // 📌 Ajout du champ date_time
          geom: `SRID=4326;${wktLineString}`
        }
      ]);

    if (dbError) {
      console.error("❌ Erreur d'insertion en base :", dbError);
      setMessage("❌ Erreur d'insertion en base.");
    } else {
      setMessage("✅ Fichier GPX ajouté avec succès !");
    }

    setUploading(false);
  };

  return (
    <div>
      <h2>Uploader un fichier GPX</h2>

      {/* 📌 Champ pour choisir la date et l'heure */}
      <div>
        <label htmlFor="datetime">Date et Heure :</label>
        <input
          type="datetime-local"
          id="datetime"
          value={uploadDate}
          onChange={(e) => setUploadDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      <input 
        type="text" 
        placeholder="Sport (ex: Course à pied, Cyclisme...)" 
        value={sport} 
        onChange={(e) => setSport(e.target.value)}
      />

      <input type="file" accept=".gpx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Upload en cours..." : "Uploader"}
      </button>
      <p>{message}</p>
    </div>
  );
};

export default GpxUploader;
