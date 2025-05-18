"use client"; // Directive indiquant que ce composant s'exécute côté client

import React, { useState, useEffect } from "react"; // Import des hooks React
import Link from "next/link"; // Import du composant de navigation Next.js
import WhiteBackground from "../components/backgrounds/WhiteBackground"; // Import du fond blanc personnalisé

const PrivacyPolicy = () => {
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier si le composant est monté côté client

  // Effet pour s'assurer que le rendu se fait uniquement côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ne rien afficher pendant le rendu côté serveur
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <WhiteBackground>
        {" "}
        {/* Composant de fond blanc pour la mise en page */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[60%] max-w-2xl">
            {/* Titre de la page */}
            <h1
              className="text-2xl font-bold text-center mb-4"
              style={{ fontFamily: "Calibri, sans-serif" }}
            >
              Politique de Confidentialit&eacute;
            </h1>

            {/* Date de mise à jour */}
            <p
              className="text-center text-sm text-gray-500 mb-4"
              style={{ fontFamily: "Calibri, sans-serif" }}
            >
              Derni&egrave;re mise &agrave; jour : 06 Mars 2025
            </p>

            {/* Zone scrollable contenant la politique */}
            <div className="h-64 overflow-y-auto p-2 border border-gray-300 rounded-lg">
              <p
                className="text-gray-700 text-sm"
                style={{ fontFamily: "Calibri, sans-serif" }}
              >
                {/* Section d'introduction */}
                L&apos;association Cani Sport Eure accorde une grande importance
                &agrave; la protection de vos donn&eacute;es personnelles...
                {/* Section 1 - Collecte des données */}
                <br />
                <br />
                <strong>1. Collecte des donn&eacute;es personnelles</strong>
                <br />
                Nous collectons les donn&eacute;es personnelles que vous nous
                fournissez volontairement...
                {/* Sections 2 à 9 - Suite de la politique (utilisation, partage, sécurité, etc.) */}
                {/* ... */}
              </p>
            </div>

            {/* Bouton de validation qui renvoie vers la page d'inscription */}
            <div className="text-center mt-4">
              <button
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                style={{ fontFamily: "Calibri, sans-serif" }}
              >
                <Link href="/inscription">OK</Link>
              </button>
            </div>
          </div>
        </div>
      </WhiteBackground>
    </div>
  );
};

export default PrivacyPolicy; // Export du composant
