"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import Sidebar from "../components/sidebars/Sidebar";
import { useAuth } from "@/app/components/Auth/AuthProvider";


interface AlbumData {
  name: string;
  coverUrl: string;
  imageDates: string[]; // Stocke toutes les dates des images de l'album
}

const AlbumsPage = () => {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && role !== "admin" && role !== "adherent") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  useEffect(() => {
    if (role !== "admin" && role !== "adherent") return;
  });

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      const { data: folders, error } = await supabase.storage.from("photo").list("", {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        console.error("Erreur lors de la récupération des albums :", error);
        setLoading(false);
        return;
      }

      const albumPromises = folders.map(async (folder) => {
        try {
          const { data: images, error: imageError } = await supabase.storage.from("photo").list(folder.name, { limit: 100 });

          if (imageError || !images || images.length === 0) {
            return null;
          }

          const validImages = images.filter(img => img.name.match(/\.(png|jpe?g|gif|bmp|webp)$/i));
          if (validImages.length === 0) return null;

          const coverImage = validImages[0]; // Prend la première image comme couverture

          // 🔹 Stocke **toutes** les dates des images de l’album
          const imageDates = validImages
            .map(img => img.created_at)
            .filter(date => date !== undefined) as string[]; // Enlever les `undefined`

          console.log(`✅ Album: ${folder.name}, Dates des images:`, imageDates); // DEBUG

          const publicUrl = supabase.storage.from("photo").getPublicUrl(`${folder.name}/${coverImage.name}`).data?.publicUrl;

          return {
            name: folder.name,
            coverUrl: publicUrl || "/placeholder.png",
            imageDates, // Stocker toutes les dates des images
          };
        } catch (error) {
          console.error(`❌ Erreur pour l'album ${folder.name}`, error);
          return null;
        }
      });

      const resolvedAlbums = (await Promise.all(albumPromises)).filter((album) => album !== null) as AlbumData[];
      setAlbums(resolvedAlbums);
      setLoading(false);
    };

    fetchAlbums();
  }, []);

  // 🔹 FILTRAGE AVEC BONNE LOGIQUE 🔹
  const filteredAlbums = albums.filter((album) => {
    const albumHasImageInDateRange = album.imageDates.some((date) => {
      const imageDate = new Date(date);
      const matchesStartDate = startDate === "" || imageDate >= new Date(startDate);
      const matchesEndDate = endDate === "" || imageDate <= new Date(`${endDate}T23:59:59`);
      return matchesStartDate && matchesEndDate;
    });

    console.log(`🟡 Filtrage album: ${album.name}, Contient une image dans l'intervalle: ${albumHasImageInDateRange}`);

    return (searchTerm === "" || album.name.toLowerCase().includes(searchTerm.toLowerCase())) && albumHasImageInDateRange;
  });

  return (
    <div className="min-h-screen pr-8 pl-8 py-12" style={{ backgroundImage: "url('/fond.png')", backgroundSize: "cover" }}>
      <Sidebar />
      <h1 className="text-3xl font-bold mb-8 text-left text-black font-opendyslexic" 
      style={{
        fontSize: "36px",
        fontFamily: "opendyslexic, sans-serif",
      }}>Galerie d&apos;albums</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher une image"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-secondary p-3 rounded-full text-black w-[500px] max-w-full"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border-2 border-secondary p-2 rounded-md text-black"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border-2 border-secondary p-2 rounded-md text-black"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 font-calibri text-left">Chargement des albums...</p>
      ) : filteredAlbums.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filteredAlbums.map((album) => (
            <div key={album.name} className="relative group cursor-pointer mb-4" onClick={() => router.push(`/gallery/${encodeURIComponent(album.name)}`)}>
              <Image src={album.coverUrl} alt={album.name} width={500} height={500} className="w-full h-auto object-cover border-2 border-black rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <p className="text-white font-bold text-lg">{album.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 font-calibri text-left">Aucun album disponible.</p>
      )}
    </div>
  );
};

export default AlbumsPage;
