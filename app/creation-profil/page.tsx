"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import WhiteBackground from "../components/backgrounds/WhiteBackground";

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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserProfile = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return console.error("Erreur session:", error.message);

      if (session) {
        const profileId = session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from("profils")
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) {
          console.error("Erreur profil:", profileError.message);
        } else {
          setForm(prev => ({ ...prev, ...profileData }));
          if (profileData.photo_profil) setPhotoPreview(profileData.photo_profil);

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
    if (!e.target.files?.length) return;
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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeCodePostal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm(prev => ({ ...prev, code_postal: value }));

    if (value.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/fr/${value}`);
        if (!res.ok) throw new Error("Code postal non trouvé");
        const data = await res.json();
        const city = data.places?.[0]?.["place name"];
        if (city) setForm(prev => ({ ...prev, ville: city }));
      } catch (err) {
        console.error("Erreur ville:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = form.photo_profil;

    if (image) {
      const sanitized = image.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileName = `${uuidv4()}-${sanitized}`;

      const { data, error } = await supabase.storage.from("images").upload(`profils/${fileName}`, image);
      if (error) {
        alert("Erreur image.");
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase.from("profils").upsert([{ ...form, photo_profil: imageUrl, id: form.id }]);
    if (error) {
      alert("Erreur enregistrement.");
    } else {
      alert("Profil enregistré !");
    }

    setLoading(false);
  };

  const getAge = (dateString: string): number => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const age = getAge(form.date_de_naissance);
  if (!isMounted) return null;

  // ...imports et fonctions inchangés...

return (
  <div>
    <WhiteBackground>
      {/* Titre fixe en haut à gauche */}
      <div className="relative">
        <h1 className="absolute top-6 left-6 text-3xl sm:text-4xl primary_title !text-black">
          Profil utilisateur
        </h1>
      </div>

      {/* Contenu central du formulaire */}
      <div className="flex justify-center px-4 sm:px-6 pt-28 pb-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-screen-sm bg-[#475C99] p-6 sm:p-8 rounded-xl shadow-lg border-4 border-black space-y-4 text-black"
        >
          {/* Image de profil */}
          <div className="flex flex-col items-center">
            <label htmlFor="photo-upload" className="cursor-pointer mb-2">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Photo de profil"
                  className="w-32 h-32 object-cover rounded-full shadow-md"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-full text-black text-center text-sm font-medium">
                  Ajouter une photo
                </div>
              )}
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Champs utilisateur */}
          {[
            { name: "nom", label: "Nom" },
            { name: "prenom", label: "Prénom" },
            { name: "telephone", label: "Téléphone" },
            { name: "adresse", label: "Adresse" },
            { name: "code_postal", label: "Code postal", handler: handleChangeCodePostal },
            { name: "ville", label: "Ville" },
            { name: "date_de_naissance", label: "Date de naissance", type: "date" },
            { name: "date_renouvellement", label: "Date de renouvellement", type: "date" },
          ].map(({ name, label, type = "text", handler }) => (
            <div key={name} className="flex flex-col">
              <label className="text-white text-sm mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handler ?? handleChange}
                className="p-2 rounded-md text-black"
              />
            </div>
          ))}

          {/* Licence */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Licence</label>
            <select
              name="licence"
              value={form.licence}
              onChange={handleChange}
              className="p-2 rounded-md text-black"
            >
              <option value="">-- Sélectionner une licence --</option>
              {age >= 17 ? (
                <>
                  <option value="loisir_adulte">Licence loisir adulte</option>
                  <option value="loisir_adulte_handisport">Licence loisir adulte handisport</option>
                  <option value="competition_adulte">Licence compétition adulte</option>
                  <option value="competition_adulte_handisport">Licence compétition adulte handisport</option>
                </>
              ) : (
                <option value="Licence enfant">Licence enfant</option>
              )}
            </select>
          </div>

          {/* Email (readonly) */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Email</label>
            <input
              value={form.email}
              disabled
              className="p-2 bg-gray-300 text-gray-500 rounded-md"
            />
          </div>

          {/* Liste des chiens */}
          <div className="pt-4 flex flex-wrap gap-2">
            {chiens.map((chien) => (
              <button
                key={chien.id}
                onClick={() => router.push(`/creation-chien/${chien.id}`)}
                type="button"
                className="bg-white px-3 py-1 rounded-full text-black shadow-md hover:bg-gray-300"
              >
                {chien.prenom}
              </button>
            ))}
            <button
              type="button"
              onClick={() => router.push("/creation-chien")}
              className="bg-white px-3 py-1 rounded-full text-black shadow-md"
            >
              +
            </button>
          </div>

          {/* Bouton Enregistrer */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200"
            >
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
      <Sidebar />
    </WhiteBackground>
    <Footer />
  </div>
);
}
