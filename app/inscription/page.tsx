"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";

export default function Inscription() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 🔍 Fonction de validation du mot de passe (Normes Européennes)
  const validatePassword = (password: string): string | null => {
    if (password.length < 12) return "Le mot de passe doit contenir au moins 12 caractères.";
    if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[!@#$%^&+=*?]/.test(password)) return "Le mot de passe doit contenir au moins un caractère spécial.";
    if (/\s/.test(password)) return "Le mot de passe ne doit pas contenir d'espaces.";
    return null;
  };

  // Gestion du changement de mot de passe avec validation instantanée
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
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

    // Envoi de la requête à l'API Next.js
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    });
  
    const data = await response.json();
    setLoading(false);
  
    if (!response.ok) {
      setError(data.error);
    } else {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/connexion");
      }, 5000);
    }
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <div
          className="flex flex-col md:flex-row items-center justify-center flex-1 px-4 sm:px-8 bg-cover bg-center"
          style={{ backgroundImage: "url('/photos/MainPage_bg.jpg')" }}
        >
          {/* Formulaire */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 bg-blue-900 bg-opacity-90 rounded-2xl shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">Inscription</h2>

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
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Champ mot de passe avec vérification dynamique */}
              <div className="form-control mb-4">
                <label className="label text-white">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                />
                {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
              </div>

              {/* Confirmation mot de passe */}
              <div className="form-control mb-4">
                <label className="label text-white">Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="Confirmation"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Champ Nom */}
              <div className="form-control mb-4">
                <label className="label text-white">Nom</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Champ Prénom */}
              <div className="form-control mb-4">
                <label className="label text-white">Prénom</label>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Politique de confidentialité */}
              <div className="form-control mb-6">
                <label className="label cursor-pointer text-white space-x-2">
                  <input type="checkbox" className="checkbox checkbox-info" required />
                  <span>J&apos;accepte la <a href="/politique" className="hover:underline">politique de confidentialité</a></span>
                </label>
              </div>

              {/* Bouton d'inscription désactivé si mot de passe non valide */}
              <button
                type="submit"
                className="btn btn-primary w-full text-black bg-white border-none hover:bg-gray-100"
                disabled={loading || passwordError !== null}
              >
                {loading ? <span className="loading loading-spinner"></span> : "S'inscrire"}
              </button>
            </form>

            <p className="text-center text-sm mt-4 text-white">
              Déjà inscrit ? <a href="/connexion" className="underline hover:text-blue-300">Je me connecte</a>
            </p>
          </div>
        </div>

        {/* Modal de succès */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
              <h3 className="text-2xl font-bold mb-4">Inscription réussie !</h3>
              <p>Un email de confirmation vous a été envoyé. Vous serez redirigé vers la page de connexion.</p>
              <span className="loading loading-spinner mt-4"></span>
            </div>
          </div>
        )}
      </div>
      <Sidebar />
      <Footer />
    </div>
  );
}
