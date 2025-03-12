import { useState } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // Importation de la fonction uuidv4
import supabase from "../../lib/supabaseClient"; 
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddArticleModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null); // État pour l'image

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    // Si une image est sélectionnée, on la télécharge
    if (image) {
      const uniqueFileName = `${uuidv4()}-${image.name}`; // Génération d'un nom unique pour l'image

      const { data, error } = await supabase.storage
        .from("images") // Nom du bucket dans Supabase
        .upload(`publications/${uniqueFileName}`, image); // Utilisation du nom unique pour l'image

      if (error) {
        console.error("Erreur lors du téléchargement de l'image:", error.message);
        alert("Erreur lors du téléchargement de l'image.");
        return;
      }

      // Si l'image est téléchargée avec succès, on obtient l'URL publique
      imageUrl = data?.path ? supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl : "";
    }

    // Define idType and idAuteur
    const idType = 1; // Replace with appropriate value
    const idAuteur = 1; // Replace with appropriate value

    // Insérer l'article dans la base de données, avec ou sans image
    const { data, error } = await supabase
      .from("publication")
      .insert([
        {
          titre: title,
          contenu: content,
          
          image_url: imageUrl, // On ajoute l'URL de l'image à la publication
        },
      ]);

    if (error) {
      console.error("Erreur lors de la création de l'article:", error); // Affichage complet de l'erreur
      alert("Erreur lors de la création de l'article.");
    } else {
      console.log("Article créé avec succès:", data);
      alert("Article créé avec succès!");
      onClose(); // Fermer la modal
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
            <input
              type="file"
              className="border p-2"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <button
            className="bg-blue-700 text-white py-2 px-6 rounded"
            onClick={handleSubmit}
          >
            Créer l&apos;article
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddArticleModal;
