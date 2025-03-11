"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaFolder, FaImage, FaChevronRight, FaTimes } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/SidebarAdmin";

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
  updatedAt?: string;
  description?: string;
  parent_id?: string | null;
  is_album: boolean;
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
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumPath, setAlbumPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Albums Photos" },
  ]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");

  useEffect(() => {
    const fetchAlbumsAndPhotos = async () => {
      let query = supabase.from("club_albums").select("*");
      
      if (albumPath.length > 1) {
        query = query.eq("parent_id", albumPath[albumPath.length - 1].id);
      } else {
        query = query.is("parent_id", null);
      }
      
      const { data: albumsData, error: albumError } = await query;
      if (albumError) {
        console.error("❌ Erreur de récupération des albums :", albumError);
      } else {
        setAlbums(albumsData.map((album) => ({
          id: album.id,
          name: album.name,
          createdAt: new Date(album.created_at).toLocaleString(),
          updatedAt: album.updated_at ? new Date(album.updated_at).toLocaleString() : "-",
          description: album.description,
          parent_id: album.parent_id,
          is_album: album.is_album,
        })));
      }

      // 📌 Récupération des photos
      const { data: photosData, error: photoError } = await supabase
        .from("club_photos")
        .select("*")
        .eq("album_id", albumPath[albumPath.length - 1].id || null);
      
      if (photoError) {
        console.error("❌ Erreur de récupération des photos :", photoError);
      } else {
        setPhotos(photosData.map((photo) => ({
          id: photo.id,
          name: photo.name,
          url: photo.file_url,
          size: (photo.size / 1024).toFixed(2) + " KB",
          createdAt: new Date(photo.created_at).toLocaleString(),
          album_id: photo.album_id,
        })));
      }
    };

    fetchAlbumsAndPhotos();
  }, [albumPath]);

  const handleDelete = async (id: string, isAlbum: boolean) => {
    const table = isAlbum ? "club_albums" : "club_photos";
    const { error } = await supabase.from(table).delete().match({ id });
    if (error) {
      console.error("❌ Erreur de suppression :", error);
    } else {
      if (isAlbum) {
        setAlbums(albums.filter((album) => album.id !== id));
      } else {
        setPhotos(photos.filter((photo) => photo.id !== id));
      }
    }
  };

  const handleAlbumClick = (albumId: string, albumName: string) => {
    setAlbumPath([...albumPath, { id: albumId, name: albumName }]);
  };

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
              <tr key={album.id} className="border-b text-md hover:bg-gray-50 cursor-pointer" onDoubleClick={() => handleAlbumClick(album.id, album.name)}>
                <td className="p-4 flex items-center gap-2">
                  <FaFolder className="text-yellow-500" />
                  {album.name}
                </td>
                <td className="p-4">{album.createdAt}</td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => handleDelete(album.id, true)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
