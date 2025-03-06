"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import MapWithStats from "../components/MapWithStats";
import Upload from "../components/GpxUploader";

// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const SortiesPage = () => {
  const [tracks, setTracks] = useState<
    { id: string; name: string; sport: string; date_time: string; file_url: string }[]
  >([]);

  useEffect(() => {
    const fetchTracks = async () => {
      console.log("📡 Envoi de la requête à Supabase...");
      const { data, error } = await supabase.rpc("get_gpx_tracks_geojson");

      console.log("📊 Réponse Supabase :", data);
      if (error) {
        console.error("❌ Erreur de récupération :", error);
        return;
      }

      if (!data || data.length === 0) {
        console.error("❌ Aucune sortie trouvée !");
        return;
      }

      setTracks(data);
    };

    fetchTracks();
  }, []);

  if (tracks.length === 0) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "bold" }}>
        Liste des sorties canines
      </h1>

      {/* 📌 GRILLE EN 3 COLONNES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // ✅ 3 colonnes fixes
          gap: "15px", // ✅ Réduction de l'espacement
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1000px", // ✅ Ajustement de la largeur max
          margin: "auto",
        }}
      >
        {tracks.map((track) => (
          <div
            key={track.id}
            style={{
              width: "280px", // ✅ Réduction de la largeur des cartes
              margin: "auto",
            }}
          >
            <MapWithStats trackData={track} />
          </div>
        ))}
      </div>

      <Upload />
    </div>
  );
};

export default SortiesPage;
