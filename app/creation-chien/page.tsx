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
    age: 0,
    race: "",
    date_de_naissance: "",
    numero_de_puce: "",
    photo_chien: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      setForm(data);
      if (data.photo_chien) {
        setPhotoPreview(data.photo_chien);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImage(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "age" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("⚠️ Vous devez être connecté pour enregistrer un chien.");
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

    const { error } = await supabase.from("chiens").upsert([
      {
        id: id !== "new" ? id : uuidv4(), // Si modification, conserve l'ID, sinon en génère un
        ...form,
        photo_chien: imageUrl,
        id_profil: userId,
      },
    ]);

    if (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error.message);
      alert("Erreur lors de l'enregistrement.");
    } else {
      alert("Le profil du chien a été enregistré avec succès !");
      router.push("/creation-profil");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("❗ Êtes-vous sûr de vouloir supprimer ce chien ?");
    if (!confirmDelete) return;
  
    const { error } = await supabase.from("chiens").delete().eq("id", id);
  
    if (error) {
      console.error("❌ Erreur lors de la suppression :", error.message);
      alert("Erreur lors de la suppression.");
    } else {
      alert("🐾 Chien supprimé avec succès !");
      router.push("/creation-profil"); // Redirige vers la liste après suppression
    }
  };

  
  return (
    <div className="">
      <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
        <h1 className="absolute top-6 left-6 text-4xl primary_title !text-black">
          {id !== "new" ? "Modifier le profil du chien" : "Créer un profil chien"}
        </h1>

        <div className="flex flex-col items-center h-[600px] w-[630px] bg-[#475C99] text-black p-8 rounded-xl shadow-lg border-4 border-black">
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

          <div className="space-y-6 w-full">
            {["prenom", "race", "date_de_naissance", "numero_de_puce"].map((field) => (
              <div key={field} className="flex items-center">
                <label className="text-sm w-40 text-white capitalize">{field.replace(/_/g, " ")}</label>
                <input
                  name={field}
                  value={form[field] as string} // 🔹 Type assertion pour éviter l'erreur
                  onChange={handleChange}
                  className="flex-1 p-2 text-black rounded-lg"
                />
              </div>
            ))}
            <div className="flex items-center">
              <label className="text-sm w-40 text-white">Âge</label>
              <input
                type="number"
                name="age"
                value={form.age as number}
                onChange={handleChange}
                className="flex-1 p-2 text-black rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center items-center mt-auto space-x-4 pb-4">
            <button onClick={handleSubmit} className="bg-white text-black rounded-full px-6 py-2 text-[15px] font-sans shadow-md">
              Enregistrer les modifications
            </button>
            {id !== "new" && (
              <button
              onClick={handleDelete}
              className="text-white text-4xl cursor-pointer hover:text-red-500 transition"
              title="Supprimer le chien"
            >
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