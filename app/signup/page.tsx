"use client";

import { signup } from "./actions";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function SignupPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 🔍 Fonction de validation du mot de passe (Normes Européennes)
  const validatePassword = (password: string): string | null => {
    if (password.length < 12)
      return "Le mot de passe doit contenir au moins 12 caractères.";
    if (!/[A-Z]/.test(password))
      return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(password))
      return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(password))
      return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[!@#$%^&+=*?]/.test(password))
      return "Le mot de passe doit contenir au moins un caractère spécial.";
    if (/\s/.test(password))
      return "Le mot de passe ne doit pas contenir d'espaces.";
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérification stricte avant d'envoyer la requête
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    return (
      <div>
        <div className="flex flex-col min-h-screen">
          <div
            className="flex flex-col md:flex-row items-center justify-center flex-1 px-4 sm:px-8 bg-cover bg-center"
            style={{ backgroundImage: "url('/photos/MainPage_bg.jpg')" }}
          >
            {/* Formulaire */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 bg-blue-900 bg-opacity-90 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
                Inscription
              </h2>

              <form onSubmit={handleSignup}>
                {/* Message d'erreur global */}
                {error && (
                  <div className="alert alert-error shadow-lg mb-4">
                    <span>{error}</span>
                  </div>
                )}

                {/* Champ email */}
                <div className="form-control mb-4">
                  <label className="label text-white">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Champ mot de passe avec vérification dynamique */}
                <div className="form-control mb-4">
                  <label className="label text-white">Mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Mot de passe"
                    className="input input-bordered w-full"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div className="form-control mb-4">
                  <label className="label text-white">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmation"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Champ Nom */}
                <div className="form-control mb-4">
                  <label className="label text-white">Nom</label>
                  <input
                    id="last_name"
                    type="text"
                    placeholder="Nom"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Champ Prénom */}
                <div className="form-control mb-4">
                  <label className="label text-white">Prénom</label>
                  <input
                    id="first_name"
                    type="text"
                    placeholder="Prénom"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Politique de confidentialité */}
                <div className="form-control mb-6">
                  <label className="label cursor-pointer text-white space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-info"
                      required
                    />
                    <span>
                      J&apos;accepte la{" "}
                      <a href="/politique" className="hover:underline">
                        politique de confidentialité
                      </a>
                    </span>
                  </label>
                </div>

                {/* Bouton d'inscription désactivé si mot de passe non valide */}
                <button
                  formAction={signup}
                  type="submit"
                  className="btn btn-primary w-full text-black bg-white border-none hover:bg-gray-100"
                  disabled={loading || passwordError !== null}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "S'inscrire"
                  )}
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
        </div>
        <Sidebar />
        <Footer />
      </div>
    );
  };
}
