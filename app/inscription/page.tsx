"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false); // Vérifie le montage côté client
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Assure que le rendu se fait uniquement côté client
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        alert("Votre compte est confirmé !");
        router.push("/");
      }
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, [isMounted, supabase, router]);

  if (!isMounted) {
    // Empêche le rendu côté serveur
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    if (!policyAccepted) {
      alert("Vous devez accepter la politique de confidentialité.");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        alert("Erreur lors de l'inscription : " + error.message);
        return;
      }

      alert(
        "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte."
      );
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center px-8"
      style={{ backgroundImage: "url('/montagne.jpeg')" }}
    >
      <div className="flex items-center justify-between w-full max-w-7xl">
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
              color: "white",
              fontFamily: "opendyslexic, sans-serif",
              fontSize: 30,
            }}
          >
            Inscription
          </h2>
          <form onSubmit={handleSignup} className="max-w-sm mx-auto">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{
                  color: "white",
                  fontFamily: "calibri, sans-serif",
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
                  borderRadius: "9px",
                  fontFamily: "calibri, sans-serif",
                  color: "black",
                }}
                placeholder="Email"
                required
              />
            </div>

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
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{
                    borderRadius: "9px",
                    fontFamily: "calibri, sans-serif",
                    color: "black",
                  }}
                  placeholder="Mot de passe"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{
                  color: "white",
                  fontFamily: "calibri, sans-serif",
                }}
              >
                Confirmation du mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  borderRadius: "9px",
                  fontFamily: "calibri, sans-serif",
                  color: "black",
                }}
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-2"
                style={{
                  color: "white",
                  fontFamily: "calibri, sans-serif",
                }}
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  borderRadius: "9px",
                  fontFamily: "calibri, sans-serif",
                  color: "black",
                }}
                placeholder="Prénom"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-2"
                style={{
                  color: "white",
                  fontFamily: "calibri, sans-serif",
                }}
              >
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  borderRadius: "9px",
                  fontFamily: "calibri, sans-serif",
                  color: "black",
                }}
                placeholder="Nom"
                required
              />
            </div>

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="policyAccepted"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
              <label
                htmlFor="policyAccepted"
                className="ml-2 text-sm"
                style={{
                  color: "white",
                  fontFamily: "calibri, sans-serif",
                }}
              >
                J&apos;accepte la{" "}
                <a href="#" className="underline hover:text-blue-300">
                  politique de confidentialité
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              style={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "100px",
                fontFamily: "calibri, sans-serif",
                fontWeight: "bold",
              }}
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
        <div className="w-1/4 flex items-center justify-center">
          <Image
            src="/Logo-ContourBlanc-SansFond.png"
            alt="Logo Cani-Sports Eure"
            className="w-full max-w-xs"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
