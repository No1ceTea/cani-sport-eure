"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Inscription() {
  const supabase = createClientComponentClient(); // Initialise le client Supabase
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Vérifie que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    // Appelle Supabase pour créer un utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.user) {
      router.push("/"); // Redirection après succès
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center gap-32"
      style={{ backgroundImage: "url('/ton-image-de-fond.jpg')" }} // Remplace par ton image
    >
      {/* Logo */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/logo-noir-SansFond.png"
            alt="Logo Cani-Sports Eure"
            width={200}
            height={200}
            className="w-auto h-auto"
          />
        </div>

      {/* Formulaire d'inscription */}
      <div className="w-full max-w-md p-8 bg-blue-900 bg-opacity-90 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Inscription
        </h2>
        <form onSubmit={handleSignup}>
          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <span>{error}</span>
            </div>
          )}
          {/* Champ email */}
          <div className="form-control mb-4">
            <label className="label text-white">
              <span>Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          {/* Champ mot de passe */}
          <div className="form-control mb-4">
            <label className="label text-white">
              <span>Mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          {/* Confirmation mot de passe */}
          <div className="form-control mb-4">
            <label className="label text-white">
              <span>Confirmation de mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="Confirmation de mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          {/* Champ nom */}
          <div className="form-control mb-4">
            <label className="label text-white">
              <span>Nom</span>
            </label>
            <input
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          {/* Champ prénom */}
          <div className="form-control mb-4">
            <label className="label text-white">
              <span>Prénom</span>
            </label>
            <input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          {/* Politique de confidentialité */}
          <div className="form-control mb-6">
            <label className="label cursor-pointer text-white space-x-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                required
              />
              <span>J'accepte la politique de confidentialité</span>
            </label>
          </div>
          {/* Bouton d'inscription */}
          <button
            type="submit"
            className={`btn btn-primary w-full text-black bg-white border-none hover:bg-gray-100 ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-white">
          Déjà inscrit ?{" "}
          <a href="/login" className="underline hover:text-blue-300">
            Je me connecte
          </a>
        </p>
      </div>
    </div>
  );
}
