"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../components/sidebars/Sidebar";
import { useAuth } from "../components/Auth/AuthProvider";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { role, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    if (savedPassword) {
      try {
        setPassword(atob(savedPassword)); // ✅ déchiffre
      } catch (e) {
        console.warn("Mot de passe corrompu dans le localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "adherent") {
        router.push("/");
      }
    }
  }, [role, isLoading]);

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

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }

    if (!data?.session) {
      setError("La connexion a échoué.");
      setLoading(false);
      return;
    }

    // ✅ Sauvegarde si la case est cochée
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", btoa(password)); // ✅ encodage
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      setError("Erreur lors de la récupération du profil.");
      setLoading(false);
      return;
    }

    const metadata = userData.user.user_metadata;
    const isAdmin = metadata?.administrateur === true;
    const isAdherent = metadata?.statut_inscription === "inscrit";

    if (isAdmin) {
      router.push("/dashboard/admin");
    } else if (isAdherent) {
      router.push("/");
    } else {
      setError("Votre compte n'est pas encore validé.");
    }

    setLoading(false);
  };

  const redirectToSignup = () => {
    router.push("/inscription");
  };

  return (
    <div>
      <div
        className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/photos/MainPage_bg.jpg')" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-32">
          {isClient && (
            <div className="hidden md:flex items-center justify-center">
              <Image
                src="/Logo-ContourBlanc-SansFond.png"
                alt="Logo Cani-Sports Eure"
                width={200}
                height={200}
                className="w-auto h-auto"
              />
            </div>
          )}

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

              {/* ✅ Case "Se souvenir de moi" */}
              <div className="form-control mb-4">
                <label className="cursor-pointer flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="checkbox checkbox-primary border-white"
                  />
                  <span>Se souvenir de moi</span>
                </label>
              </div>

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

            <div className="mt-6 text-center">
              <Link
                href="/mot-de-passe-oublie"
                className="text-sm underline text-white hover:text-blue-300"
              >
                Mot de passe oublié ?
              </Link>
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
      <Sidebar />
    </div>
  );
}
