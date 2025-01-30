"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient"; // Fichier de configuration Supabase
import Image from "next/image";
import Navigation from "../components/NavigationBar";

interface ImageData {
  url: string;
  createdAt: string;
}

const GalleryPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fonction pour récupérer les images depuis Supabase
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from("photo").list();

      if (error) {
        console.error("Erreur lors de la récupération des images :", error);
        return;
      }

      // Construire les URLs publiques et récupérer les dates de création
      const imageUrls = data
        .filter((file) => file.name.endsWith(".png") || file.name.endsWith(".jpg") || file.name.endsWith(".jpeg"))
        .map((file) => ({
          url: supabase.storage.from("photo").getPublicUrl(file.name).data.publicUrl || "",
          createdAt: file.created_at || "", // Assurez-vous que `created_at` est présent
        }));

      setImages(imageUrls);
    };

    fetchImages();
  }, []);

  // Fonction de filtrage par texte et par dates
  const filteredImages = images.filter((image) => {
    const matchesSearch = searchTerm === "" || image.url.toLowerCase().includes(searchTerm.toLowerCase());

    const imageDate = new Date(image.createdAt);
    const matchesStartDate = startDate === "" || imageDate >= new Date(startDate);

    // Fin de la journée pour la date de fin
    const endDateObj = endDate ? new Date(endDate + "T23:59:59") : null;
    const matchesEndDate = endDate === "" || (endDateObj && imageDate <= endDateObj);

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div
      className="min-h-screen p-8 top-0"
      style={{
        backgroundImage: "url('/fond.png')",
        backgroundSize: "70%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white",
        backgroundPosition: "right",
      }}
    >
      <h1
        className="text-3xl font-bold mb-8"
        style={{
          fontFamily: "opendyslexic, sans-serif",
          color: "black",
        }}
      >
        Galerie de photo
      </h1>
      {/* Navigation bar */}
      <Navigation />
      {/* Filtres de recherche */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Barre de recherche */}
        <div
          className="flex items-center px-4 py-2 border w-full sm:w-auto"
          style={{
            backgroundColor: "white",
            borderRadius: "25px",
            border: "2px solid #001f5c", // darkBlue
          }}
        >
          <input
            type="text"
            placeholder="Rechercher une photo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full font-calibri text-black"
          />
          <span role="img" aria-label="search" className="ml-2 text-gray-500">
            🔍
          </span>
        </div>

        {/* Filtre de date - Du */}
        <div
          className="flex items-center px-4 py-2 border w-full sm:w-auto"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "2px solid #001f5c", // darkBlue
            color:"black",
          }}
        >
          <label className="mr-2 font-calibri text-black">Du</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="outline-none" />
        </div>

        {/* Filtre de date - Au */}
        <div
          className="flex items-center px-4 py-2 border w-full sm:w-auto"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "2px solid #001f5c", // darkBlue
            color:"black",
          }}
        >
          <label className="mr-2 font-calibri text-black">Au</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="outline-none" />
        </div>
      </div>

      {/* Galerie des images */}
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        style={{
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => (
            <div key={index} className="mb-4">
              <Image
                src={image.url}
                alt={`Gallery image ${index}`}
                width={500}
                height={500}
                className="w-full h-auto object-cover border-2 border-black rounded-lg"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 font-calibri">Aucune image disponible.</p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
