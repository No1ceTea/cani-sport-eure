"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid"; // Import pour générer un ID unique

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PetProfileForm() {
  const [form, setForm] = useState({
    prenom: "",
    age: 0,
    race: "",
    date_de_naissance: "",
    numero_de_puce: "",
    photo_chien: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Gestion de la sélection d'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImage(file);
    setPhotoPreview(URL.createObjectURL(file)); // Afficher l'aperçu de l'image
  };

  // Gestion des changements de texte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "age" ? parseInt(value, 10) || 0 : value,
    });
  };

  // 🔥 GESTION DE L'ENVOI DU FORMULAIRE AVEC TÉLÉCHARGEMENT D'IMAGE 🔥
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = form.photo_chien; // Conserver l'ancienne URL si aucune nouvelle image n'est sélectionnée

    // 📸 Si une image est sélectionnée, la télécharger dans Supabase Storage
    if (image) {
      const uniqueFileName = `${uuidv4()}-${image.name}`; // Génération d'un nom unique
      const { data, error } = await supabase.storage
        .from("images") // Remplace "images" par le nom réel de ton bucket
        .upload(`chiens/${uniqueFileName}`, image);

      if (error) {
        console.error("Erreur lors du téléchargement de l'image:", error.message);
        alert("Erreur lors du téléchargement de l'image.");
        return;
      }

      // Récupérer l'URL publique de l'image
      imageUrl = supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl;
    }

    // 🔥 Enregistrement des données du chien dans Supabase
    const { data, error } = await supabase.from("chiens").upsert([
      {
        ...form,
        photo_chien: imageUrl, // Stocker l'URL de l'image dans la base de données
      },
    ]);

    if (error) {
      console.error("Erreur lors de l'enregistrement :", error.message);
    } else {
      console.log("Données enregistrées :", data);
      alert("Le profil du chien a été enregistré avec succès !");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
      {/* Titre */}
      <h1 className="absolute top-6 left-6 text-4xl primary_title !text-black">
        Profil chien
      </h1>

      <div className="flex flex-col items-center h-[600px] w-[630px] bg-[#475C99] text-black p-8 rounded-xl shadow-lg border-4 border-black">
        {/* Upload de photo */}
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="photo-upload" className="cursor-pointer">
            {photoPreview ? (
              <img src={photoPreview} alt="Photo du chien" className="w-32 h-32 object-cover rounded-lg shadow-lg" />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-lg text-gray-500">
                Ajouter une photo
              </div>
            )}
          </label>
          <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Formulaire */}
        <div className="space-y-6 w-full">
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Prénom</label>
            <input name="prenom" value={form.prenom} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Âge</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Race</label>
            <input name="race" value={form.race} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Date de naissance</label>
            <input type="date" name="date_de_naissance" value={form.date_de_naissance} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Numéro de puce</label>
            <input name="numero_de_puce" value={form.numero_de_puce} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" />
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-center items-center mt-auto space-x-4 pb-4">
          <button onClick={handleSubmit} className="bg-white text-black rounded-full px-6 py-2 text-[15px] font-sans shadow-md">
            Enregistrer les modifications
          </button>
          <button className="text-white text-4xl cursor-pointer">🗑</button>
        </div>
      </div>
    </div>
  );
}
