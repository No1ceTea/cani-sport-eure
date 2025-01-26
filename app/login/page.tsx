"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavigationBar from "../components/NavigationBar"; // Assurez-vous que le chemin est correct

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("authToken", "exampleToken");
      router.push("/"); // Redirection après connexion réussie
    } else {
      alert("Identifiants incorrects !");
    }
  };

  return (
    <div>
      <NavigationBar />
      <div
        className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/ton-image-de-fond.jpg')" }} // Remplace par ton image
      >
        {/* Conteneur principal */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-32">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Image
              src="/logo-noir-SansFond.png" // Remplace par ton logo
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
                className="btn btn-primary w-full text-black bg-white border-none hover:bg-gray-100"
              >
                Se connecter
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
                <a href="#" className="underline hover:text-blue-300">
                  Inscription
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
