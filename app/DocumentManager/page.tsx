"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaEye, FaUpload, FaSort, FaFolderOpen, FaFolder, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import ModalAddDocument from "../components/ModalAddDocument";
import Sidebar from "../components/SidebarAdmin";

// 📌 Connexion à Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Définition du type des fichiers et dossiers
interface DocumentFile {
  id: string;
  name: string;
  size?: string;
  type?: string;
  createdAt: string;
  updatedAt?: string;
  url?: string;
  is_folder: boolean;
  parent_id?: string | null;
}

export default function DocumentManager() {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Dossier Racine" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      let query = supabase.from("club_documents").select("*");

      if (folderPath.length > 1) {
        query = query.eq("parent_id", folderPath[folderPath.length - 1].id); // Dossier actuel
      } else {
        query = query.is("parent_id", null); // Dossier racine
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Erreur de récupération :", error);
      } else {
        setFiles(
          data.map((file) => ({
            id: file.id,
            name: file.name,
            size: file.size ? (file.size / 1024).toFixed(2) + " KB" : "-",
            type: file.type || "Dossier",
            createdAt: file.created_at ? new Date(file.created_at).toLocaleString() : "-",
            updatedAt: file.updated_at ? new Date(file.updated_at).toLocaleString() : "-",
            url: file.file_url,
            is_folder: file.is_folder,
            parent_id: file.parent_id,
          }))
        );
      }
    };

    fetchFiles();
  }, [folderPath]);

  // 📌 Supprimer un fichier/dossier
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("club_documents").delete().match({ id });

    if (error) {
      console.error("❌ Erreur de suppression :", error);
    } else {
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  // 📌 Naviguer dans un dossier
  const handleFolderClick = (folderId: string, folderName: string) => {
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
  };

  // 📌 Revenir à un dossier précédent
  const handleBreadcrumbClick = (index: number) => {
    setFolderPath(folderPath.slice(0, index + 1));
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    const { data, error } = await supabase
      .from("club_documents")
      .insert([
        {
          name: newFolderName,
          is_folder: true,
          parent_id: folderPath[folderPath.length - 1].id, // Ajout au dossier courant
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Erreur d'ajout du dossier :", error);
    } else {
      setFiles([...files, { ...data[0], size: "-", type: "Dossier", createdAt: new Date().toLocaleString() }]);
      setIsFolderModalOpen(false);
      setNewFolderName("");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 bg-white rounded-lg w-full mx-auto mt-8" style={{ fontFamily: "Calibri, sans-serif" }}>
        
        {/* 📌 Navigation (Fil d'Ariane) et Actions alignées à droite */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-gray-700 text-lg">
            {folderPath.map((folder, index) => (
              <span key={folder.id || "root"} className="flex items-center">
                {index > 0 && <FaChevronRight className="mx-2 text-gray-500" />}
                <button onClick={() => handleBreadcrumbClick(index)} className="hover:underline">
                  {folder.name}
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {/* <button className="text-gray-600 flex items-center gap-2">
              <FaEye /> Vues
            </button>
            <button className="text-gray-600 flex items-center gap-2">
              <FaSort /> Trier
            </button> */}
            <button onClick={() => setIsFolderModalOpen(true)} className="text-green-600 flex items-center gap-2">
              <FaPlus /> Ajouter un dossier
            </button>
            <button onClick={() => setIsModalOpen(true)} className="text-blue-600 flex items-center gap-2">
              <FaUpload /> Upload un fichier
            </button>
          </div>
        </div>

        {/* 📌 Tableau des fichiers et dossiers */}
        <table className="w-full border border-gray-300 text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-t border-b p-4 text-left">Nom</th>
              <th className="border-t border-b p-4 text-left">Taille</th>
              <th className="border-t border-b p-4 text-left">Type</th>
              <th className="border-t border-b p-4 text-left">Créé le</th>
              <th className="border-t border-b p-4 text-left">Dernière modification</th>
              <th className="border-b p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                className="border-b text-md hover:bg-gray-50 cursor-pointer"
                onDoubleClick={() => file.is_folder && handleFolderClick(file.id, file.name)}
              >
                <td className="p-4 flex items-center gap-2">
                  {file.is_folder ? (
                    <FaFolder className="text-yellow-500" />
                  ) : (
                    <img
                      src={`/${file.type?.toLowerCase() || "file"}.png`}
                      alt="icon"
                      width="20"
                      height="20"
                    />
                  )}
                  <span className="text-blue-500 hover:underline">{file.name}</span>
                </td>
                <td className="p-4">{file.size}</td>
                <td className="p-4">{file.type}</td>
                <td className="p-4">{file.createdAt}</td>
                <td className="p-4">{file.updatedAt}</td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>



        {/* Bouton d'ajout de fichier */}
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
          Ajouter un fichier
        </button>

                {/* Modal d'ajout de dossier */}
                {isFolderModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg relative">
              <button onClick={() => setIsFolderModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
                <FaTimes />
              </button>
              <h2 className="text-lg font-bold mb-4">Créer un dossier</h2>
              <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="border p-2 w-full" placeholder="Nom du dossier" />
              <button onClick={handleAddFolder} className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg">Créer</button>
            </div>
          </div>
        )}

        {/* Affichage du modal */}
        <ModalAddDocument isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
