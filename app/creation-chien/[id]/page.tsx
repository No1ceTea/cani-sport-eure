"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "../../components/sidebars/Sidebar";
import Footer from "../../components/sidebars/Footer";
import WhiteBackground from "../../components/backgrounds/WhiteBackground";

const supabase = createClientComponentClient();

export default function PetProfileForm() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState<{ [key: string]: string | number }>({
    prenom: "",
    age: 0,
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
      setForm({
        prenom: data.prenom ?? "",
        age: data.age ?? 0,
        race: data.race ?? "",
        date_de_naissance: data.date_de_naissance ?? "",
        numero_de_puce: data.numero_de_puce ?? "",
        numero_de_tatouage: data.numero_de_tatouage ?? "",
        photo_chien: data.photo_chien ?? "",
      });
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

    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: value ?? "",
      };

      if (name === "date_de_naissance") {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        updatedForm.age = Math.max(age, 0);
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("⚠️ Vous devez être connecté pour enregistrer un chien.");
      return;
    }

    const chienId = typeof id === "string" && id !== "new" ? id : uuidv4();

    const numeroPuce = form.numero_de_puce as string;
    const numeroTatouage = form.numero_de_tatouage as string;

    if (numeroPuce.length > 15) {
      alert("⚠️ Le numéro de puce ne peut pas dépasser 15 caractères.");
      return;
    }

    if (numeroTatouage && numeroTatouage.length < 6) {
      alert("⚠️ Le numéro de tatouage doit contenir au moins 6 caractères.");
      return;
    }

    let imageUrl = form.photo_chien as string;

    if (image) {
      const cleanFileName = image.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const uniqueFileName = `${uuidv4()}-${cleanFileName}`;

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
        id: chienId,
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
      router.push("/creation-profil");
    }
  };

  return (
    <div>
      <Sidebar />
      <WhiteBackground>
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-8">
          Modifier le profil du chien
        </h1>

        <div className="px-4 sm:px-6 pt-12 pb-12 flex justify-center">
          <div className="w-full max-w-screen-sm">
            <form
              onSubmit={handleSubmit}
              className="bg-[#475C99] text-black p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-black space-y-6"
            >
              {/* Photo */}
              <div className="flex flex-col items-center">
                <label htmlFor="photo-upload" className="cursor-pointer mb-2">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Photo du chien"
                      className="w-32 h-32 object-cover rounded-full shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-full text-black text-center text-sm font-medium">
                      Ajouter une photo
                    </div>
                  )}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Champs */}
              <div className="space-y-4">
                {[
                  { name: "prenom", label: "Prénom" },
                  { name: "race", label: "Race" },
                  {
                    name: "date_de_naissance",
                    label: "Date de naissance",
                    type: "date",
                    max: new Date().toISOString().split("T")[0],
                  },
                  { name: "numero_de_puce", label: "Numéro de puce", maxLength: 15 },
                  { name: "numero_de_tatouage", label: "Numéro de tatouage", maxLength: 6 },
                  { name: "age", label: "Âge", type: "number", readOnly: true },
                ].map(({ name, label, ...rest }) => (
                  <div key={name} className="flex flex-col">
                    <label className="text-white text-sm mb-1">{label}</label>
                    <input
                      name={name}
                      value={form[name] as string | number}
                      onChange={handleChange}
                      className={`p-2 rounded-md ${rest.readOnly ? "bg-gray-300 text-black cursor-not-allowed" : "text-black"}`}
                      {...rest}
                    />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-center items-center pt-6 space-x-6">
                <button
                  type="submit"
                  className="bg-white text-black rounded-full px-6 py-2 text-[15px] font-semibold shadow-md hover:bg-gray-200"
                >
                  Enregistrer les modifications
                </button>
                {id !== "new" && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-white text-3xl hover:text-red-500 transition"
                    title="Supprimer le chien"
                  >
                    🗑
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </WhiteBackground>
      <Footer />
    </div>
  );
}
