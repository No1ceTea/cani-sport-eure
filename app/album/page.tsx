"use client"; // Indique que ce composant s'exécute côté client

import { useEffect, useState } from "react"; // Hooks React
import { useRouter } from "next/navigation"; // Navigation entre pages
import supabase from "@/lib/supabaseClient"; // Client Supabase pour la base de données
import Image from "next/image"; // Composant image optimisé de Next.js
import Sidebar from "../components/sidebars/Sidebar"; // Barre latérale de navigation
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification
import Footer from "../components/sidebars/Footer"; // Pied de page

// Interface définissant la structure d'un album
interface AlbumData {
  name: string; // Nom de l'album
  coverUrl: string; // URL de l'image de couverture
  imageDates: string[]; // Dates des images de l'album pour le filtrage
}

const AlbumsPage = () => {
  // États pour la gestion des albums et des filtres
  const [albums, setAlbums] = useState<AlbumData[]>([]); // Liste des albums
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [startDate, setStartDate] = useState(""); // Filtre date de début
  const [endDate, setEndDate] = useState(""); // Filtre date de fin
  const [loading, setLoading] = useState(true); // État de chargement
  const router = useRouter(); // Router pour la navigation
  const { role, isLoading } = useAuth(); // Informations d'authentification

  // Protection de la route - redirection si non connecté
  useEffect(() => {
    if (!isLoading && role !== "admin" && role !== "adherent") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  // Hook d'effet vide (inutilisé)
  useEffect(() => {
    if (role !== "admin" && role !== "adherent") return;
  });

  // Récupération des albums depuis Supabase
  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      // Récupération des dossiers (albums) dans le stockage
      const { data: folders, error } = await supabase.storage.from("photo").list("", {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        console.error("Erreur lors de la récupération des albums :", error);
        setLoading(false);
        return;
      }

      // Pour chaque dossier, récupérer les images qu'il contient
      const albumPromises = folders.map(async (folder) => {
        try {
          const { data: images, error: imageError } = await supabase.storage.from("photo").list(folder.name, { limit: 100 });

          // Ignorer les dossiers sans images ou avec erreur
          if (imageError || !images || images.length === 0) {
            return null;
          }

          // Filtrer pour ne garder que les fichiers image
          const validImages = images.filter(img => img.name.match(/\.(png|jpe?g|gif|bmp|webp)$/i));
          if (validImages.length === 0) return null;

          // Utiliser la première image comme couverture
          const coverImage = validImages[0];

          // Récupérer les dates des images pour le filtrage
          const imageDates = validImages
            .map(img => img.created_at)
            .filter(date => date !== undefined) as string[];

          // Générer l'URL publique pour l'image de couverture
          const publicUrl = supabase.storage.from("photo").getPublicUrl(`${folder.name}/${coverImage.name}`).data?.publicUrl;

          return {
            name: folder.name,
            coverUrl: publicUrl || "/placeholder.png",
            imageDates,
          };
        } catch (error) {
          console.error(`❌ Erreur pour l'album ${folder.name}`, error);
          return null;
        }
      });

      // Attendre que toutes les promesses soient résolues et filtrer les valeurs null
      const resolvedAlbums = (await Promise.all(albumPromises)).filter((album) => album !== null) as AlbumData[];
      setAlbums(resolvedAlbums);
      setLoading(false);
    };

    fetchAlbums();
  }, []);

  // Filtrage des albums selon les critères de recherche et de date
  const filteredAlbums = albums.filter((album) => {
    // Vérifie si au moins une image de l'album est dans l'intervalle de dates choisi
    const albumHasImageInDateRange = album.imageDates.some((date) => {
      const imageDate = new Date(date);
      const matchesStartDate = startDate === "" || imageDate >= new Date(startDate);
      const matchesEndDate = endDate === "" || imageDate <= new Date(`${endDate}T23:59:59`);
      return matchesStartDate && matchesEndDate;
    });

    // Filtre par nom et par date
    return (searchTerm === "" || album.name.toLowerCase().includes(searchTerm.toLowerCase())) && albumHasImageInDateRange;
  });

  return (
    <div>
    <div className="min-h-screen pr-8 pl-8 py-12" style={{ backgroundImage: "url('/fond.png')", backgroundSize: "cover" }}>
      <Sidebar /> {/* Barre latérale de navigation */}
      {/* Titre de la page */}
      <h1 className="text-3xl font-bold mb-8 text-left text-black font-opendyslexic" 
      style={{
        fontSize: "36px",
        fontFamily: "opendyslexic, sans-serif",
      }}>Galerie d&apos;albums</h1>

      {/* Filtres de recherche et de date */}
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

      {/* Affichage conditionnel selon l'état de chargement et les résultats */}
      {loading ? (
        <p className="text-gray-500 font-calibri text-left">Chargement des albums...</p>
      ) : filteredAlbums.length > 0 ? (
        // Grille responsive d'albums
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filteredAlbums.map((album) => (
            // Album cliquable qui redirige vers la page de détails
            <div key={album.name} className="relative group cursor-pointer mb-4" onClick={() => router.push(`/gallery/${encodeURIComponent(album.name)}`)}>
              <Image src={album.coverUrl} alt={album.name} width={500} height={500} className="w-full h-auto object-cover border-2 border-black rounded-lg" />
              {/* Overlay au survol montrant le nom de l'album */}
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
    <Footer /> {/* Pied de page */}
    </div>
  );
};

export default AlbumsPage;
