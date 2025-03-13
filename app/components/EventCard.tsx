"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";
import EditEventModal from "./EditEventModal"; // Importation du modal de modification
import supabase from "../../lib/supabaseClient"; // Importation de Supabase

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    if (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      alert("Erreur lors de la suppression de l'événement.");
    } else {
      alert("Événement supprimé avec succès!");
      handleCloseDeleteConfirm();
      // Vous pouvez ajouter une logique supplémentaire ici pour mettre à jour l'état parent si nécessaire
    }
  };

  return (
    <div className="relative border rounded-lg p-4 shadow-lg bg-white">
      {/* Icônes en haut à droite */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button className="text-gray-500 hover:text-red-500" onClick={handleOpenDeleteConfirm}>
          <Trash2 size={18} />
        </button>
        <button className="text-gray-500 hover:text-blue-500" onClick={handleOpenEditModal}>
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

      {/* Modal de modification */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        articleId={event.id.toString()}
      />

      {/* Pop-up de confirmation de suppression */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Voulez-vous vraiment supprimer cet article ?</h2>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={handleCloseDeleteConfirm}
              >
                Annuler
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Supprimer l’article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;