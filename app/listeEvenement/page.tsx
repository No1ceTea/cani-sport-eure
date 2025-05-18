"use client"; // Directive pour exécution côté client

import { useEffect, useState } from "react"; // Hooks React
import EventCard from "../components/EventCard"; // Composant pour afficher un événement
import supabase from "../../lib/supabaseClient"; // Client Supabase pour la base de données
import { FaSearch } from "react-icons/fa"; // Icône de recherche
import WhiteBackground from "../components/backgrounds/WhiteBackground"; // Fond blanc
import Sidebar from "../components/sidebars/Sidebar"; // Barre latérale de navigation
import Footer from "../components/sidebars/Footer"; // Pied de page

// Interface définissant la structure d'un événement
interface Event {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  type: string;
  created_at: string;
  image_url: string;
  id_profil: number;
  auteur: {
    nom: string;
    avatar_url: string;
  };
}

const ListeEvenement = () => {
  // États pour stocker les données et les filtres
  const [events, setEvents] = useState<Event[]>([]); // Liste des événements
  const [searchQuery, setSearchQuery] = useState(""); // Texte de recherche
  const [startDate, setStartDate] = useState(""); // Date de début pour filtrer
  const [endDate, setEndDate] = useState(""); // Date de fin pour filtrer

  // Récupération des événements au chargement de la page
  useEffect(() => {
    const fetchEvents = async () => {
      // Récupération des événements depuis Supabase
      const { data, error } = await supabase.from("evenements").select("*");

      if (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        return;
      }

      // Enrichissement des événements avec les informations sur l'auteur
      const eventsWithProfiles = await Promise.all(
        data.map(async (event) => {
          // Récupération des données de profil pour chaque événement
          const { data: profileData } = await supabase
            .from("profils")
            .select("nom, photo_profil")
            .eq("id", event.id_profil)
            .single();

          return {
            ...event,
            auteur: {
              nom: profileData?.nom || "Auteur inconnu",
              avatar_url: profileData?.photo_profil || "/default-avatar.png",
            },
          };
        })
      );

      setEvents(eventsWithProfiles);
    };

    fetchEvents();
  }, []);

  // Filtrage des événements selon la recherche et les dates sélectionnées
  const filteredEvents = events.filter((event) => {
    const isMatchingTitle = event.titre.toLowerCase().includes(searchQuery.toLowerCase());
    const eventDate = new Date(event.date);
    const isWithinDateRange =
      (!startDate || eventDate >= new Date(startDate)) &&
      (!endDate || eventDate <= new Date(endDate));

    return isMatchingTitle && isWithinDateRange;
  });

  return (
    <div> 
      <Sidebar/> {/* Barre latérale de navigation */}
      
      <WhiteBackground> {/* Conteneur principal avec fond blanc */}
        <div className="min-h-screen px-10 py-6">
          {/* Titre de la page */}
          <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">Évènements</h1>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            {/* Champ de recherche */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher le titre de l'évènement ou le nom de l&apos;auteur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-4 pr-10 text-lg border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
              />
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-900 text-lg" />
            </div>

            {/* Sélecteur de date de début */}
            <div className="text-2xl font-bold">Du</div>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="py-2 px-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
              />
            </div>
            
            {/* Sélecteur de date de fin */}
            <div className="text-2xl font-bold">Au</div>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="py-2 px-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
              />
            </div>
          </div>

          {/* Liste des événements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border-4 border-blue-900 rounded-xl shadow-lg">
                <EventCard event={event} /> {/* Carte pour chaque événement */}
              </div>
            ))}
          </div>
        </div>
      </WhiteBackground>
      
      <Footer/> {/* Pied de page */}
    </div>
  );
};

export default ListeEvenement;
