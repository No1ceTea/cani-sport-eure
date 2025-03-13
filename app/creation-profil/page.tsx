"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";


const supabase = createClientComponentClient();

export default function UserProfileForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    photo_profil: "",
    date_de_naissance: "",
    date_renouvellement: "",
    licence: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [chiens, setChiens] = useState<{ id: string; prenom: string }[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserProfile = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erreur lors de la récupération de la session:", error.message);
        return;
      }

      if (session) {
        const profileId = session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from("profils")
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError.message);
        } else {
          setForm(prevForm => ({
            ...prevForm,
            id: profileData.id,
            nom: profileData.nom,
            prenom: profileData.prenom,
            email: profileData.email,
            telephone: profileData.telephone ?? "",
            adresse: profileData.adresse ?? "",
            photo_profil: profileData.photo_profil ?? "",
            date_de_naissance: profileData.date_de_naissance ?? "",
            date_renouvellement: profileData.date_renouvellement ?? "",
            licence: profileData.licence ?? "",
          }));

          if (profileData.photo_profil) {
            setPhotoPreview(profileData.photo_profil);
          }

              // Récupérer les chiens associés
              const { data: chiensData, error: chiensError } = await supabase
              .from("chiens")
              .select("id, prenom")
              .eq("id_profil", profileId);

            if (chiensError) {
              console.error("Erreur chiens:", chiensError.message);
            } else {
              setChiens(chiensData ?? []);
            }
          }
        }
        };



    fetchUserProfile();
  }, [isMounted]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image.");
      return;
    }

    setImage(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.photo_profil;

    if (image) {
      const uniqueFileName = `${uuidv4()}-${image.name}`;
      const { data, error } = await supabase.storage.from("images").upload(`profils/${uniqueFileName}`, image);
      if (error) {
        alert("Erreur lors du téléchargement de l'image.");
        console.error("Erreur lors du téléchargement de l'image:", error.message);
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase.from("profils").upsert([
      { ...form, photo_profil: imageUrl, id: form.id },
    ]);

    if (error) {
      alert("Une erreur est survenue lors de l'enregistrement.");
      console.error("Erreur lors de l'enregistrement:", error.message);
    } else {
      alert("Le profil a été enregistré avec succès !");
    }
    setLoading(false);
  };

  if (!isMounted) return null;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
      <h1 className="absolute top-6 left-6 text-4xl primary_title !text-black">Profil utilisateur</h1>
      <div className="flex flex-col items-center h-auto w-[630px] bg-[#475C99] text-black p-8 rounded-xl shadow-lg border-4 border-black">
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="photo-upload" className="cursor-pointer">
            {photoPreview ? (
              <img src={photoPreview} alt="Photo de profil" className="w-32 h-32 object-cover rounded-lg shadow-lg" />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-lg text-gray-500">
                Ajouter une photo
              </div>
            )}
          </label>
          <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <div className="space-y-4 w-full">
          {(["nom", "prenom", "telephone", "adresse", "date_de_naissance", "date_renouvellement", "licence"] as (keyof typeof form)[]).map((field) => (
            <div key={field} className="flex items-center">
              <label className="text-sm w-40 text-white capitalize">{field.replace(/_/g, " ")}</label>
              <input
                type={field.includes("date") ? "date" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="flex-1 p-2 text-black rounded-lg"
              />
            </div>
          ))}
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Email</label>
            <input name="email" value={form.email} className="flex-1 p-2 text-gray-500 bg-gray-300 rounded-lg" disabled />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {chiens.map((chien) => (
            <button 
              key={chien.id} 
              onClick={() => router.push(`/creation-chien/${chien.id}`)} 
              className="bg-white px-3 py-1 rounded-full text-black shadow-md hover:bg-gray-300"
            >
              {chien.prenom}
            </button>
          ))}
          <button onClick={() => router.push("/creation-chien")} className="bg-white px-3 py-1 rounded-full text-black shadow-md">+</button>
        </div>

        {/* Boutons */}
        <div className="flex justify-center items-center mt-6 space-x-4 pb-4">
          <button onClick={handleSubmit} className="bg-white text-black rounded-full px-6 py-2 text-[15px] font-sans shadow-md">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}
