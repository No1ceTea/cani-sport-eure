"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import NavigationBar from "../components/NavigationBar";
import Image from "next/image";

export default function Inscription() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

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
      router.push("/");
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col min-h-screen">
        <div
          className="flex flex-col md:flex-row items-center justify-center flex-1 px-4 sm:px-8 bg-cover bg-center"
          style={{ backgroundImage: "url('/montagne.jpeg')" }}
        >
          {/* Formulaire */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 bg-blue-900 bg-opacity-90 rounded-2xl shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
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

              {/* Champ mot de passe */}
              <div className="form-control mb-4">
                <label className="label text-white">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
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
                  <input type="checkbox" className="checkbox checkbox-primary" required />
                  <span>
                    J&apos;accepte la{" "}
                    <span className="underline cursor-pointer text-blue-300" onClick={() => setShowModal(true)}>
                      politique de confidentialité
                    </span>
                  </span>
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
              <a href="/connexion" className="underline hover:text-blue-300">
                Je me connecte
              </a>
            </p>
          </div>

          {/* Logo secondaire à droite (masqué sur mobile) */}
          <div className="hidden md:flex items-center justify-center w-1/4">
            <Image
              src="/Logo-ContourBlanc-SansFond.png"
              alt="Logo Cani-Sports Eure"
              className="w-auto h-auto"
              width={200}
              height={200}
            />
          </div>
        </div>

        {/* Modal politique de confidentialité */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Politique de confidentialité</h3>
              <p>Ici, ajoutez le texte de votre politique de confidentialité.</p>
              <button className="btn btn-primary mt-4" onClick={() => setShowModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
