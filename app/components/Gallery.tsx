"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const supabase = createClientComponentClient();
const bucketName = "photo";

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // 🛠 Tenter d'afficher tous les fichiers stockés
        const { data, error } = await supabase.storage.from(bucketName).list("");
        console.log("📂 Réponse Supabase :", data, error);

        if (error) throw error;

        // 📌 Vérifie si les fichiers sont bien retournés
        if (!data || data.length === 0) {
          console.warn("⚠️ Aucun fichier trouvé dans le bucket.");
          return;
        }

        // 🔍 Étape 2 : Construire les URLs des images
        const imageUrls = data
          .filter((file) => file.name.match(/\.(png|jpg|jpeg|webp)$/i)) // Filtrer les images
          .map((file) => {
            const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
            console.log(`🖼️ URL générée pour ${file.name}:`, publicUrl);
            return publicUrl;
          });

        setImages(imageUrls);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des images :", err);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Galerie d'Images</h2>
      {images.length === 0 ? (
        <p className="text-center text-gray-500">Aucune image trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative w-full h-64">
              <Image
                src={url}
                alt={`Image ${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
