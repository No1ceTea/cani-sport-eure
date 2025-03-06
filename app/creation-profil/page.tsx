"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; 
import { createClient } from "@supabase/supabase-js";

// Définir correctement le type des données
type FormData = {
  nom: string;
  prenom: string;
  age: number;
  email: string;
  date_de_naissance: Date;
  date_renouvellement: Date;
  license: string;
  chiens: string[];
  photo: File | null;
};

// Initialisation de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfileForm() {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [chiens, setChiens] = useState<string[]>(["NomChien1"]);
  const [photo, setPhoto] = useState<File | null>(null);

  // Fonction pour récupérer les données du profil de l'utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assure-toi que `userId` est bien défini ici
        const userId = "userId"; // Remplace par l'ID de l'utilisateur

        // Requête pour récupérer les données de l'utilisateur
        const { data, error } = await supabase
          .from("profils")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Erreur Supabase:", error.message);
          return;
        }

        // Si les données sont récupérées correctement, les remplir dans le formulaire
        setValue("nom", data.nom);
        setValue("prenom", data.prenom);
        setValue("age", data.age);
        setValue("email", data.email);
        setValue("date_de_naissance", data.date_de_naissance);
        setValue("date_renouvellement", data.date_renouvellement);
        setValue("license", data.license);
        setChiens(data.chiens || []);
        setPhoto(data.photoUrl ? new File([], data.photoUrl) : null);

      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    fetchProfile();
  }, [setValue]);

  // Fonction pour soumettre les données et mettre à jour le profil
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const userId = "userId"; // Remplace par l'ID de l'utilisateur

      // Upload de la photo si une nouvelle est sélectionnée
      let photoUrl = null;
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, photo, { upsert: true });

        if (uploadError) {
          console.error("Erreur lors de l'upload de l'image:", uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      // Mettre à jour les données de l'utilisateur dans la base de données
      const { error } = await supabase
        .from("profils")
        .upsert({
          id: userId,
          nom: data.nom,
          prenom: data.prenom,
          age: data.age,
          email: data.email,
          date_de_naissance: data.date_de_naissance,
          date_renouvellement: data.date_renouvellement,
          license: data.license,
          chiens: data.chiens,
          //photoUrl: photoUrl, // Ajouter l'URL de la photo si elle a été mise à jour
        });

      if (error) {
        console.error("Erreur lors de la mise à jour du profil:", error.message);
        return;
      }

      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }
  };

  const addChien = () => {
    setChiens([...chiens, `NomChien${chiens.length + 1}`]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-blue-700 p-6 rounded-2xl shadow-xl w-full max-w-2xl text-white"
      >
        {/* Image de profil cliquable */}
        <div className="flex justify-center mb-4">
          <label htmlFor="photo-upload">
            <img
              src={photo ? URL.createObjectURL(photo) : "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white cursor-pointer"
            />
          </label>
        </div>

        <input
          type="file"
          {...register("photo")}
          accept="image/*"
          onChange={handlePhotoChange}
          id="photo-upload"
          className="hidden"
        />

        {/* Champs du formulaire */}
        <div className="space-y-4">
          {[{ label: "Nom", name: "nom", type: "text" }, { label: "Prénom", name: "prenom", type: "text" }, { label: "Âge", name: "age", type: "number" }, { label: "Email", name: "email", type: "email" }].map(({ label, name, type }) => (
            <div key={name} className="flex items-center gap-2">
              <label className="w-32 text-left">{label} :</label>
              <input
                type={type}
                {...register(name as keyof FormData)}
                className="flex-1 input-field"
              />
            </div>
          ))}

          {/* Date de naissance */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-left">Date de naissance :</label>
            <div className="relative flex-1">
              <input
                type="date"
                {...register("date_de_naissance")}
                className="input-field"
              />
            </div>
          </div>

          {/* Date de renouvellement */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-left">Date de renouvellement :</label>
            <div className="relative flex-1">
              <input
                type="date"
                {...register("date_renouvellement")}
                className="input-field"
              />
            </div>
          </div>

          {/* Licence */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-left">Licence :</label>
            <input
              type="text"
              {...register("license")}
              className="flex-1 input-field"
            />
          </div>

          {/* Liste des chiens */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-left">Chiens :</label>
            <div className="flex-1 flex flex-wrap gap-2">
              {chiens.map((chien, index) => (
                <span key={index} className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm">
                  {chien}
                </span>
              ))}
              <button
                type="button"
                onClick={addChien}
                className="bg-blue text-white-700 px-3 py-1 rounded-full text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Bouton d'enregistrement */}
        <button
          type="submit"
          className="mt-4 w-1/2 bg-white text-black py-1 px-4 rounded-full font-bold text-sm block mx-auto"
        >
          Enregistrer les modifications
        </button>
      </form>

      {/* Styles globaux */}
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid black;
          color: black;
        }
        .relative {
          position: relative;
        }
        .icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
        
        .mt-4 w-full bg-white text-blue-700 py-2 rounded-lg font-bold {
          border radius : 50px;
        }
      `}</style>
    </div>
  );
}
