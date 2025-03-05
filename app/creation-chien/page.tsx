"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PetProfileForm() {
  const [form, setForm] = useState({
    prenom: "",
    age: 0,
    race: "",
    date_de_naissance: "",
    numero_puce: "",
    utilisateur_id: "",
  });

  const [utilisateurId, setUtilisateurId] = useState<string | null>(null);

  // Récupérer l'ID utilisateur depuis une API ou un endpoint côté serveur
  useEffect(() => {
    const fetchUserId = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.user_id) {
        setUtilisateurId(data.user_id);
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "age" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = async () => {
    if (!utilisateurId) {
      console.error("ID utilisateur introuvable.");
      return;
    }

    const formData = { ...form, utilisateur_id: utilisateurId };

    const { data, error } = await supabase.from("chiens").upsert([formData]);
    if (error) {
      console.error("Erreur lors de l'enregistrement :", error.message);
    } else {
      console.log("Données enregistrées :", data);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("chiens")
      .delete()
      .eq("numero_de_puce", form.numero_puce);
    if (error) {
      console.error("Erreur lors de la suppression :", error);
    } else {
      console.log("Profil supprimé");
      setForm({
        prenom: "",
        age: 0,
        race: "",
        date_de_naissance: "",
        numero_puce: "",
        utilisateur_id: "",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[500px] h-[500px] bg-blue-900 text-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
        <div className="space-y-4 flex-grow">
          <div className="flex items-center">
            <label className="text-sm w-40">Prénom</label>
            <input
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="flex-1 p-2 text-black rounded"
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Âge</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="flex-1 p-2 text-black rounded"
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Race</label>
            <input
              name="race"
              value={form.race}
              onChange={handleChange}
              className="flex-1 p-2 text-black rounded"
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Date de naissance</label>
            <input
              type="date"
              name="date_de_naissance"
              value={form.date_de_naissance}
              onChange={handleChange}
              className="flex-1 p-2 text-black rounded"
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Numéro de puce</label>
            <input
              name="numero_puce"
              value={form.numero_puce}
              onChange={handleChange}
              className="flex-1 p-2 text-black rounded"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleSubmit}
            className="bg-white text-blue-900 px-4 py-2 rounded-lg shadow"
          >
            Enregistrer les modifications
          </button>
          <button onClick={handleDelete} className="text-white cursor-pointer">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
