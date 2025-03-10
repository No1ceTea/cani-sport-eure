"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
// import MapWithStats from "../components/MapWithStats";
// import Filter from "../components/SportFilter";
import dynamic from "next/dynamic";

const MapWithStats = dynamic(() => import("../components/MapWithStats"), { ssr: false });
const Filter = dynamic(() => import("../components/SportFilter"), { ssr: false });


// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const SortiesPage = () => {
  const [tracks, setTracks] = useState<
    { id: string; name: string; sport: string; date_time: string; file_url: string }[]
  >([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null); // ✅ Ajout du sport sélectionné

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

  // 📌 Fonction de mise à jour du sport sélectionné depuis le filtre
  const handleSportFilter = (sport: string | null) => {
    setSelectedSport(sport);
  };

  // 📌 Filtrage des tracks en fonction du sport sélectionné
  const filteredTracks = selectedSport
    ? tracks.filter((track) => track.sport === selectedSport)
    : tracks;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 className="text-3xl font-bold mb-8 text-left text-black font-opendyslexic" 
      style={{
        fontSize: "36px",
        fontFamily: "opendyslexic, sans-serif",
      }}>Liste des sorties canines</h1>

      {/* 📌 Ajout du filtre avec gestion du sport sélectionné */}
      <div style={{marginBottom: "40px"}}>
      <Filter selectedSport={selectedSport} onSportChange={handleSportFilter} />
      </div>

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
        {filteredTracks.map((track) => (
          <div
            key={track.id}
            style={{
              width: "280px",
              margin: "auto",
            }}
          >
            <MapWithStats trackData={track} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortiesPage;
