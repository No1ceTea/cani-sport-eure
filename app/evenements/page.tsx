"use client";

import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/AddEventModal";
import supabase from "../../lib/supabaseClient";
import SidebarAdmin from "../components/SidebarAdmin";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../components/Auth/AuthProvider";
import { useRouter } from "next/navigation";

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

const EventsPage = () => {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔐 Protection
  useEffect(() => {
    if (!isLoading && (!user || role !== "admin")) {
      router.replace("/connexion");
    }
  }, [isLoading, user, role]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("evenements").select("*");

      if (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        return;
      }

      const eventsWithProfiles = await Promise.all(
        data.map(async (event) => {
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

    if (user && role === "admin") {
      fetchEvents();
    }
  }, [user, role]);

  const filteredEvents = events.filter((event) =>
    event.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || !user || role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />

      <div className="p-6  mx-auto flex-1 flex flex-col">

        {/* Barre de recherche */}
        <div className="relative w-full max-w-xl mb-6">
          <input
            type="text"
            placeholder="Rechercher un événement"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-base sm:text-lg border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-900 text-base sm:text-lg" />
        </div>

        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto p-2">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} isEditable />
          ))}
        </div>
      </div>

      <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EventsPage;
