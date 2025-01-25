"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler une authentification réussie
    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("authToken", "exampleToken");
      router.push("/"); // Redirige vers la page principale
    } else {
      alert("Identifiants incorrects !");
    }
  };

  return (
    <div
      className="flex items-center justify-between h-screen bg-cover bg-center px-8"
      style={{ backgroundImage: "url('/montagne.jpeg')" }} // Chemin vers votre image de fond
    >
      {/* Logo */}
      <div className="w-1/3 flex items-center justify-center">
        <Image src="/logo-noir-SansFond.png" // Chemin vers votre logo
          alt="Logo Cani-Sports Eure"
          className="w-2/3 max-w-xs"
        />
      </div>

      {/* Formulaire de connexion */}
      <div
        className="bg-blue bg-opacity-89 p-8 shadow-lg w-full max-w-md"
        style={{
          borderRadius: "67px", // Border-radius du formulaire
        }}
      >
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{
            color: "white", // Connexion en blanc
            fontFamily: "opendyslexic, sans-serif", // Police OpenDyslexic
          }}
        >
          Connexion
        </h2>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{
                color: "white", // Label en blanc
                fontFamily: "calibri, sans-serif", // Police Calibri
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{
                borderRadius: "9px", // Border-radius des champs
                fontFamily: "calibri, sans-serif", // Police Calibri
                color: "black", // Texte en noir
              }}
              placeholder="Email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{
                color: "white", // Label en blanc
                fontFamily: "calibri, sans-serif", // Police Calibri
              }}
            >
              Mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{
                borderRadius: "9px", // Border-radius des champs
                fontFamily: "calibri, sans-serif", // Police Calibri
                color: "black", // Texte en noir
              }}
              placeholder="Mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Remember Me */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-sm"
              style={{
                color: "white", // Texte en blanc
                fontFamily: "calibri, sans-serif", // Police Calibri
              }}
            >
              Se souvenir de moi
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            style={{
              backgroundColor: "white", // Bouton en blanc
              color: "black", // Texte en noir
              borderRadius: "100px", // Border-radius du bouton
              fontFamily: "calibri, sans-serif", // Police Calibri
            }}
          >
            Se connecter
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm underline hover:text-blue-300"
            style={{
              color: "white", // Texte en blanc
              fontFamily: "calibri, sans-serif", // Police Calibri
            }}
          >
            Mot de passe oublié ?
          </a>
          <p
            className="text-sm mt-2"
            style={{
              color: "white", // Texte en blanc
              fontFamily: "calibri, sans-serif", // Police Calibri
            }}
          >
            Pas encore inscrit ?{" "}
            <a href="#" className="underline hover:text-blue-300">
              Inscription
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
