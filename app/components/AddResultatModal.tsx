"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaTimes } from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ModalAdd = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  const [date, setDate] = useState("");
  const [temps, setTemps] = useState(""); // 👈 Champ time
  const [vitesse, setVitesse] = useState("");
  const [distance, setDistance] = useState("");
  const [region, setRegion] = useState("");
  const [lieu, setLieu] = useState("");
  const [nomActivite, setNomActivite] = useState("");
  const [kmAR, setKmAR] = useState("");
  const [classement, setClassement] = useState("");

  const [id_chien, setIdChien] = useState<string>("");
  const [id_profil, setIdProfil] = useState<string>("");
  const [id_categorie, setIdCategorie] = useState<string>("");
  const [id_type, setIdType] = useState<string>("");

  const [chiens, setChiens] = useState<any[]>([]);
  const [profils, setProfils] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: chiensData } = await supabase.from("chiens").select("*");
      const { data: profilsData } = await supabase.from("profils").select("*");
      const { data: catData } = await supabase.from("categorieResultat").select("*");
      const { data: typeData } = await supabase.from("resultatType").select("*");

      if (chiensData) setChiens(chiensData);
      if (profilsData) setProfils(profilsData);
      if (catData) setCategories(catData);
      if (typeData) setTypes(typeData);
    };

    fetchData();
  }, []);

  const handleAddResult = async () => {
    if (!date || !temps || !vitesse || !distance || !region || !lieu || !nomActivite || !id_chien || !id_profil || !id_categorie || !id_type) {
      setMessage("❌ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("resultats").insert([
      {
        date,
        temps,
        vitesse,
        distance,
        region,
        lieu,
        nomActivite,
        kmAR,
        classement,
        id_chien,
        id_profil,
        id_categorie,
        id_type,
      },
    ]);

    if (error) {
      console.error("❌ Erreur d'insertion :", error);
      setMessage("❌ Une erreur est survenue.");
    } else {
      setMessage("✅ Résultat ajouté avec succès !");
      onClose();
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Ajouter un Résultat</h2>
        <hr className="mb-6 border-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Relations */}
          <select value={id_chien} onChange={(e) => setIdChien(e.target.value)} className="p-3 border border-gray-300 rounded">
            <option value="">-- Sélectionner un chien --</option>
            {chiens.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prenom}
              </option>
            ))}
          </select>

          <select value={id_profil} onChange={(e) => setIdProfil(e.target.value)} className="p-3 border border-gray-300 rounded">
            <option value="">-- Sélectionner un participant --</option>
            {profils.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} {p.prenom}
              </option>
            ))}
          </select>

          <select value={id_categorie} onChange={(e) => setIdCategorie(e.target.value)} className="p-3 border border-gray-300 rounded">
            <option value="">-- Sélectionner une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom_categorie}
              </option>
            ))}
          </select>

          <select value={id_type} onChange={(e) => setIdType(e.target.value)} className="p-3 border border-gray-300 rounded">
            <option value="">-- Sélectionner un type --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nom_resultat}
              </option>
            ))}
          </select>

          {/* Champs simples */}
          <input type="date" value={date ?? ""} onChange={(e) => setDate(e.target.value)} className="p-3 border border-gray-300 rounded" />
          
          <input
            type="time"
            step="1"
            value={temps ?? ""}
            onChange={(e) => setTemps(e.target.value)}
            className="p-3 border border-gray-300 rounded"
            placeholder="Temps"
          />

          <input type="text" value={vitesse ?? ""} onChange={(e) => setVitesse(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="Vitesse" />
          <input type="text" value={distance ?? ""} onChange={(e) => setDistance(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="Distance" />
          <input type="text" value={region ?? ""} onChange={(e) => setRegion(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="Région" />
          <input type="text" value={lieu ?? ""} onChange={(e) => setLieu(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="Lieu" />
          <input type="text" value={nomActivite ?? ""} onChange={(e) => setNomActivite(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="Nom Activité" />
          <input type="text" value={kmAR ?? ""} onChange={(e) => setKmAR(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="km Aller-Retour" />
          <input type="text" value={classement ?? ""} onChange={(e) => setClassement(e.target.value)} className="p-3 border border-gray-300 rounded" placeholder="Classement" />
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleAddResult}
            disabled={loading}
            className="bg-blue-700 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-900"
          >
            {loading ? "Ajout en cours..." : "Ajouter le résultat"}
          </button>
        </div>

        {message && <p className="text-center text-sm mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ModalAdd;
