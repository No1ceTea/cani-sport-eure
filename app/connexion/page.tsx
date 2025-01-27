"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import NavigationBar from "../components/NavigationBar";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fonction pour traduire les messages d'erreur en français
  const translateError = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Invalid login credentials":
        return "Identifiants de connexion invalides.";
      case "Email not confirmed":
        return "Votre adresse email n'a pas encore été confirmée.";
      case "User not found":
        return "Utilisateur non trouvé.";
      case "Password is incorrect":
        return "Le mot de passe est incorrect.";
      case "Email is required":
        return "L'email est requis.";
      case "Password is required":
        return "Le mot de passe est requis.";
      default:
        return "Une erreur est survenue. Veuillez réessayer.";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(translateError(error.message));
    } else if (data?.session) {
      router.push("/"); // Redirection vers la page d'accueil
    }
  };

  const redirectToSignup = () => {
    router.push("/inscription"); // Redirection vers la page d'inscription
  };

  return (
    <div>
      <NavigationBar />
      <div
        className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/ton-image-de-fond.jpg')" }}
      >
        {/* Conteneur principal */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-32">
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

          {/* Formulaire */}
          <div className="card w-full max-w-sm bg-blue-900 bg-opacity-90 shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Connexion
            </h2>
            <form onSubmit={handleLogin}>
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered input-primary w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Checkbox "Se souvenir de moi" */}
              <div className="form-control flex items-center mb-6">
                <label className="label cursor-pointer text-white space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                  />
                  <span>Se souvenir de moi</span>
                </label>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                className={`btn btn-primary w-full text-black bg-white border-none hover:bg-gray-100 ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            {/* Liens supplémentaires */}
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm underline text-white hover:text-blue-300"
              >
                Mot de passe oublié ?
              </a>
              <p className="text-sm mt-2 text-white">
                Pas encore inscrit ?{" "}
                <button
                  onClick={redirectToSignup}
                  className="underline hover:text-blue-300"
                >
                  Inscription
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
