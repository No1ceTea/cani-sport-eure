"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit, FaUpload  } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import ModalAdd from "../components/ModalAdd";
import ModalEdit from "../components/ModalEdit";
import ModalConfirm from "./ModalConfirm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


export default function CatalogueSorties() {
  const supabase = createClientComponentClient();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Déplacement ici
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState(null);
  // constante pour gérer le modal de confirmation de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSortieId, setSelectedSortieId] = useState(null);

  

  // 📌 Charger les sorties depuis Supabase
  useEffect(() => {
    const fetchSorties = async () => {
      const { data, error } = await supabase.from("gpx_tracks").select("id, name, sport, date_time, file_url");

      if (error) {
        console.error("❌ Erreur de récupération :", error);
      } else {
        const formattedData = data.map((sortie) => ({
          id: sortie.id,
          titre: sortie.name,
          categorie: sortie.sport,
          date: new Date(sortie.date_time).toLocaleDateString(),
          heure: new Date(sortie.date_time).toLocaleTimeString(),
          fichier: sortie.file_url ? (
            <a href={sortie.file_url} download className="text-blue-500 hover:underline">
              Télécharger
            </a>
          ) : "Aucun fichier",
        }));

        setData(formattedData);
      }
    };

    fetchSorties();
  }, []);

  // 📌 Fonction pour supprimer une sortie
  // const handleDelete = async (id) => {
  //   const { error } = await supabase.from("gpx_tracks").delete().match({ id });

  //   if (error) {
  //     console.error("❌ Erreur de suppression :", error);
  //   } else {
  //     setData(data.filter((sortie) => sortie.id !== id));
  //   }
  // };
  const handleDeleteClick = (id) => {
    setSelectedSortieId(id);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedSortieId) return;
  
    const { error } = await supabase.from("gpx_tracks").delete().match({ id: selectedSortieId });
  
    if (error) {
      console.error("❌ Erreur de suppression :", error);
    } else {
      setData(data.filter((sortie) => sortie.id !== selectedSortieId));
      setIsDeleteModalOpen(false);
      setSelectedSortieId(null);
    }
  };
  

  // 📌 Fonction pour ouvrir le modal d'édition avec les données de la sortie sélectionnée
  const handleEditClick = (sortie) => {
    setSelectedSortie(sortie);
    setIsEditModalOpen(true);
  };

  
  return (
    <div className="p-6 bg-white rounded-lg w-full mx-auto mt-8" style={{ fontFamily: "Calibri, sans-serif" }}>
      <div className="gap-4 justify-right">
        <button onClick={() => setIsModalOpen(true)} className="text-blue-600 flex items-center gap-2">
          <FaPlus /> Ajouter une sortie
        </button>
      </div>

      <table className="w-full border border-gray-300 text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-t border-b p-4 text-left">Titre</th>
            <th className="border-t border-b p-4 text-left">Catégorie</th>
            <th className="border-t border-b p-4 text-left">Date</th>
            <th className="border-t border-b p-4 text-left">Heure</th>
            <th className="border-t border-b p-4 text-left">Fichier GPX</th>
            <th className="border-b p-4 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((sortie) => (
            <tr key={sortie.id} className="border-b text-md hover:bg-gray-50">
              <td className="p-4">{sortie.titre}</td>
              <td className="p-4">{sortie.categorie}</td>
              <td className="p-4">{sortie.date}</td>
              <td className="p-4">{sortie.heure}</td>
              <td className="p-4">{sortie.fichier}</td>
              <td className="p-4 flex justify-center gap-4">
              <button onClick={() => handleDeleteClick(sortie.id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <button onClick={() => handleEditClick(sortie)} className="text-green-500 hover:text-green-700">
                <FaEdit />
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmation */}  
      <ModalConfirm
        isOpen={isDeleteModalOpen}
        title="Voulez-vous vraiment supprimer cette sortie ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      {/* Modal d'ajout */}
      <ModalAdd isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Modal d'édition */}
      <ModalEdit isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} sortie={selectedSortie} />
    </div>
  );
}
