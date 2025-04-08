import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // Importation de la fonction uuidv4
import supabase from "../../lib/supabaseClient";
import './AddEvent.css'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

const EditEventModal: React.FC<ModalProps> = ({ isOpen, onClose, articleId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null); // État pour l'image
  const [date, setDate] = useState<string>(""); // État pour la date
  const [isInternal, setIsInternal] = useState<boolean>(false); // État pour le switch interne/externe
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("evenements")
        .select("titre, contenu, image_url, date, type")
        .eq("id", articleId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
      } else {
        setTitle(data.titre);
        setContent(data.contenu);
        // Formater la date au format "YYYY-MM-DD"
      if (data.date) {
        const formattedDate = new Date(data.date).toISOString().split("T")[0];
        setDate(formattedDate);
      }
      setIsInternal(data.type === "interne");
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    // Si une image est sélectionnée, on la télécharge
    if (image) {
      const uniqueFileName = `${uuidv4()}-${image.name}`; // Génération d'un nom unique pour l'image

      const { data, error } = await supabase.storage
        .from("images") // Nom du bucket dans Supabase
        .upload(`event/${uniqueFileName}`, image); // Utilisation du nom unique pour l'image

      if (error) {
        console.error("Erreur lors du téléchargement de l'image:", error.message);
        alert("Erreur lors du téléchargement de l'image.");
        setLoading(false);
        return;
      }

      // Si l'image est téléchargée avec succès, on obtient l'URL publique
      imageUrl = data?.path ? supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl : "";
    }

    // Mettre à jour l'article dans la base de données, avec ou sans image
    const { data, error } = await supabase
      .from("evenements")
      .update({
        titre: title,
        contenu: content,
        date: date, // Ajouter la date
        type: isInternal ? "interne" : "externe", // Mettre à jour le type en fonction du switch
        image_url: imageUrl || undefined, // On ajoute l'URL de l'image à la publication si elle existe
      })
      .eq("id", articleId);

    setLoading(false);

    if (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error); // Affichage complet de l'erreur
      alert("Erreur lors de la mise à jour de l'article.");
    } else {
      console.log("Article mis à jour avec succès:", data);
      alert("Article mis à jour avec succès!");
      onClose(); // Fermer la modal
    }
  };

  return (
    <div className="fixed z-[9999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[780px] h-[571px] shadow-lg relative flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-black pb-2">
          <h2 className="text-xl font-semibold">Modifier un événement</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div>
          {/* Align Title and Date on the Same Line */}
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

          {/* Switch for internal/external */}
          <div className="mb-3 flex items-center">
            <label className="block text-gray-700 mb-1 mr-2">Statut</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={() => setIsInternal(!isInternal)}
              />
              <span className="slider round"></span>
            </label>
            <span className="ml-2">{isInternal ? "Interne" : "Externe"}</span>
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
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
