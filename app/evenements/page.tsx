"use client";


import EventCard from '../components/EventCard';

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

const EventsPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/5 bg-blue-900 text-white p-4 min-h-screen">
        <h2 className="text-xl font-bold">Menu</h2>
        <ul className="mt-4 space-y-3">
          <li className="hover:bg-blue-700 p-2 rounded">🏠 Dashboard</li>
          <li className="hover:bg-blue-700 p-2 rounded">📅 Événements</li>
          <li className="hover:bg-blue-700 p-2 rounded">📖 Articles</li>
          <li className="hover:bg-blue-700 p-2 rounded">📷 Album</li>
        </ul>
        <button className="mt-6 bg-yellow-400 text-black p-2 rounded flex items-center justify-center w-full">
          ➕ Ajouter événement
        </button>
      </aside>

      {/* Contenu Principal */}
      <div className="flex-1 p-6">
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
    </div>
  );
};

export default EventsPage;
