"use client";

import Image from "next/image";
import { Trash2, Edit } from "lucide-react";

interface Event {
  id: number;
  titre: string;
  contenu: string;
  datePublication: string;
  image_url: string;
  auteur: {
    nom: string;
    avatar_url: string;
  };
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="relative border rounded-lg p-4 shadow-lg bg-white">
      {/* Icônes en haut à droite */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button className="text-gray-500 hover:text-red-500">
          <Trash2 size={18} />
        </button>
        <button className="text-gray-500 hover:text-blue-500">
          <Edit size={18} />
        </button>
      </div>

      {/* Avatar et infos auteur */}
      <div className="flex items-center space-x-3">
        <Image
          src={event.auteur.avatar_url}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-bold">{event.auteur.nom}</p>
          <p className="text-sm text-gray-500">{event.datePublication}</p>
        </div>
      </div>

      {/* Contenu de l'événement */}
      <h2 className="text-xl font-semibold mt-2">{event.titre}</h2>
      <p className="text-gray-700">{event.contenu}</p>

      {/* Image de l'événement */}
      <Image
        src={event.image_url}
        alt="Event Image"
        width={600}
        height={300}
        className="mt-2 rounded-lg"
      />
    </div>
  );
};

export default EventCard;
