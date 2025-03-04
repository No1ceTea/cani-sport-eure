"use client";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PetProfileForm() {
  const [form, setForm] = useState({
    prenom: "",
    age: 0,
    race: "",
    dateNaissance: "",
    numeroPuce: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "age" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("chiens").upsert([form]);
    if (error) {
      console.error("Erreur lors de l'enregistrement :", error.message);
    } else {
      console.log("Données enregistrées :", data);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("chiens").delete().eq("numeroPuce", form.numeroPuce);
    if (error) {
      console.error("Erreur lors de la suppression :", error);
    } else {
      console.log("Profil supprimé");
      setForm({ prenom: "", age: 0, race: "", dateNaissance: "", numeroPuce: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[500px] h-[550px] bg-blue-900 text-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/dog.jpg"
            alt="Pet Profile"
            width={120}
            height={120}
            className="rounded-lg object-cover shadow-md"
          />
        </div>
        <div className="space-y-4 flex-grow">
          <div className="flex items-center">
            <label className="text-sm w-40">Prénom</label>
            <input name="prenom" value={form.prenom} onChange={handleChange} className="flex-1 p-2 text-black rounded" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Âge</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="flex-1 p-2 text-black rounded" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Race</label>
            <input name="race" value={form.race} onChange={handleChange} className="flex-1 p-2 text-black rounded" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Date de naissance</label>
            <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={handleChange} className="flex-1 p-2 text-black rounded" />
          </div>
          <div className="flex items-center">
            <label className="text-sm w-40">Numéro de puce</label>
            <input name="numeroPuce" value={form.numeroPuce} onChange={handleChange} className="flex-1 p-2 text-black rounded" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button onClick={handleSubmit} className="bg-white text-blue-900 px-4 py-2 rounded-lg shadow">Enregistrer les modifications</button>
          <button onClick={handleDelete} className="text-white cursor-pointer">🗑</button>
        </div>
      </div>
    </div>
  );
}
