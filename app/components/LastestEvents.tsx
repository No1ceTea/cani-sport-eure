"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import BlueBackground from "./backgrounds/BlueBackground";

interface Event {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  created_at: string;
  image_url: string;
  type: string;
  auteur: {
    nom: string;
    avatar_url: string;
  };
}

const LatestEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("evenements")
        .select("*")
        .order("date", { ascending: false }) // Trier par date descendante
        .limit(5); // Limite à 5 événements récents

      if (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        return;
      }

      // Récupérer les infos des auteurs
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

    fetchEvents();
  }, []);

  return (
    <div><BlueBackground>
      <div className="p-12">
          <h2 className="text-3xl font-bold primary_title mb-4">
              Nos derniers évènements
          </h2>
          <div className="flex justify-between items-start py-8 ">

          {/* Section des événements */}
          <div className="bg-white p-6 rounded-xl shadow-lg w-[50%] border-4 border-black">
              {/* Liste des événements avec scroll interne */}
              <div className="h-[450px] overflow-y-auto pr-4">
              {events.map((event) => (
                  <div
                  key={event.id}
                  className="border-2 border-blue-900 rounded-xl p-4 mb-4 shadow-md"
                  >
                  <EventCard event={event} />
                  </div>
              ))}
              </div>
          </div>

          {/* Section de texte à droite */}
          <div className="w-[40%] text-white">
              <p className="text-lg mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat...
              </p>

              {/* Bouton "Plus d'événements" */}
              <Link href="/listeEvenement">
              <button className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full flex items-center hover:bg-yellow-600 transition border-black border-2">
                  Plus d’événements <FaArrowRight className="ml-2" />
              </button>
              </Link>
          </div>
          </div>
      </div>
    </BlueBackground></div>
  );
};

export default LatestEvents;
