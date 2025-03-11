"use client";
import React, { useState, useEffect } from "react";

const PrivacyPolicy = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Assurez-vous que le code est exécuté uniquement côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Retourner null pendant le rendu côté serveur
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[60%] max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>
          Politique de Confidentialité
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>Dernière mise à jour : 06 Mars 2025</p>
        <div className="h-64 overflow-y-auto p-2 border border-gray-300 rounded-lg">
          <p className="text-gray-700 text-sm" style={{ fontFamily: "Calibri, sans-serif" }}>
            L"association Cani Sport Eure accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité décrit comment nous collectons, utilisons, et protégeons vos informations personnelles sur notre site vitrine.
            <br /><br />
            <strong>1. Collecte des données personnelles</strong><br />
            Nous collectons les données personnelles que vous nous fournissez volontairement lors de votre inscription à notre newsletter, votre participation à des événements, ou lors de l"utilisation du formulaire de contact. Les données collectées peuvent inclure votre nom, adresse e-mail, numéro de téléphone, et toute autre information pertinente.
            <br /><br />
            <strong>2. Utilisation des données personnelles</strong><br />
            Les informations personnelles que nous collectons sont utilisées pour :
            <ul className="list-disc ml-5">
              <li>Vous fournir les informations et services demandés.</li>
              <li>Vous envoyer des communications concernant nos activités, événements, et actualités.</li>
              <li>Améliorer notre site et nos services.</li>
            </ul>
            <br />
            <strong>3. Partage des données personnelles</strong><br />
            Nous ne partageons pas vos informations personnelles avec des tiers, sauf si cela est nécessaire pour fournir les services demandés ou si la loi nous y oblige.
            <br /><br />
            <strong>4. Sécurité des données</strong><br />
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre toute perte, utilisation abusive, accès non autorisé, divulgation, altération ou destruction.
            <br /><br />
            <strong>5. Conservation des données</strong><br />
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les objectifs pour lesquels elles ont été collectées ou pour respecter les exigences légales applicables.
            <br /><br />
            <strong>6. Vos droits</strong><br />
            Vous avez le droit d"accéder à vos données personnelles, de les corriger, de les supprimer, de limiter leur traitement, et de vous opposer à leur traitement. Vous pouvez exercer ces droits en nous contactant à l"adresse suivante : <a href="mailto:g4simgamecs27@gmail.com" className="text-blue-600 underline">g4simgamecs27@gmail.com</a>.
            <br /><br />
            <strong>7. Cookies</strong><br />
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
            <br /><br />
            <strong>8. Modifications de la politique de confidentialité</strong><br />
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications prendront effet dès leur publication sur le site.
            <br /><br />
            <strong>9. Contact</strong><br />
            Pour toute question ou préoccupation concernant notre politique de confidentialité, veuillez nous contacter à l"adresse suivante : <a href="mailto:g4simgamecs27@gmail.com" className="text-blue-600 underline">g4simgamecs27@gmail.com</a>.
          </p>
        </div>
        <div className="text-center mt-4">
          <button className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700" style={{ fontFamily: "Calibri, sans-serif" }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
