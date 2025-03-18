import { useState } from "react";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditEventModal from "./EditEventModal";
import supabase from "../../lib/supabaseClient";

interface Auteur {
  nom: string;
  avatar_url: string;
}

interface Event {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  created_at : string ;
  image_url: string;
  type: string;
  auteur: Auteur;
}

interface EventCardProps {
  event: Event;
}

// Fonction pour calculer le temps écoulé depuis la publication
const timeSince = (date: string) => {

  //console.log("date", date);
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `Il y a ${seconds} secondes`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} heures`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jours`;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleOpenDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const handleCloseDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const handleDelete = async () => {
    const { error } = await supabase.from("evenements").delete().eq("id", event.id);
    if (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      alert("Erreur lors de la suppression de l'événement.");
    } else {
      alert("Événement supprimé avec succès!");
      handleCloseDeleteConfirm();
    }
  };

  // Utilisation de la fonction `timeSince` pour formater la date
  const formattedDate = timeSince(event.created_at);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border relative flex flex-col h-[500px]">
      {/* Boutons Modifier/Supprimer */}
      <div className="absolute top-3 right-3 flex space-x-2 text-gray-600">
        <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleOpenDeleteConfirm} />
        <FaEdit className="cursor-pointer hover:text-blue-500" onClick={handleOpenEditModal} />
      </div>

      {/* Auteur */}
      <div className="flex items-center mb-3">
        <Image
          src={event.auteur.avatar_url}
          alt="Photo de l'auteur"
          width={40}
          height={40}
          className="rounded-full border"
        />
        <div className="ml-3">
          <p className="font-semibold">{event.auteur.nom}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
          <p className="text-xs font-medium text-blue-700">{event.type}</p>
        </div>
      </div>

      {/* Date de publication */}
      <p className="text-lg font-semibold mb-2">{new Date(event.date).toLocaleDateString()}</p>

      {/* Contenu */}
      <h3 className="font-bold text-lg">{event.titre}</h3>
      <p className="text-gray-700 mb-3">{event.contenu}</p>

      {/* Image de l'événement */}
      {event.image_url && (
        <div className="h-64 w-full relative">
          <Image
            src={event.image_url}
            alt={event.titre}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      {/* Modal de modification */}
      <EditEventModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} articleId={event.id.toString()} />

      {/* Pop-up de confirmation de suppression */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Voulez-vous vraiment supprimer cet événement ?</h2>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={handleCloseDeleteConfirm}>
                Annuler
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
