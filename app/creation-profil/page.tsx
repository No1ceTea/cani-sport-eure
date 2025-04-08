"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";
import { useAuth } from "@/app/components/Auth/AuthProvider";

const supabase = createClientComponentClient();

export default function UserProfileForm() {
  const router = useRouter();
  const { role, isLoading } = useAuth();

  const [form, setForm] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    code_postal: "",
    ville: "",
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
    if (!isLoading && role !== "admin" && role !== "adherent") {
      router.push("/connexion");
    }
  }, [role, isLoading, router]);

  useEffect(() => {
    if (role !== "admin" && role !== "adherent") return;
  });


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
            ...profileData,
          }));

          if (profileData.photo_profil) {
            setPhotoPreview(profileData.photo_profil);
          }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleChangeCodePostal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm(prevForm => ({ ...prevForm, code_postal: value }));

    if (value.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/fr/${value}`);
        if (!res.ok) throw new Error("Code postal non trouvé");

        const data = await res.json();
        const city = data.places?.[0]?.["place name"];
        if (city) {
          setForm(prevForm => ({ ...prevForm, ville: city }));
        }
      } catch (error) {
        console.error("Erreur ville:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    let imageUrl = form.photo_profil;
  
    // Fonction pour sécuriser le nom du fichier
    const sanitizeFileName = (name: string) =>
      name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");
  
    if (image) {
      const uniqueFileName = `${uuidv4()}-${sanitizeFileName(image.name)}`;
      console.log("Nom du fichier sécurisé :", uniqueFileName); // 🔍 debug
  
      const { data, error } = await supabase
        .storage
        .from("images")
        .upload(`profils/${uniqueFileName}`, image);
  
      if (error) {
        alert("Erreur lors du téléchargement de l'image.");
        console.error("Erreur image:", error.message);
        setLoading(false);
        return;
      }
  
      imageUrl = supabase
        .storage
        .from("images")
        .getPublicUrl(data.path)
        .data
        .publicUrl;
    }
  
    const { error } = await supabase.from("profils").upsert([
      { ...form, photo_profil: imageUrl, id: form.id },
    ]);
  
    if (error) {
      alert("Erreur lors de l'enregistrement.");
      console.error("Erreur:", error.message);
    } else {
      alert("Le profil a été enregistré avec succès !");
    }
  
    setLoading(false);
  };
  

  if (!isMounted) return null; 

  const getAge = (dateString: string): number => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const age = getAge(form.date_de_naissance);
  

  return (
    <div>
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

          {/* FORMULAIRE CHAMP PAR CHAMP */}
          <div className="space-y-4 w-full">
            <div className="flex items-center"><label className="text-sm w-40 text-white">Nom</label><input type="text" name="nom" value={form.nom} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Prénom</label><input type="text" name="prenom" value={form.prenom} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Téléphone</label><input type="text" name="telephone" value={form.telephone} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Adresse</label><input type="text" name="adresse" value={form.adresse} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Code postal</label><input type="text" name="code_postal" value={form.code_postal} onChange={handleChangeCodePostal} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Ville</label><input type="text" name="ville" value={form.ville} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Date de naissance</label><input type="date" name="date_de_naissance" value={form.date_de_naissance} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Date de renouvellement</label><input type="date" name="date_renouvellement" value={form.date_renouvellement} onChange={handleChange} className="flex-1 p-2 text-black rounded-lg" /></div>
            {/* LICENCE SELECT */}
            <div className="flex items-center">
              <label className="text-sm w-40 text-white">Licence</label>
              <select
                name="licence"
                value={form.licence}
                onChange={handleChange}
                className="flex-1 p-2 text-black rounded-lg"
              >
                <option value="">-- Sélectionner une licence --</option>
                {age >= 17 && (
                  <>
                  <option value="Licence adulte">Licence loisir adulte</option>
                  <option value="Licence adulte">Licence loisir adulte handisport</option>
                  <option value="Licence adulte">Licence compétition adulte</option>
                  <option value="Licence adulte">Licence compétition adulte handisport</option>
                  </>
                )}
                {age < 17 && (
                  <option value="Licence enfant">Licence enfant</option>
                )}
              </select>
            </div>
            <div className="flex items-center"><label className="text-sm w-40 text-white">Email</label><input name="email" value={form.email} className="flex-1 p-2 text-gray-500 bg-gray-300 rounded-lg" disabled /></div>
          </div>

          {/* CHIENS */}
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

          {/* BOUTON ENREGISTRER */}
          <div className="flex justify-center items-center mt-6 space-x-4 pb-4">
            <button onClick={handleSubmit} className="bg-white text-black rounded-full px-6 py-2 text-[15px] font-sans shadow-md">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
      <Sidebar />
      <Footer />
    </div>
  );
}
