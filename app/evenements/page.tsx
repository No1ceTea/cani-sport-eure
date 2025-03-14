"use client";

import { useState } from 'react';
import EventCard from '../components/EventCard';
import AddEventModal from '../components/AddEventModal';
import SidebarAdmin from '../components/SidebarAdmin';

const fakeEvents = [
  {
    id: 1,
    titre: "Canicross en forêt 🌲",
    contenu: "Rejoignez-nous pour une session de canicross dans les bois ! 🐕‍🦺",
    datePublication: "Publié le 1 mars 2025",
    type: "Course",
    auteur: {
      nom: "Marie Dupont",
      avatar_url: "https://i.pravatar.cc/300?img=5",
    },
    image_url: "https://source.unsplash.com/600x300/?dog,run",
  },
  {
    id: 2,
    titre: "Atelier initiation CanivTT 🚴‍♂️",
    contenu: "Découvrez les bases du cani-VTT avec nos experts.",
    datePublication: "Publié le 2 mars 2025",
    type: "Atelier",
    auteur: {
      nom: "Lucas Martin",
      avatar_url: "https://i.pravatar.cc/300?img=8",
    },
    image_url: "https://source.unsplash.com/600x300/?mountain,bike",
  },
  {
    id: 3,
    titre: "Séance d'entraînement 🏋️‍♂️",
    contenu: "Séance spéciale pour améliorer la vitesse et l'endurance.",
    datePublication: "Publié le 3 mars 2025",
    type: "Entraînement",
    auteur: {
      nom: "Sophie Lambert",
      avatar_url: "https://i.pravatar.cc/300?img=12",
    },
    image_url: "https://source.unsplash.com/600x300/?fitness,dog",
  },
];

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}



const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex relative">
      <SidebarAdmin/>

      {/* Contenu Principal */}
      <div className={`flex-1 p-6 ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}>
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
          {fakeEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AddEventModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default EventsPage;
