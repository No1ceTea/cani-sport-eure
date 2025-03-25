"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";

const supabase = createClientComponentClient();

export default function PetProfileForm() {
  const router = useRouter();
  const { id } = useParams(); // ✅ Récupère l'ID du chien depuis l'URL

  const [form, setForm] = useState<{ [key: string]: string | number }>({
    prenom: "",
    age: "",
    race: "",
    date_de_naissance: "",
    numero_de_puce: "",
    numero_de_tatouage: "",
    photo_chien: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //verif authentification de l'user
  useEffect(() => {
    const checkUser = async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession.session) {
        router.replace("/connexion");
        return;
      }
      setUserId(userSession.session.user.id);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  //chargement des données du chien pour modfication
  useEffect(() => {
    if (id && id !== "new") {
      fetchChienData();
    }
  }, [id]);

  const fetchChienData = async () => {
    const { data, error } = await supabase.from("chiens").select("*").eq("id", id).single();

    if (error) {
      console.error("Erreur lors de la récupération du chien:", error.message);
    } else {
      setForm({
        prenom: data.prenom || "",
        age: data.age || 0,
        race: data.race || "",
        date_de_naissance: data.date_de_naissance || "",
        numero_de_puce: data.numero_de_puce || "",
        numero_de_tatouage: data.numero_de_tatouage || "",
        photo_chien: data.photo_chien || "",
      });
      
      if (data.photo_chien) {
        setPhotoPreview(data.photo_chien);
      }
    }
  };

  // Gestion upload image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImage(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  //gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: value,
      };
  
      if (name === "date_de_naissance") {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
  
        // Ajustement si l'anniversaire n'est pas encore passé cette année
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
  
        updatedForm.age = Math.max(age, 0); // âge ne peut pas être négatif
      }
  
      return updatedForm;
    });
  };
  


//soumission du formulaire
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!userId) {
    alert("⚠️ Vous devez être connecté pour enregistrer un chien.");
    return;
  }

  const chienId = id !== "new" && id ? id : uuidv4(); // ✅ Génère ou récupère l'ID

  const numero_de_puce = form.numero_de_puce as string;
  if (numero_de_puce && numero_de_puce.length !== 15) {
    alert("⚠️ Le numéro de puce doit contenir 15 caractères.");
    return;
  }

  const numero_de_tatouage = form.numero_de_tatouage as string;
  if (numero_de_tatouage && numero_de_tatouage.length !== 6) {
    alert("⚠️ Le numéro de tatouage doit contenir 6 caractères.");
    return;
  }

  let imageUrl = form.photo_chien as string;

  if (image) {
    const uniqueFileName = `${uuidv4()}-${image.name}`;
    const { data, error } = await supabase.storage.from("images").upload(`chiens/${uniqueFileName}`, image);

    if (error) {
      console.error("❌ Erreur lors du téléchargement de l'image:", error.message);
      alert("Erreur lors du téléchargement de l'image.");
      return;
    }

    imageUrl = supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl;
  }

  const payload = {
    id: chienId,
    ...form,
    photo_chien: imageUrl,
    id_profil: userId,
  };

  console.log("📤 Données envoyées à Supabase :", payload);

  const { error } = await supabase.from("chiens").upsert([payload]);

  if (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    alert("Erreur lors de l'enregistrement.");
  } else {
    alert("✅ Le profil du chien a été enregistré avec succès !");
    router.push("/creation-profil");
  }
};


  return (
    <div className="">
      <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
        <h1 className="absolute top-6 left-6 text-4xl primary_title !text-black">
          {id !== "new" ? "Modifier le profil du chien" : "Créer un profil chien"}
        </h1>

        <div className="flex flex-col items-center w-[630px] bg-[#475C99] text-black py-8 px-8 rounded-xl shadow-lg border-4 border-black">
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="photo-upload" className="cursor-pointer">
              {photoPreview ? (
                <img src={photoPreview} alt="Photo du chien" className="w-32 h-32 object-cover rounded-lg shadow-lg" />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-lg text-gray-500 text-center">
                  Ajouter une photo
                </div>
              )}
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="space-y-6 w-full">
          {["prenom", "race", "date_de_naissance"].map((field) => (
            <div key={field} className="flex items-center">
              <label className="text-sm w-40 text-white capitalize">{field.replace(/_/g, " ")}</label>
              <input
                name={field}
                value={form[field] as string}
                onChange={handleChange}
                className="flex-1 p-2 text-black rounded-lg"
              />
            </div>
          ))}

          {/* Champ personnalisé : numéro de puce ou tatouage */}
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Numéro de puce</label>
            <input
              name="numero_de_puce"
              value={form.numero_de_puce as string}
              onChange={handleChange}
              maxLength={15}
              className="flex-1 p-2 text-black rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40 text-white">Numéro de tatouage</label>
            <input
              name="numero_de_tatouage"
              value={form.numero_de_tatouage as string}
              onChange={handleChange}
              maxLength={6}
              className="flex-1 p-2 text-black rounded-lg"
            />
          </div>

            <div className="flex items-center">
              <label className="text-sm w-40 text-white">Âge</label>
              <input
                type="number"
                name="age"
                value={form.age as number}
                readOnly
                className="flex-1 p-2 text-black rounded-lg bg-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 space-x-4 pb-4">
            <button onClick={handleSubmit} className="bg-white text-black rounded-full px-6 py-2 text-[15px] font-sans shadow-md">
              Enregistrer les modifications
            </button>
            {id !== "new" && (
              <button className="text-white text-4xl cursor-pointer" onClick={() => console.log("TODO: Supprimer le chien")}>
                🗑
              </button>
            )}
          </div>
        </div>
      </div>
      <Sidebar />
      <Footer />    
    </div>
  );
}
