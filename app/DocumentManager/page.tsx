"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaEye, FaUpload, FaSort, FaFolderOpen } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import ModalAddDocument from "../components/ModalAddDocument";


// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// ✅ Définition du type des fichiers
interface DocumentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export default function DocumentManager() {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.from("club_documents").select("*");

      if (error) {
        console.error("❌ Erreur de récupération :", error);
      } else {
        setFiles(
          data.map((file) => ({
            id: file.id,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            type: file.type,
            createdAt: new Date(file.created_at).toLocaleString(),
            updatedAt: new Date(file.updated_at).toLocaleString(),
            url: file.file_url,
          }))
        );
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("club_documents").delete().match({ id });

    if (error) {
      console.error("❌ Erreur de suppression :", error);
    } else {
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full mx-auto mt-8" style={{ fontFamily: "Calibri, sans-serif" }}>
      {/* 📌 Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FaFolderOpen className="text-gray-600" />
          <span className="font-bold text-lg">Dossier 1 &gt; Sous dossier 2</span>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-600 flex items-center gap-2">
            <FaEye />
            Vues
          </button>
          <button className="text-gray-600 flex items-center gap-2">
            <FaSort />
            Trier
          </button>
          <button onClick={() => setIsModalOpen(true)} className="text-blue-600 flex items-center gap-2">
            <FaUpload />
            Upload un fichier
          </button>
        </div>
      </div>

      {/* 📌 Tableau des fichiers */}
      <table className="w-full border border-gray-300 text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-t border-b p-4 text-left">Nom</th>
            <th className="border-t border-b p-4 text-left">Taille</th>
            <th className="border-t border-b p-4 text-left">Type</th>
            <th className="border-t border-b p-4 text-left">Créé le</th>
            <th className="border-t border-b p-4 text-left">Dernière modification</th>
            <th className="border-b p-4 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} className="border-b text-md hover:bg-gray-50">
              <td className="p-4 flex items-center gap-2">
                <img src={`/icons/${file.type.toLowerCase()}.png`} alt="icon" width="20" height="20" />
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {file.name}
                </a>
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Ajouter un fichier
      </button>

      {/* Affichage du modal */}
      <ModalAddDocument isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
