"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaFolder, FaChevronRight } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/SidebarAdmin";
import Image from "next/image";

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
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albumPath, setAlbumPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Albums Photos" },
  ]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
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
        if (item.name.startsWith(".")) return; // Ignorer les fichiers système (ex: .emptyFolderPlaceholder)

        if (!item.metadata) {
          // 📌 C'est un dossier (album)
          newAlbums.push({
            id: item.name,
            name: item.name,
            createdAt: "-",
            parent_id: albumPath[albumPath.length - 1].id || null,
          });
        } else {
          // 📌 C'est une photo
          const filePath = albumPath[albumPath.length - 1].id ? `${albumPath[albumPath.length - 1].id}/${item.name}` : item.name;
          const publicUrl = supabase.storage.from("photo").getPublicUrl(filePath).data.publicUrl;
          console.log("📸 Image URL :", publicUrl); // ✅ Debugging URL

          newPhotos.push({
            id: item.name,
            name: item.name,
            url: publicUrl,
            size: item.metadata.size ? (item.metadata.size / 1024).toFixed(2) + " KB" : "-",
            createdAt: item.metadata.lastModified ? new Date(item.metadata.lastModified).toLocaleString() : "-",
            album_id: albumPath[albumPath.length - 1].id || "",
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 bg-white rounded-lg w-full mx-auto mt-8" style={{ fontFamily: "Calibri, sans-serif" }}>

        {/* 📌 Navigation (Fil d'Ariane) */}
        <div className="flex items-center gap-2 mb-4 text-gray-700 text-lg">
          {albumPath.map((album, index) => (
            <span key={album.id || "root"} className="flex items-center">
              {index > 0 && <FaChevronRight className="mx-2 text-gray-500" />}
              <button onClick={() => handleBreadcrumbClick(index)} className="hover:underline">
                {album.name}
              </button>
            </span>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Chargement en cours...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : (
          <>
            {/* 📌 Tableau des albums et photos */}
            <table className="w-full border border-gray-300 text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-t border-b p-4 text-left">Nom</th>
                  <th className="border-t border-b p-4 text-left">Créé le</th>
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
                    <td className="p-4 flex justify-center gap-4">
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {photos.map((photo) => (
                  <tr key={photo.id} className="border-b text-md hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-2 cursor-pointer" onClick={() => setPreviewImage(photo.url)}>
                      <Image
                        src={photo.url}
                        alt={photo.name}
                        width={50}
                        height={50}
                        className="w-10 h-10 object-cover rounded"
                      />
                      {photo.name}
                    </td>
                    <td className="p-4">{photo.createdAt}</td>
                    <td className="p-4 flex justify-center gap-4">
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ✅ Modale de prévisualisation */}
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
            <Image src={previewImage} alt="Aperçu de l'image" width={800} height={800} className="max-w-screen-lg max-h-screen-lg rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
