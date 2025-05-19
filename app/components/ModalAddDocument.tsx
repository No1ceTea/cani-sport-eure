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
  currentFolderId: string | null;
  onUploadSuccess: () => void; // Nouvelle prop pour déclencher le rafraîchissement
}

const ModalAddDocument: React.FC<ModalAddDocumentProps> = ({
  isOpen,
  onClose,
  currentFolderId,
  onUploadSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage("❌ Veuillez sélectionner au moins un fichier.");
      return;
    }

    setUploading(true);
    setMessage("📡 Upload en cours...");
    
    let allFilesUploaded = true; // Pour tracker si tous les fichiers ont été uploadés avec succès

    // 📌 Itération sur chaque fichier sélectionné
    for (const file of selectedFiles) {
      try {
        const cleanFileName = sanitizeFileName(file.name);
        const filePath = `club-documents/${
          currentFolderId ? currentFolderId + "/" : ""
        }${cleanFileName}`;

        const { data, error } = await supabase.storage
          .from("club-documents")
          .upload(filePath, file, { upsert: true });

        if (error) {
          console.error("❌ Erreur d'upload :", error);
          setMessage("❌ Erreur lors de l'upload de " + file.name);
          allFilesUploaded = false;
          continue; // Passer au fichier suivant au lieu d'arrêter complètement
        }

        // 📌 Étape 2 : Récupération de l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from("club-documents")
          .getPublicUrl(filePath);

        const fileSize = file.size;
        const extension = file.name.split(".").pop()?.toLowerCase() || "file";
        const publicUrl = publicUrlData.publicUrl;

        // 📌 Étape 3 : Ajout dans la base de données avec le bon dossier parent
        const { error: dbError } = await supabase.from("club_documents").insert([
          {
            name: file.name, // Utilisation du nom du fichier directement
            file_url: publicUrl,
            type: extension,
            size: fileSize,
            created_at: new Date().toISOString(),
            parent_id: currentFolderId, // 🔹 Utilisation du dossier actuel
            access_level: visibility, // ✅ on l'ajoute ici
            is_folder: false, // Préciser que c'est un fichier et non un dossier
          },
        ]);

        if (dbError) {
          console.error("❌ Erreur d'insertion en base :", dbError);
          setMessage("❌ Erreur d'insertion en base pour " + file.name);
          allFilesUploaded = false;
        }
      } catch (error) {
        console.error("❌ Exception :", error);
        allFilesUploaded = false;
      }
    }

    setUploading(false);
    
    if (allFilesUploaded) {
      setMessage("✅ Tous les fichiers ont été ajoutés avec succès !");
      setUploadSuccess(true);
      
      // Attendre un court instant pour que l'utilisateur voie le message de succès
      setTimeout(() => {
        // Déclencher le rafraîchissement avant de fermer la modal
        onUploadSuccess();
        onClose();
        
        // Réinitialisation pour la prochaine utilisation
        setSelectedFiles([]);
        setMessage("");
        setVisibility("public");
        setUploadSuccess(false);
      }, 1000);
    } else {
      setMessage("⚠️ Certains fichiers n'ont pas pu être téléversés.");
    }
  };

  const sanitizeFileName = (name: string): string => {
    return name
      .normalize("NFD") // décompose les accents
      .replace(/[\u0300-\u036f]/g, "") // supprime les accents
      .replace(/[^a-zA-Z0-9.\-_]/g, "-") // remplace tout caractère non valide par "-"
      .replace(/-+/g, "-") // évite les tirets multiples
      .replace(/^-+|-+$/g, "") // supprime les tirets au début/fin
      .toLowerCase(); // tout en minuscule
  };

  // Remplacez la fonction handleFileChange
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Conversion de FileList en array pour faciliter la manipulation
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">
          Ajouter un document
        </h2>

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
          onChange={handleFileChange}
          className="mb-4 border p-2 w-full"
          multiple // Ajout de l'attribut multiple
        />

        {/* Affichage des fichiers sélectionnés */}
        <div className="mb-4">
          <p className="font-bold mb-2">
            Fichiers sélectionnés ({selectedFiles.length}):
          </p>
          <ul className="max-h-40 overflow-y-auto border rounded p-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex justify-between items-center py-1 border-b">
                <span className="truncate max-w-[300px]">{file.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton Upload */}
        <button
          onClick={handleUpload}
          disabled={uploading || uploadSuccess}
          className={`w-full py-2 rounded-lg text-white ${
            uploading || uploadSuccess
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
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
