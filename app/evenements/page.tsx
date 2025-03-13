"use client";

import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/AddEventModal";
import supabase from "../../lib/supabaseClient";

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

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <aside className="w-1/5 bg-blue-900 text-white p-4 min-h-screen">
        <h2 className="text-xl font-bold">Menu</h2>
        <ul className="mt-4 space-y-3">
          <li className="hover:bg-blue-700 p-2 rounded">🏠 Dashboard</li>
          <li className="hover:bg-blue-700 p-2 rounded">📅 Événements</li>
          <li className="hover:bg-blue-700 p-2 rounded">📖 Articles</li>
          <li className="hover:bg-blue-700 p-2 rounded">📷 Album</li>
        </ul>
        <button
          className="mt-6 bg-yellow-400 text-black p-2 rounded flex items-center justify-center w-full"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ Ajouter événement
        </button>
      </aside>

      {/* Contenu Principal */}
      <div className={`flex-1 p-6 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Liste des Événements</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un événement"
              className="border border-gray-300 rounded-lg py-1 px-3"
            />
            🔍
          </div>
        </div>

        {/* Grid des événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
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
