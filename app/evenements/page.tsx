"use client";

import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/AddEventModal";
import supabase from "../../lib/supabaseClient";
import SidebarAdmin from "../components/SidebarAdmin";
import { FaSearch } from "react-icons/fa";

interface Event {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  type: string;
  created_at : string ;
  image_url: string;
  id_profil: number;
  auteur: {
    nom: string;
    avatar_url: string;
  };
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // État pour la recherche
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("evenements").select("*");

      if (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        return;
      }

      // Récupérer les informations des auteurs pour chaque événement
      const eventsWithProfiles = await Promise.all(
        data.map(async (event) => {
          const { data: profileData, error: profileError } = await supabase
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
  }, []); // Dépendances vides pour ne s'exécuter qu'une seule fois


  // Filtrer les événements en fonction du titre
  const filteredEvents = events.filter((event) =>
    event.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <SidebarAdmin/>

        {/* Contenu Principal */}
        <div className={`flex-1 p-6 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}>
        
        {/* Barre de recherche stylisée */}
        <div className="relative w-full flex justify-left mb-6">
          <input
            type="text"
            placeholder="Rechercher un événement"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[50%] py-2 pl-4 pr-10 text-lg border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
          />
          <FaSearch className="absolute right-[52%] top-1/2 transform -translate-y-1/2 text-blue-900 text-lg" />
        </div>

        {/* Conteneur avec scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-[85vh] overflow-y-auto p-2">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EventsPage;
