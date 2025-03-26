"use client";

import { login, signup } from "./actions";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div
        className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/photos/MainPage_bg.jpg')" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-32">
          <div className="hidden md:flex items-center justify-center">
            <Image
              src="/Logo-ContourBlanc-SansFond.png"
              alt="Logo Cani-Sports Eure"
              width={200}
              height={200}
              className="w-auto h-auto"
            />
          </div>

          <div className="card w-full max-w-sm bg-blue-900 bg-opacity-90 shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Connexion
            </h2>
            <form>
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
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
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
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
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

              <button
                formAction={login}
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
                  formAction={signup}
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
      <Footer />
    </div>
  );
}
