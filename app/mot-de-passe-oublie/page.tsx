"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`, // Page où l'utilisateur redéfinit son mot de passe
    });

    setLoading(false);

    if (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } else {
      setMessage(
        "Un e-mail de réinitialisation a été envoyé. Vérifiez votre boîte de réception."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-900">
      <div className="card w-full max-w-sm bg-white shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Mot de passe oublié
        </h2>
        {message && (
          <div className="alert alert-success shadow-lg mb-4">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error shadow-lg mb-4">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handlePasswordReset}>
          <div className="form-control mb-4">
            <label className="label">
              <span>Adresse e-mail</span>
            </label>
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Envoyer un e-mail"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/connexion"
            className="text-sm underline text-blue-500 hover:text-blue-700"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
