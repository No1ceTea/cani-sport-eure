import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddArticleModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient(); // ✅ Création du client ici
  const router = useRouter();

  const sanitizeFileName = (filename: string) => {
    return filename
      .normalize("NFD")                    // Supprime les accents
      .replace(/[\u0300-\u036f]/g, "")    // Supprime les diacritiques
      .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // Remplace caractères spéciaux/espaces par _
  };
  

  useEffect(() => {
    const checkUser = async () => {
      // 🔹 Vérifie la session utilisateur
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        console.log("🔴 Utilisateur non connecté");
        return;
      }

      // 🔹 Récupération des infos utilisateur
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.log("❌ Erreur récupération utilisateur :", error);
        return;
      }

      setUserId(userData.user.id);
      setIsLoading(false);
    };

    checkUser();
  }, [supabase]); // ✅ Supprime supabase.auth des dépendances

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      const cleanName = sanitizeFileName(image.name);
      const uniqueFileName = `${uuidv4()}-${cleanName}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`publications/${uniqueFileName}`, image);

      if (error) {
        console.error("Erreur upload image:", error.message);
        alert("Erreur upload image.");
        return;
      }

      imageUrl = data?.path ? supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl : "";
    }

    const { data, error } = await supabase.from("publication").insert([
      {
        titre: title,
        contenu: content,
        id_profil: userId,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error("Erreur création article:", error);
      alert("Erreur création article.");
    } else {
      console.log("✅ Article créé:", data);
      alert("Article créé avec succès!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[780px] h-[571px] shadow-lg relative flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-black pb-2">
          <h2 className="text-xl font-semibold">Ajouter un article</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              placeholder="Titre"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
          <div className="flex items-center justify-start">
            <input type="file" className="border p-2" onChange={handleImageChange} />
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <button className="bg-blue-700 text-white py-2 px-6 rounded" onClick={handleSubmit}>
            Créer l&apos;article
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddArticleModal;
