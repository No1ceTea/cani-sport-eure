"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";
import WhiteBackground from "../components/backgrounds/WhiteBackground";

// Chargement dynamique pour éviter les erreurs côté serveur
const MapWithStats = dynamic(() => import("../components/MapWithStats"), { ssr: false });
const Filter = dynamic(() => import("../components/SportFilter"), { ssr: false });

// Connexion Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const SortiesPage = () => {
  const [tracks, setTracks] = useState<
    { id: string; name: string; sport: string; date_time: string; file_url: string }[]
  >([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      console.log("📡 Envoi de la requête à Supabase...");
      const { data, error } = await supabase.rpc("get_gpx_tracks_geojson");

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

  if (tracks.length === 0) return <p className="text-center mt-10">Chargement...</p>;

  const handleSportFilter = (sport: string | null) => {
    setSelectedSport(sport);
  };

  const filteredTracks = selectedSport
    ? tracks.filter((track) => track.sport === selectedSport)
    : tracks;

  return (
    <div>
      <WhiteBackground>
        <div className="px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-left text-black font-opendyslexic">
            Liste des sorties canines
          </h1>

          {/* Filtre sport */}
          <div className="mb-10">
            <Filter selectedSport={selectedSport} onSportChange={handleSportFilter} />
          </div>

          {/* Grille responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track) => (
              <div key={track.id} className="w-full max-w-xs mx-auto">
                <MapWithStats trackData={track} />
              </div>
            ))}
          </div>
        </div>

        <Sidebar />
      </WhiteBackground>

      <Footer />
    </div>
  );
};

export default SortiesPage;
