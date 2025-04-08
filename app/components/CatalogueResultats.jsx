"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ModalAdd from "./AddResultatModal";
import ModalEdit from "./ModalEditResultat";
import ModalConfirm from "./ModalConfirm";

export default function TableResultats({ isModalOpen, setIsModalOpen }) {
  const supabase = createClientComponentClient();
  const [resultats, setResultats] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResultat, setSelectedResultat] = useState(null);
  const [selectedResultatId, setSelectedResultatId] = useState(null);

  useEffect(() => {
    const fetchResultats = async () => {
      const { data, error } = await supabase
        .from("resultats")
        .select(`
          *,
          chiens ( prenom ),
          profils ( nom, prenom ),
          categorieResultat ( nom_categorie ),
          resultatType ( nom_resultat )
        `);

      if (error) {
        console.error("❌ Erreur de récupération :", error);
      } else if (data) {
        const formatedData = data.map((item) => {
          const profilNomComplet = item.profils
            ? `${item.profils.nom} ${item.profils.prenom}`
            : "";

          return {
            ...item,
            created_at: item.created_at ? new Date(item.created_at).toLocaleString() : "",
            date: item.date ? new Date(item.date).toLocaleDateString() : "",
            chienPrenom: item.chiens?.prenom || "",
            profilNomComplet,
            categorieNom: item.categorieResultat?.nom_categorie || "",
            typeNom: item.resultatType?.nom_resultat || "",
          };
        });

        setResultats(formatedData);
      }
    };

    fetchResultats();
  }, [supabase]);

  const handleDeleteClick = (id) => {
    setSelectedResultatId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResultatId) return;
    const { error } = await supabase.from("resultats").delete().match({ id: selectedResultatId });

    if (error) {
      console.error("❌ Erreur de suppression :", error);
    } else {
      setResultats((prev) => prev.filter((res) => res.id !== selectedResultatId));
      setIsDeleteModalOpen(false);
      setSelectedResultatId(null);
    }
  };

  const handleEditClick = (resultat) => {
    setSelectedResultat(resultat);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full overflow-x-auto mt-8" style={{ fontFamily: "Calibri, sans-serif" }}>
      <table className="min-w-[1300px] w-full text-sm text-gray-700 border border-gray-300 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-center">Date</th>
            <th className="p-4 text-center">Chien</th>
            <th className="p-4 text-center">Participant</th>
            <th className="p-4 text-center">Catégorie</th>
            <th className="p-4 text-center">Type</th>
            <th className="p-4 text-center">Temps</th>
            <th className="p-4 text-center">Vitesse</th>
            <th className="p-4 text-center">Distance</th>
            <th className="p-4 text-center">Région</th>
            <th className="p-4 text-center">Lieu</th>
            <th className="p-4 text-center">Nom Activité</th>
            <th className="p-4 text-center">kmAR</th>
            <th className="p-4 text-center">Classement</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resultats.map((res) => (
            <tr key={res.id} className="hover:bg-gray-50">
              <td className="p-4 text-center">{res.date}</td>
              <td className="p-4 text-center">{res.chienPrenom}</td>
              <td className="p-4 text-center">{res.profilNomComplet}</td>
              <td className="p-4 text-center">{res.categorieNom}</td>
              <td className="p-4 text-center">{res.typeNom}</td>
              <td className="p-4 text-center">{res.temps}</td>
              <td className="p-4 text-center">{res.vitesse}</td>
              <td className="p-4 text-center">{res.distance}</td>
              <td className="p-4 text-center">{res.region}</td>
              <td className="p-4 text-center">{res.lieu}</td>
              <td className="p-4 text-center">{res.nomActivite}</td>
              <td className="p-4 text-center">{res.kmAR}</td>
              <td className="p-4 text-center">{res.classement}</td>
              <td className="p-4 flex justify-center gap-4">
                <button onClick={() => handleDeleteClick(res.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
                <button onClick={() => handleEditClick(res)} className="text-green-500 hover:text-green-700">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <ModalConfirm
        isOpen={isDeleteModalOpen}
        title="Voulez-vous vraiment supprimer ce résultat ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <ModalAdd
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newRes) => {
          const formatted = {
            ...newRes,
            date: newRes.date ? new Date(newRes.date).toLocaleDateString() : "",
            created_at: newRes.created_at ? new Date(newRes.created_at).toLocaleString() : "",
            chienPrenom: newRes.chiens?.prenom || "",
            profilNomComplet: newRes.profils ? `${newRes.profils.nom} ${newRes.profils.prenom}` : "",
            categorieNom: newRes.categorieResultat?.nom_categorie || "",
            typeNom: newRes.resultatType?.nom_resultat || "",
          };
          setResultats((prev) => [...prev, formatted]);
        }}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedResultat}
      />
    </div>
  );
}
