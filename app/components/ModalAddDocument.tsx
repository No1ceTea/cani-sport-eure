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
  currentFolderId: string | null; // Ajout du parent_id pour classer le fichier
}

const ModalAddDocument: React.FC<ModalAddDocumentProps> = ({ isOpen, onClose, currentFolderId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;
  
  const handleUpload = async () => {
    if (!file || !title) {
      setMessage("❌ Veuillez remplir tous les champs.");
      return;
    }

    setUploading(true);
    setMessage("📡 Upload en cours...");

    const cleanFileName = sanitizeFileName(file.name);
    const filePath = `club-documents/${currentFolderId ? currentFolderId + '/' : ''}${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from("club-documents")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("❌ Erreur d'upload :", error);
      setMessage("❌ Erreur lors de l'upload.");
      setUploading(false);
      return;
    }

    // 📌 Étape 2 : Récupération de l'URL publique
    const { data: publicUrlData } = supabase.storage.from("club-documents").getPublicUrl(filePath);

    const fileSize = file.size;
    const extension = file.name.split(".").pop()?.toLowerCase() || "file";
    const publicUrl = publicUrlData.publicUrl;

    // 📌 Étape 3 : Ajout dans la base de données avec le bon dossier parent
    const { error: dbError } = await supabase
      .from("club_documents")
      .insert([
        {
          name: title,
          file_url: publicUrl,
          type: extension,
          size: fileSize,
          created_at: new Date().toISOString(),
          parent_id: currentFolderId, // 🔹 Utilisation du dossier actuel
          access_level: visibility, // ✅ on l'ajoute ici
        }
      ]);

    if (dbError) {
      console.error("❌ Erreur d'insertion en base :", dbError);
      setMessage("❌ Erreur d'insertion en base.");
    } else {
      setMessage("✅ Fichier ajouté avec succès !");
      setUploadSuccess(true); // ✅ bloque le bouton
      setTimeout(() => {
        onClose(); // ✅ fermeture automatique après un court délai
        // 🔄 optionnel : reset les champs
        setTitle("");
        setFile(null);
        setMessage("");
        setVisibility("public");
      }, 500); // petit délai pour laisser le message apparaître
    }

    setUploading(false);
  };
  
  const sanitizeFileName = (name: string): string => {
    return name
      .normalize("NFD")                           // décompose les accents
      .replace(/[\u0300-\u036f]/g, "")           // supprime les accents
      .replace(/[^a-zA-Z0-9.\-_]/g, "-")         // remplace tout caractère non valide par "-"
      .replace(/-+/g, "-")                       // évite les tirets multiples
      .replace(/^-+|-+$/g, "")                   // supprime les tirets au début/fin
      .toLowerCase();                            // tout en minuscule
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
          disabled={uploading || uploadSuccess}
          className={`w-full py-2 rounded-lg text-white ${
            uploading || uploadSuccess ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
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
