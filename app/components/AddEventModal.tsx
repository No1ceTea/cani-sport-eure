"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "./AddEvent.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEventModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [isExternal, setIsExternal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();
  const router = useRouter();

  // 🧠 Bloque le scroll de fond quand modal ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        console.log("🔴 Utilisateur non connecté");
        return;
      }

      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.error("❌ Erreur récupération utilisateur :", error);
        return;
      }

      setUserId(userData.user.id);
      setIsLoading(false);
    };

    checkUser();
  }, []);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      const uniqueFileName = `${uuidv4()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`evenements/${uniqueFileName}`, image);

      if (error) {
        console.error("Erreur upload image:", error.message);
        alert("Erreur lors du téléchargement de l'image.");
        return;
      }

      imageUrl = data?.path
        ? supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl
        : "";
    }

    const { error } = await supabase.from("evenements").insert([
      {
        titre: title,
        contenu: content,
        date,
        type: isExternal ? "Externe" : "Interne",
        image_url: imageUrl,
        id_profil: userId,
      },
    ]);

    if (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      alert("Erreur lors de la création de l'événement.");
    } else {
      alert("Événement créé avec succès!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[780px] h-[571px] shadow-lg relative flex flex-col justify-between">
        {/* En-tête */}
        <div className="flex justify-between items-center border-b border-black pb-2">
          <h2 className="text-xl font-semibold">Ajouter un événement</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="w-[65%]">
              <label className="block text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                placeholder="Titre"
                className="w-full p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-[30%]">
              <label className="block text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Contenu</label>
            <textarea
              placeholder="Contenu"
              className="w-full p-2 border rounded h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="mb-3 flex items-center">
            <label className="block text-gray-700 mb-1 mr-2">Statut</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={isExternal}
                onChange={() => setIsExternal(!isExternal)}
              />
              <span className="slider round"></span>
            </label>
            <span className="ml-2">{isExternal ? "Externe" : "Interne"}</span>
          </div>

          <div className="flex items-center justify-start">
            <input type="file" className="border p-2" onChange={handleImageChange} />
          </div>
        </div>

        {/* Bouton Submit */}
        <div className="flex justify-center pb-4">
          <button
            className="bg-blue-700 text-white py-2 px-6 rounded hover:bg-blue-800 transition"
            onClick={handleSubmit}
          >
            Créer un événement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
