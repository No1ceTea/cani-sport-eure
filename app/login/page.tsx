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
    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("authToken", "exampleToken");
      router.push("/"); // Redirige vers la page principale
    } else {
      alert("Identifiants incorrects !");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center px-8"
      style={{ backgroundImage: "url('/montagne.jpeg')" }} // Chemin vers votre image de fond
    >
    <div className="flex items-center justify-between w-full max-w-7xl">
      {/* Logo */}
      <div className="w-1/4 flex items-center justify-center">
        <Image
          src="/Logo-ContourBlanc-SansFond.png"
          alt="Logo Cani-Sports Eure"
          className="w-full max-w-xs"
          width={500}
          height={500}
        />
    </div>

    {/* Formulaire de connexion */}
    <div
      className="bg-blue bg-opacity-89 p-8 shadow-lg w-full max-w-2xl"
      style={{
        borderRadius: "67px",
        boxShadow: "0px 0px 26px 9px rgba(0, 0, 0, 0.25)",
      }}
    >
    <h2
      className="text-2xl font-bold text-center mb-6"
      style={{
        color: "white", // Connexion en blanc
        fontFamily: "opendyslexic, sans-serif", // Police OpenDyslexic
        fontSize: 30,
      }}
    >
      Connexion
    </h2>
    <form onSubmit={handleLogin} className="max-w-sm mx-auto">
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
            color: "white",
            fontFamily: "calibri, sans-serif",
          }}
        >
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              borderRadius: "9px",
              fontFamily: "calibri, sans-serif",
              color: "black",
            }}
            placeholder="Mot de passe"
            required
          />
          <Image
            src={showPassword ? "/hide-password.png" : "/display-password.png"}
            alt={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 w-6 h-6 transform -translate-y-1/2 cursor-pointer"
            width={20}
            height={20}
          />
        </div>
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
          marginTop: "40px",
          fontWeight: "bold",
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
    </div>
  );
}
