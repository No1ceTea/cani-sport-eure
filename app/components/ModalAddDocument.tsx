"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaTimes } from "react-icons/fa";

// 📌 Connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ModalAddDocumentProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddDocument: React.FC<ModalAddDocumentProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");

  // 📌 Fonction pour gérer l'upload
  const handleUpload = async () => {
    if (!file || !title) {
      setMessage("❌ Veuillez remplir tous les champs.");
      return;
    }

    setUploading(true);
    setMessage("📡 Upload en cours...");

    const filePath = `club-documents/${file.name}`;

    // 📌 Étape 1 : Upload du fichier dans Supabase Storage
    const { data, error } = await supabase.storage
    .from("club-documents") // ✅ Bucket correct
    .upload(`documents/${file.name}`, file, { upsert: true });

    if (error) {
        console.error("❌ Erreur d'upload :", error);
        setMessage("❌ Erreur lors de l'upload.");
        setUploading(false);
        return;
    }

    // 📌 Étape 2 : Récupération de l'URL publique
    const { data: publicUrlData } = supabase.storage.from("club-documents").getPublicUrl(filePath);

    const fileSize = file.size; // ✅ Récupération de la taille du fichier
    const fileType = file.type; // ✅ Récupération du type MIME du fichier
    const publicUrl = publicUrlData.publicUrl;

    // 📌 Étape 3 : Ajout dans la base de données
    const { error: dbError } = await supabase
    .from("club_documents")
    .insert([
      {
        name: file.name,
        file_url: publicUrl,
        type: fileType,
        size: fileSize, // ✅ Ajout de la taille du fichier
        created_at: new Date().toISOString(),
      }
    ]);
  
    if (dbError) {
        console.error("❌ Erreur d'insertion en base :", dbError);
        setMessage("❌ Erreur d'insertion en base.");
    } else {
        setMessage("✅ Fichier ajouté avec succès !");
    }

    setUploading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1000 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Bouton de fermeture */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">Ajouter un document</h2>

        {/* Nom du document */}
        <input
          type="text"
          placeholder="Nom du document"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        {/* Visibilité */}
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="public">Public</option>
          <option value="adherent">Adhérents</option>
          <option value="admin">Administrateurs</option>
        </select>

        {/* Upload fichier */}
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        {/* Bouton Upload */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {uploading ? "Upload en cours..." : "Ajouter un document"}
        </button>

        {/* Message d'état */}
        <p className="text-center text-sm mt-2">{message}</p>
      </div>
    </div>
  );
};

export default ModalAddDocument;
