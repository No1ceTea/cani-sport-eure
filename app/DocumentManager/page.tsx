"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaEye, FaUpload, FaSort, FaFolderOpen, FaFolder, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";
import ModalAddDocument from "../components/ModalAddDocument";
import Sidebar from "../components/SidebarAdmin";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useAuth } from "../components/Auth/AuthProvider";
import ModalConfirm from "../components/ModalConfirm";

const supabase = createClientComponentClient();





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
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderAccess, setNewFolderAccess] = useState("public"); // Valeur par défaut
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Dossier Racine" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileToDeleteId, setFileToDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setFileToDeleteId(id);
    setIsConfirmOpen(true);
  };  

  // 🚨 État pour gérer les erreurs de permissions
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  useEffect(() => {
    if (isLoading) return;
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
  }, [folderPath, isLoading]);

  const handleDelete = async () => {
    if (!fileToDeleteId) return;
  
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.session) {
      console.error("⚠️ Aucun utilisateur connecté ou erreur de session !");
      setIsErrorModalOpen(true);
      return;
    }
  
    const { error } = await supabase
      .from("club_documents")
      .delete()
      .match({ id: fileToDeleteId })
      .single();
  
    if (error) {
      console.error("❌ Erreur de suppression :", error);
    } else {
      console.log(`✅ Fichier/Dossier supprimé : ${fileToDeleteId}`);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDeleteId));
    }
  
    setFileToDeleteId(null);
    setIsConfirmOpen(false);
  };  
  
  const handleUploadClick = () => {
    if (isAdmin === false) {
      setIsErrorModalOpen(true);
      return;
    }
    setIsModalOpen(true);
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
    if (isAdmin === false) {
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!newFolderName.trim()) return;
  
    const { data, error } = await supabase
      .from("club_documents")
      .insert([
        {
          name: newFolderName,
          is_folder: true,
          parent_id: folderPath[folderPath.length - 1].id,
          created_at: new Date().toISOString(),
          access_level: newFolderAccess, // 🔹 Ajout du champ sélectionné
        },
      ])
      .select();
  
    if (error) {
      console.error("❌ Erreur d'ajout du dossier :", error);
    } else {
      setFiles([...files, { ...data[0], size: "-", type: "Dossier", createdAt: new Date().toLocaleString() }]);
      setIsFolderModalOpen(false);
      setNewFolderName("");
      setNewFolderAccess("public"); // Réinitialiser après insertion
    }
  };
  
  const checkSession = async () => {
    const { data: session } = await supabase.auth.getSession();
    console.log("🟢 Utilisateur connecté :", session?.session?.user);
    
  };
  useEffect(() => { checkSession(); }, []);
  
  const testAuthUid = async () => {
    const { data, error } = await supabase.rpc("test_auth_uid");
    console.log("🔹 auth.uid() retourné par Supabase :", data, error);
  };
  useEffect(() => { testAuthUid(); }, []);

  const getIconName = (type?: string) => {
    const t = type?.toLowerCase() || "file";
    if (["xls", "xlsx"].includes(t)) return t;
    if (["doc", "docx"].includes(t)) return t;
    if (t === "pdf") return "pdf";
    return "file"; // fallback générique
  };
  
  if (isLoading || !role) return <div>Chargement...</div>;

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
            <button onClick={handleUploadClick} className="text-blue-600 flex items-center gap-2">
              <FaUpload /> Upload un fichier
            </button>
          </div>
        </div>

        {/* 📌 Tableau des fichiers et dossiers */}
        <div className="overflow-auto max-h-[700px] border border-gray-300 rounded-md">
        <table className="w-full border border-gray-300 text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-t border-b p-4 text-left">Nom</th>
              <th className="border-t border-b p-4 text-left">Taille</th>
              <th className="border-t border-b p-4 text-left">Type</th>
              <th className="border-t border-b p-4 text-left">Créé le</th>
              {/* <th className="border-t border-b p-4 text-left">Dernière modification</th> */}
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
                    <Image
                      src={`/${getIconName(file.type)}.png`}
                      alt="icon"
                      width={20}
                      height={20}
                    />
                  )}
                  <span className="text-blue-500 hover:underline">{file.name}</span>
                </td>
                <td className="p-4">{file.size}</td>
                <td className="p-4">{file.type}</td>
                <td className="p-4">{file.createdAt}</td>
                {/* <td className="p-4">{file.updatedAt}</td> */}
                <td className="p-4 flex justify-center gap-4">
                <button
                  onClick={() => confirmDelete(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>


        {/* Modal d'ajout de dossier */}
        {isFolderModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg relative">
              <button onClick={() => setIsFolderModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
                <FaTimes />
              </button>
              <h2 className="text-lg font-bold mb-4">Créer un dossier</h2>
              
              {/* Champ Nom du Dossier */}
              <input 
                type="text" 
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)} 
                className="border p-2 w-full mb-4" 
                placeholder="Nom du dossier" 
              />

              {/* Sélection du Niveau d'Accès */}
              <label className="block text-gray-700 font-bold mb-2">Droits d&apos;accès :</label>
              <select 
                value={newFolderAccess} 
                onChange={(e) => setNewFolderAccess(e.target.value)} 
                className="border p-2 w-full mb-4"
              >
                <option value="public">Public (tout le monde)</option>
                <option value="adherent">Adhérents (connectés)</option>
                <option value="admin">Admin (restreint)</option>
              </select>

              {/* Bouton de validation */}
              <button onClick={handleAddFolder} className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg w-full">
                Créer
              </button>
            </div>
          </div>
        )}

        {/* Modal d'erreur */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4 text-red-600">Accès refusé</h2>
              <p>Vous n&apos;avez pas les droits administrateurs pour réaliser cette action.</p>
              <button onClick={() => setIsErrorModalOpen(false)} className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg">OK</button>
            </div>
          </div>
        )}

        <ModalConfirm
          isOpen={isConfirmOpen}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDelete}
          onCancel={() => {
            setIsConfirmOpen(false);
            setFileToDeleteId(null);
          }}
        />


        {/* Affichage du modal */}
        <ModalAddDocument isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentFolderId={folderPath[folderPath.length - 1].id}/>
      </div>
    </div>
  );
}
