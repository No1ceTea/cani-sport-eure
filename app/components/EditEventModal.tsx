import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import supabase from "../../lib/supabaseClient";
import './AddEvent.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

const EditEventModal: React.FC<ModalProps> = ({ isOpen, onClose, articleId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [isInternal, setIsInternal] = useState<boolean>(false);
  const [idGoogle, setIdGoogle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("evenements")
        .select("titre, contenu, image_url, date, type, id_google, heure_debut, heure_fin")
        .eq("id", articleId)
        .single();

      if (error) {
        console.error("Erreur récupération événement :", error);
      } else {
        setTitle(data.titre);
        setContent(data.contenu);
        setDate(data.date?.split("T")[0] || "");
        setStartTime(data.heure_debut || "10:00");
        setEndTime(data.heure_fin || "11:00");
        setIsInternal(data.type === "interne");
        setIdGoogle(data.id_google || null);
      }
    };

    if (articleId) fetchArticle();
  }, [articleId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const updateGoogleCalendar = async () => {
    if (!idGoogle) return;

    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;
    
    if (!accessToken) {
      alert("Impossible d'obtenir l'access token Google.");
    }
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    const res = await fetch("/api/calendar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: idGoogle,
        title,
        description: content,
        start: startDateTime,
        end: endDateTime,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Erreur Google Calendar :", error);
      alert("Mise à jour dans Google Calendar échouée.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (image) {
      const uniqueFileName = `${uuidv4()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`event/${uniqueFileName}`, image);

      if (error) {
        console.error("Erreur image :", error);
        alert("Échec du téléchargement d'image.");
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage.from("images").getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase
      .from("evenements")
      .update({
        titre: title,
        contenu: content,
        date,
        type: isInternal ? "interne" : "externe",
        image_url: imageUrl || undefined,
        heure_debut: startTime,
        heure_fin: endTime,
      })
      .eq("id", articleId);

    if (error) {
      console.error("Erreur Supabase :", error);
      alert("Erreur lors de la mise à jour.");
    } else {
      await updateGoogleCalendar();
      alert("Événement mis à jour !");
      onClose();
    }

    setLoading(false);
  };

  if (!isOpen) return null;

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
          <div className="mb-3 flex items-center justify-between">
            <div className="w-[65%]">
              <label className="block text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-[30%]">
              <label className="block text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded mb-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <label className="block text-gray-700 mb-1">Heure de début</label>
              <input
                type="time"
                className="w-full p-2 border rounded mb-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <label className="block text-gray-700 mb-1">Heure de fin</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Contenu</label>
            <textarea
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
                checked={isInternal}
                onChange={() => setIsInternal(!isInternal)}
              />
              <span className="slider round"></span>
            </label>
            <span className="ml-2">{isInternal ? "Interne" : "Externe"}</span>
          </div>

          <div className="flex items-center justify-start">
            <input type="file" className="border p-2" onChange={handleImageChange} />
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <button
            className="bg-blue-700 text-white py-2 px-6 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
