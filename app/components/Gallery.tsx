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
        console.log("📡 Début de fetchImages()");

        const { data, error } = await supabase.storage
          .from(bucketName)
          .list("", { limit: 100 });

        if (error) {
          console.error("❌ Erreur lors du .list() :", error);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("⚠️ Aucun fichier trouvé dans le bucket :", bucketName);
          return;
        }

        console.log("📝 Fichiers trouvés :", data.map((file) => file.name));

        // Filtrer les fichiers pour exclure celui qui a le lien spécifique
        const excludedUrl = "https://rgnnrsrdrrfzvjtfevim.supabase.co/storage/v1/object/public/photo/.emptyFolderPlaceholder";

        const filteredData = data.filter((file) => {
          const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${file.name}`;
          return fileUrl !== excludedUrl; // Exclure l'image avec ce lien
        });

        const imageUrls = filteredData.map((file) => {
          const generatedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${file.name}`;
          console.log(`✅ URL générée : ${generatedUrl}`);
          return generatedUrl;
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
      <h2 className="text-2xl font-bold text-center mb-6">Galerie d&apos;Images</h2>
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
