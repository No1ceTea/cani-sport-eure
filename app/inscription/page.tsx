"use client"; // Indique que ce composant s'exécute côté client

import { useState } from "react"; // Hook d'état React
import { useRouter } from "next/navigation"; // Navigation entre pages
import Sidebar from "../components/sidebars/Sidebar"; // Barre latérale

export default function Inscription() {
  const router = useRouter(); // Initialisation du routeur pour la navigation

  // États du formulaire
  const [email, setEmail] = useState(""); // Email de l'utilisateur
  const [password, setPassword] = useState(""); // Mot de passe
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation du mot de passe
  const [firstName, setFirstName] = useState(""); // Prénom
  const [lastName, setLastName] = useState(""); // Nom
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState<string | null>(null); // Message d'erreur
  const [passwordError, setPasswordError] = useState<string | null>(null); // Erreur spécifique au mot de passe
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Affichage de la modale de succès

  // Validation du mot de passe selon les normes européennes
  const validatePassword = (password: string): string | null => {
    if (password.length < 12)
      return "Le mot de passe doit contenir au moins 12 caractères.";
    if (!/[A-Z]/.test(password))
      return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(password))
      return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(password))
      return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[!@#$%^&+=*?/]/.test(password))
      return "Le mot de passe doit contenir au moins un caractère spécial.";
    if (/\s/.test(password))
      return "Le mot de passe ne doit pas contenir d'espaces.";
    return null;
  };

  // Validation dynamique du mot de passe lors de la saisie
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  // Soumission du formulaire d'inscription
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérification du mot de passe
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    // Appel à l'API d'inscription
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error); // Affichage de l'erreur retournée par l'API
    } else {
      // Affichage de la modale de succès et redirection
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
        {/* Conteneur principal avec image de fond */}
        <div
          className="flex flex-col md:flex-row items-center justify-center flex-1 px-4 sm:px-8 bg-cover bg-center"
          style={{ backgroundImage: "url('/photos/MainPage_bg.jpg')" }}
        >
          {/* Formulaire d'inscription */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 bg-blue-900 bg-opacity-90 rounded-2xl shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
              Inscription
            </h2>

            <form onSubmit={handleSignup}>
              {/* Affichage des erreurs */}
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

              {/* Champ mot de passe avec validation */}
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
                {passwordError && (
                  <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              {/* Confirmation du mot de passe */}
              <div className="form-control mb-4">
                <label className="label text-white">
                  Confirmer le mot de passe
                </label>
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

              {/* Acceptation de la politique de confidentialité */}
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

              {/* Bouton d'inscription */}
              <button
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

            {/* Lien vers la page de connexion */}
            <p className="text-center text-sm mt-4 text-white">
              Déjà inscrit ?{" "}
              <a href="/connexion" className="underline hover:text-blue-300">
                Je me connecte
              </a>
            </p>
          </div>
        </div>

        {/* Modale de confirmation d'inscription */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
              <h3 className="text-2xl font-bold mb-4">Inscription réussie !</h3>
              <p>
                Un email de confirmation vous a été envoyé. Vous serez redirigé
                vers la page de connexion.
              </p>
              <span className="loading loading-spinner mt-4"></span>
            </div>
          </div>
        )}
      </div>
      <Sidebar /> {/* Barre latérale de navigation */}
    </div>
  );
}
