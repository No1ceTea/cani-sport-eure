"use client";

import { useEffect, useState } from "react";
import {
  FaTrash,
  FaEye,
  FaUpload,
  FaSort,
  FaFolderOpen,
  FaFolder,
  FaChevronRight,
  FaPlus,
  FaTimes,
  FaDownload, // 👈 Ajoutez cette icône
} from "react-icons/fa";
import ModalAddDocument from "../components/ModalAddDocument";
import Sidebar from "../components/SidebarAdmin";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/Auth/AuthProvider";
import ModalConfirm from "../components/ModalConfirm";

const supabase = createClientComponentClient();

// Définition du type pour les fichiers et dossiers
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

const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) return "-";

  // Conversion en différentes unités
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  // Sélection de l'unité appropriée
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  } else if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  } else if (kb >= 1) {
    return `${kb.toFixed(2)} KB`;
  } else {
    return `${bytes} octets`;
  }
};

export default function DocumentManager() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderAccess, setNewFolderAccess] = useState("public");
  const [folderPath, setFolderPath] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "Dossier Racine" }]);
  const [newFolderName, setNewFolderName] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileToDeleteId, setFileToDeleteId] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const isAdmin = role === "admin";

  const isFolderEmpty = async (folderId: string) => {
    const { data } = await supabase
      .from("club_documents")
      .select("id")
      .eq("parent_id", folderId);
    return data?.length === 0;
  };

  const handleDeleteFolder = async (folderId: string) => {
    const isEmpty = await isFolderEmpty(folderId);
    if (isEmpty) {
      const { error } = await supabase
        .from("club_documents")
        .delete()
        .eq("id", folderId);
      if (error) {
        console.error("❌ Erreur de suppression du dossier :", error);
      } else {
        console.log(`✅ Dossier supprimé : ${folderId}`);
        setFiles((prev) => prev.filter((f) => f.id !== folderId));
      }
    } else {
      console.error("❌ Le dossier n'est pas vide !");
    }
  };

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
        query = query.eq("parent_id", folderPath[folderPath.length - 1].id);
      } else {
        query = query.is("parent_id", null);
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Erreur de récupération :", error);
      } else {
        setFiles(
          data.map((file) => ({
            id: file.id,
            name: file.name,
            size: formatFileSize(file.size), // Utilisez la fonction de formatage ici
            type: file.type || "Dossier",
            createdAt: file.created_at
              ? new Date(file.created_at).toLocaleString()
              : "-",
            updatedAt: file.updated_at
              ? new Date(file.updated_at).toLocaleString()
              : "-",
            url: file.file_url,
            is_folder: file.is_folder,
            parent_id: file.parent_id,
          }))
        );
      }
    };

    fetchFiles();
  }, [folderPath, isLoading]);

  const confirmDelete = (id: string, isFolder: boolean) => {
    if (isFolder) {
      // Si c'est un dossier, vérifier d'abord s'il est vide
      isFolderEmpty(id).then((isEmpty) => {
        if (isEmpty) {
          setFileToDeleteId(id);
          setIsConfirmOpen(true);
        } else {
          // Afficher un message d'erreur si le dossier n'est pas vide
          alert(
            "Ce dossier contient des éléments et ne peut pas être supprimé. Veuillez d'abord supprimer son contenu."
          );
        }
      });
    } else {
      // Pour les fichiers, continuer comme avant
      setFileToDeleteId(id);
      setIsConfirmOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!fileToDeleteId) return;

    const fileToDelete = files.find((f) => f.id === fileToDeleteId);
    if (!fileToDelete) return;

    if (fileToDelete.is_folder) {
      // Utiliser handleDeleteFolder pour les dossiers
      await handleDeleteFolder(fileToDeleteId);
    } else {
      // Code existant pour supprimer les fichiers
      const { error } = await supabase
        .from("club_documents")
        .delete()
        .match({ id: fileToDeleteId });

      if (error) {
        console.error("❌ Erreur de suppression :", error);
      } else {
        console.log(`✅ Fichier supprimé : ${fileToDeleteId}`);
        setFiles((prev) => prev.filter((f) => f.id !== fileToDeleteId));
      }
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

  const handleFolderClick = (folderId: string, folderName: string) => {
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
  };

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
          access_level: newFolderAccess,
        },
      ])
      .select();

    if (error) {
      console.error("❌ Erreur d'ajout du dossier :", error);
    } else {
      setFiles([
        ...files,
        {
          ...data[0],
          size: "-",
          type: "Dossier",
          createdAt: new Date().toLocaleString(),
        },
      ]);
      setIsFolderModalOpen(false);
      setNewFolderName("");
      setNewFolderAccess("public");
    }
  };

  const checkSession = async () => {
    const { data: session } = await supabase.auth.getSession();
    console.log("🟢 Utilisateur connecté :", session?.session?.user);
  };
  useEffect(() => {
    checkSession();
  }, []);

  const testAuthUid = async () => {
    const { data, error } = await supabase.rpc("test_auth_uid");
    console.log("🔹 auth.uid() retourné par Supabase :", data, error);
  };
  useEffect(() => {
    testAuthUid();
  }, []);

  const getIconName = (type?: string) => {
    const t = type?.toLowerCase() || "file";
    if (["xls", "xlsx"].includes(t)) return t;
    if (["doc", "docx"].includes(t)) return t;
    if (t === "pdf") return "pdf";
    return "file";
  };

  const refreshCurrentFolder = async () => {
    if (!isLoading) {
      // Utiliser la même logique que votre useEffect existant
      try {
        const { data, error } = await supabase
          .from("club_documents")
          .select("*")
          .eq("parent_id", folderPath[folderPath.length - 1].id);

        if (error) {
          console.error("❌ Erreur de chargement des fichiers:", error);
          return;
        }

        setFiles(data || []);
      } catch (error) {
        console.error("❌ Exception lors du chargement des fichiers:", error);
      }
    }
  };

  const handleDownload = async (url: string | undefined, fileName: string) => {
    if (!url) {
      console.error("❌ URL de téléchargement manquante");
      return;
    }

    try {
      // Afficher un indicateur de chargement (facultatif)
      console.log("⏳ Téléchargement en cours...");

      // Récupérer le contenu du fichier
      const response = await fetch(url);
      const blob = await response.blob();

      // Créer une URL objet pour le blob
      const blobUrl = URL.createObjectURL(blob);

      // Créer un lien et déclencher le téléchargement
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Libérer la mémoire

      console.log("✅ Téléchargement terminé");
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement:", error);
    }
  };

  if (isLoading || !role) return <div>Chargement...</div>;

  return (
    <div className="flex overflow-x-hidden">
      <Sidebar />
      <div
        className="p-6 bg-white rounded-lg w-full mx-auto mt-8"
        style={{ fontFamily: "Calibri, sans-serif" }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-gray-700 text-base">
            {folderPath.map((folder, index) => (
              <span key={folder.id || "root"} className="flex items-center">
                {index > 0 && <FaChevronRight className="mx-2 text-gray-500" />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className="hover:underline"
                >
                  {folder.name}
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="text-green-600 flex items-center gap-2"
            >
              <FaPlus /> Ajouter un dossier
            </button>
            <button
              onClick={handleUploadClick}
              className="text-blue-600 flex items-center gap-2"
            >
              <FaUpload /> Upload un fichier
            </button>
          </div>
        </div>
        <div className="overflow-auto max-h-[700px] border border-gray-300 rounded-md">
          <table className="w-full border border-gray-300 text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-t border-b p-4 text-left">Nom</th>
                <th className="border-t border-b p-4 text-left">Taille</th>
                <th className="border-t border-b p-4 text-left">Type</th>
                <th className="border-t border-b p-4 text-left">Créé le</th>
                <th className="border-b p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files
                .sort((a, b) => {
                  // Tri principal: dossiers d'abord (true avant false)
                  if (a.is_folder !== b.is_folder) {
                    return a.is_folder ? -1 : 1;
                  }

                  // Tri secondaire par nom (pour les éléments de même type)
                  return a.name.localeCompare(b.name);
                })
                .map((file) => (
                  <tr
                    key={file.id}
                    className="border-b text-md hover:bg-gray-50 cursor-pointer"
                    onDoubleClick={() =>
                      file.is_folder && handleFolderClick(file.id, file.name)
                    }
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
                      <span className="text-blue-500 hover:underline">
                        {file.name}
                      </span>
                    </td>
                    <td className="p-4">{file.size}</td>
                    <td className="p-4">{file.type}</td>
                    <td className="p-4">{file.createdAt}</td>
                    <td className="p-4 flex justify-center gap-4">
                      {!file.is_folder && (
                        <button
                          onClick={() => handleDownload(file.url, file.name)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Télécharger"
                        >
                          <FaDownload />
                        </button>
                      )}
                      <button
                        onClick={() => confirmDelete(file.id, file.is_folder)}
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isFolderModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg relative">
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                <FaTimes />
              </button>
              <h2 className="text-lg font-bold mb-4">Créer un dossier</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border p-2 w-full mb-4"
                placeholder="Nom du dossier"
              />
              <label className="block text-gray-700 font-bold mb-2">
                Droits d&apos;accès :
              </label>
              <select
                value={newFolderAccess}
                onChange={(e) => setNewFolderAccess(e.target.value)}
                className="border p-2 w-full mb-4"
              >
                <option value="adherent">Adhérents (connectés)</option>
                <option value="admin">Admin (restreint)</option>
              </select>
              <button
                onClick={handleAddFolder}
                className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg w-full"
              >
                Créer
              </button>
            </div>
          </div>
        )}
        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4 text-red-600">
                Accès refusé
              </h2>
              <p>
                Vous n&apos;avez pas les droits administrateurs pour réaliser
                cette action.
              </p>
              <button
                onClick={() => setIsErrorModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg"
              >
                OK
              </button>
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
        <ModalAddDocument
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentFolderId={folderPath[folderPath.length - 1].id}
          onUploadSuccess={refreshCurrentFolder}
        />
      </div>
    </div>
  );
}
