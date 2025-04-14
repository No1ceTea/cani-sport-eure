"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaFolder, FaChevronRight, FaTimes, FaPlus, FaUpload} from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/SidebarAdmin";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import ModalConfirm from "../components/ModalConfirm";

// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Définition des types
interface Album {
  id: string;
  name: string;
  createdAt: string;
  parent_id?: string | null;
}

interface Photo {
  id: string;
  name: string;
  url: string;
  size: string;
  createdAt: string;
  album_id: string;
}

export default function AlbumManager() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albumPath, setAlbumPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Albums Photos" },
  ]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const openConfirmationModal = (title: string, message: string, onConfirm: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setOnConfirmAction(() => onConfirm);
    setModalOpen(true);
  };
  

  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  useEffect(() => {
    if (role !== "admin") return;
    const fetchAlbumsAndPhotos = async () => {
      setLoading(true);
      setErrorMessage(null);

      console.log("📌 Chargement des albums et photos...");

      // 📌 Récupérer les dossiers et fichiers depuis Supabase Storage
      const { data, error } = await supabase.storage.from("photo").list(albumPath[albumPath.length - 1].id || "");

      if (error) {
        console.error("❌ Erreur de récupération des fichiers :", error);
        setErrorMessage("Impossible de charger les albums et photos.");
        setLoading(false);
        return;
      }

      console.log("✅ Fichiers récupérés depuis Supabase Storage :", data);

      // 📌 Filtrer les dossiers (albums) et fichiers (photos)
      const newAlbums: Album[] = [];
      const newPhotos: Photo[] = [];

      data.forEach((item) => {
        if (item.name.startsWith(".")) return; // Ignorer les fichiers système
      
        const currentPath = albumPath[albumPath.length - 1].id || "";
      
        if (!item.metadata) {
          // 📁 Dossier (album)
          newAlbums.push({
            id: currentPath ? `${currentPath}/${item.name}` : item.name,
            name: item.name,
            createdAt: "-",
            parent_id: currentPath || null,
          });
        } else {
          // 🖼️ Fichier (photo)
          const filePath = currentPath ? `${currentPath}/${item.name}` : item.name;
          const publicUrl = supabase.storage.from("photo").getPublicUrl(filePath).data.publicUrl;
      
          const size = item.metadata?.size
            ? (item.metadata.size / 1024).toFixed(2) + " KB"
            : "-";
      
          newPhotos.push({
            id: item.name,
            name: item.name,
            url: publicUrl,
            size,
            createdAt: item.metadata.lastModified
              ? new Date(item.metadata.lastModified).toLocaleString()
              : "-",
            album_id: currentPath,
          });
        }
      });
      

      setAlbums(newAlbums);
      setPhotos(newPhotos);
      setLoading(false);
    };

    fetchAlbumsAndPhotos();
  }, [albumPath]);

  // 📌 Naviguer dans un album
  const handleAlbumClick = (albumId: string, albumName: string) => {
    setAlbumPath([...albumPath, { id: albumId, name: albumName }]);
  };

  // 📌 Revenir en arrière dans les albums
  const handleBreadcrumbClick = (index: number) => {
    setAlbumPath(albumPath.slice(0, index + 1));
  };

  // 📌 Ajout d'un nouvel album
  const handleAddAlbum = async () => {
    if (!newAlbumName.trim()) return;

    const albumPathName = albumPath[albumPath.length - 1].id || "";

    const { error } = await supabase.storage.from("photo").upload(`${albumPathName}/${newAlbumName}/.emptyFolderPlaceholder`, new Blob([""]));

    if (error) {
      console.error("❌ Erreur d'ajout de l'album :", error);
    } else {
      setAlbums([...albums, { id: newAlbumName, name: newAlbumName, createdAt: "-" }]);
      setIsAlbumModalOpen(false);
      setNewAlbumName("");
    }
  };

  const handleDeletePhoto = (photo: Photo) => {
    openConfirmationModal(
      "Supprimer la photo",
      `Voulez-vous vraiment supprimer la photo "${photo.name}" ?`,
      async () => {
        const { error } = await supabase.storage.from("photo").remove([`${photo.album_id}/${photo.name}`]);
        if (error) {
          console.error("❌ Erreur de suppression :", error);
          alert("Erreur de suppression !");
        } else {
          setPhotos(photos.filter((p) => p.id !== photo.id));
        }
        setModalOpen(false);
      }
    );
  };
  
  
  const handleDeleteAlbum = (album: Album) => {
    openConfirmationModal(
      "Supprimer l'album",
      `Voulez-vous vraiment supprimer l'album "${album.name}" et tout son contenu ?`,
      async () => {
        const { data, error } = await supabase.storage.from("photo").list(album.id);
        if (error) {
          console.error("❌ Erreur de récupération des fichiers :", error);
          alert("Erreur lors de la suppression !");
          setModalOpen(false);
          return;
        }
  
        if (data.length > 0) {
          const filesToDelete = data.map((file) => `${album.id}/${file.name}`);
          await supabase.storage.from("photo").remove(filesToDelete);
        }
  
        const { error: deleteError } = await supabase.storage.from("photo").remove([`${album.id}/.emptyFolderPlaceholder`]);
  
        if (deleteError) {
          console.error("❌ Erreur de suppression de l'album :", deleteError);
          alert("Erreur lors de la suppression !");
        } else {
          setAlbums(albums.filter((a) => a.id !== album.id));
        }
        setModalOpen(false);
      }
    );
  };
  
  


  const handleUploadPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    setUploading(true);
    const albumPathName = albumPath[albumPath.length - 1].id || "";

    for (const file of event.target.files) {
      const filePath = `${albumPathName}/${file.name}`;

      const { error } = await supabase.storage.from("photo").upload(filePath, file);

      if (error) {
        console.error(`❌ Erreur d'upload du fichier ${file.name} :`, error);
      } else {
        const publicUrl = supabase.storage.from("photo").getPublicUrl(filePath).data.publicUrl;

        setPhotos((prevPhotos) => [
          ...prevPhotos,
          {
            id: file.name,
            name: file.name,
            url: publicUrl,
            size: (file.size / 1024).toFixed(2) + " KB",
            createdAt: new Date().toLocaleString(),
            album_id: albumPathName,
          },
        ]);
      }
    }

    setUploading(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 bg-white rounded-lg w-full mx-auto mt-8" style={{ fontFamily: "Calibri, sans-serif" }}>

        {/* 📌 Navigation & Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-gray-700 text-lg">
            {albumPath.map((album, index) => (
              <span key={album.id || "root"} className="flex items-center">
                {index > 0 && <FaChevronRight className="mx-2 text-gray-500" />}
                <button onClick={() => setAlbumPath(albumPath.slice(0, index + 1))} className="hover:underline">
                  {album.name}
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setIsAlbumModalOpen(true)} className="text-green-600 flex items-center gap-2">
              <FaPlus /> Ajouter un album
            </button>
            <label className="text-blue-600 flex items-center gap-2 cursor-pointer">
              <FaUpload /> Ajouter des photos
              <input type="file" multiple onChange={handleUploadPhotos} className="hidden" />
            </label>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Chargement en cours...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : (
          <>
            {/* 📌 Tableau des albums et photos */}
            <div className="overflow-auto max-h-[700px] border border-gray-300 rounded-md">
            <table className="w-full border border-gray-300 text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-t border-b p-4 text-left">Nom</th>
                  <th className="border-t border-b p-4 text-left">Créé le</th>
                  <th className="border-t border-b p-4 text-left">Taille</th>
                  <th className="border-b p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {albums.map((album) => (
                  <tr
                    key={album.id}
                    className="border-b text-md hover:bg-gray-50 cursor-pointer"
                    onDoubleClick={() => handleAlbumClick(album.id, album.name)}
                  >
                    <td className="p-4 flex items-center gap-2">
                      <FaFolder className="text-yellow-500" />
                      {album.name}
                    </td>
                    <td className="p-4">{album.createdAt}</td>
                    <td className="p-4">-</td>
                    <td className="p-4 flex justify-center gap-4">
                    <button onClick={() => handleDeleteAlbum(album)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                    </td>
                  </tr>
                ))}

                {photos.map((photo) => (
                  <tr key={photo.id} className="border-b text-md hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-2 cursor-pointer" onClick={() => setPreviewImage(photo.url)}>
                      <img
                        src={photo.url}
                        alt={photo.name}
                        width={50}
                        height={50}
                        className="w-10 h-10 object-cover rounded"
                      />
                      {photo.name}
                    </td>
                    <td className="p-4">{photo.createdAt}</td>
                    <td className="p-4">{photo.size}</td>
                    <td className="p-4 flex justify-center gap-4">
                    <button onClick={() => handleDeletePhoto(photo)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}

        <ModalConfirm
          isOpen={modalOpen}
          title={modalTitle}
          message={modalMessage}
          onCancel={() => setModalOpen(false)}
          onConfirm={onConfirmAction}
        />

        {/* ✅ Modale de prévisualisation */}
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
            <img src={previewImage} alt="Aperçu de l'image" width={800} height={800} className="max-w-screen-lg max-h-screen-lg rounded-lg" />
          </div>
        )}

         {/* 📌 Modal d'ajout d'album */}
         {isAlbumModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg relative">
              <button onClick={() => setIsAlbumModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
                <FaTimes />
              </button>
              <h2 className="text-lg font-bold mb-4">Créer un album</h2>
              <input type="text" value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} className="border p-2 w-full" placeholder="Nom de l'album" />
              <button onClick={handleAddAlbum} className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg">Créer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
