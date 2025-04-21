"use client"; // Directive indiquant que ce code s'exécute côté client

import { useEffect, useState } from "react"; // Hooks React pour la gestion d'état et des effets
import { createClient } from "@supabase/supabase-js"; // Client Supabase pour les requêtes à la base de données
import dynamic from "next/dynamic"; // Import dynamique de composants Next.js

// Composants d'interface utilisateur
import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";
import WhiteBackground from "../components/backgrounds/WhiteBackground";

// Chargement dynamique pour éviter les erreurs côté serveur
const MapWithStats = dynamic(() => import("../components/MapWithStats"), {
  ssr: false,
});
const Filter = dynamic(() => import("../components/SportFilter"), {
  ssr: false,
});

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const SortiesPage = () => {
  // État pour stocker les données des traces GPS
  const [tracks, setTracks] = useState<
    {
      id: string;
      name: string;
      sport: string;
      date_time: string;
      file_url: string;
    }[]
  >([]);
  // État pour le filtre de sport sélectionné
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Effet pour charger les données des traces au chargement de la page
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

  // Affichage d'un message de chargement si aucune donnée n'est disponible
  if (tracks.length === 0)
    return <p className="text-center mt-10">Chargement...</p>;

  // Fonction pour gérer les changements de filtre de sport
  const handleSportFilter = (sport: string | null) => {
    setSelectedSport(sport);
  };

  // Filtrage des traces en fonction du sport sélectionné
  const filteredTracks = selectedSport
    ? tracks.filter((track) => track.sport === selectedSport)
    : tracks;

  return (
    <div>
      <Sidebar /> {/* Barre latérale de navigation */}
      <WhiteBackground>
        {" "}
        {/* Conteneur principal avec fond blanc */}
        <div className="min-h-screen px-10 py-6">
          <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">
            Liste des sorties canines
          </h1>

          {/* Composant de filtre de sport */}
          <div className="mb-10">
            <Filter
              selectedSport={selectedSport}
              onSportChange={handleSportFilter}
            />
          </div>

          {/* Grille responsive des cartes de sortie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto w-full max-w-5xl mx-auto px-4">
            {filteredTracks.map((track) => (
              <div key={track.id} className="w-full max-w-xs mx-auto">
                <MapWithStats trackData={track} />{" "}
                {/* Carte avec statistiques pour chaque sortie */}
              </div>
            ))}
          </div>
        </div>
      </WhiteBackground>
      <Footer /> {/* Pied de page */}
    </div>
  );
};

export default SortiesPage;
