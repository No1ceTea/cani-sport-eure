"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import Footer from "@/app/components/sidebars/Footer";
import Sidebar from "@/app/components/sidebars/Sidebar";

interface ImageData {
  url: string;
  name: string;
  createdAt: string;
}

const GalleryPage = () => {
  const { album } = useParams();
  const [images, setImages] = useState<ImageData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // ✅ Ajout de l'aperçu d'image
  const decodedAlbum = decodeURIComponent(album as string);

  useEffect(() => {
    const fetchImages = async () => {
      if (!decodedAlbum) return;
  
      setLoading(true);
      const { data, error } = await supabase.storage.from("photo").list(decodedAlbum);
  
      if (error) {
        console.error("Erreur lors de la récupération des images :", error);
        setLoading(false);
        return;
      }
  
      const imageUrls = data
        .filter((file) => file.name.match(/\.(png|jpe?g|gif|bmp|webp)$/i))
        .map((file) => ({
          url: supabase.storage.from("photo").getPublicUrl(`${decodedAlbum}/${file.name}`).data.publicUrl || "",
          name: file.name,
          createdAt: file.created_at || "",
        }));
  
      setImages(imageUrls);
      setLoading(false);
    };
  
    fetchImages();
  }, [decodedAlbum]);

  // 🔹 FILTRAGE AVEC DATES CORRECTES 🔹
  const filteredImages = images.filter((image) => {
    const imageDate = image.createdAt ? new Date(image.createdAt) : null;

    console.log("🟡 Filtrage de l'image :", image.name);
    console.log("➡ Image Date :", imageDate);
    console.log("➡ Start Date :", startDate ? new Date(startDate) : "Pas de start date");
    console.log("➡ End Date :", endDate ? new Date(endDate + "T23:59:59") : "Pas de end date");

    const matchesSearch = searchTerm === "" || image.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = startDate === "" || (imageDate && imageDate >= new Date(startDate));
    const matchesEndDate = endDate === "" || (imageDate && imageDate <= new Date(`${endDate}T23:59:59`));

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // ✅ Fermer la prévisualisation en appuyant sur `Échap`
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
    <div className="min-h-screen pr-8 pl-8 py-12" style={{ backgroundImage: "url('/fond.png')", backgroundSize: "cover" }}>
      <Sidebar />
      <h1 className="text-3xl font-bold mb-8 text-left text-black" 
      style={{
        fontSize: "36px",
        fontFamily: "opendyslexic, sans-serif",
      }}>Galerie de {decodedAlbum}</h1>

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
        <p className="text-gray-500 font-calibri text-left">Chargement des images...</p>
      ) : filteredImages.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filteredImages.map((image, index) => (
            <div key={index} className="mb-4 cursor-pointer" onClick={() => setPreviewImage(image.url)}>
              <Image
                src={image.url}
                alt={image.name}
                width={500}
                height={500}
                className="w-full h-auto object-cover border-2 border-black rounded-lg"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 font-calibri text-left">Aucune image disponible.</p>
      )}

      {/* ✅ Modale de prévisualisation */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold"
              onClick={() => setPreviewImage(null)}
            >
              ✖
            </button>
            <Image
              src={previewImage}
              alt="Aperçu de l'image"
              width={800}
              height={800}
              className="max-w-screen-lg max-h-screen-lg rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default GalleryPage;
