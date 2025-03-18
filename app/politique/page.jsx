"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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
        <h1 className="text-2xl font-bold text-center mb-4" style={{ fontFamily: 'Calibri, sans-serif' }}>
          Politique de Confidentialit&eacute;
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4" style={{ fontFamily: 'Calibri, sans-serif' }}>Derni&egrave;re mise &agrave; jour : 06 Mars 2025</p>
        <div className="h-64 overflow-y-auto p-2 border border-gray-300 rounded-lg">
          <p className="text-gray-700 text-sm" style={{ fontFamily: 'Calibri, sans-serif' }}>
            L&apos;association Cani Sport Eure accorde une grande importance &agrave; la protection de vos donn&eacute;es personnelles. Cette politique de confidentialit&eacute; d&eacute;crit comment nous collectons, utilisons, et prot&eacute;geons vos informations personnelles sur notre site vitrine.
            <br /><br />
            <strong>1. Collecte des donn&eacute;es personnelles</strong><br />
            Nous collectons les donn&eacute;es personnelles que vous nous fournissez volontairement lors de votre inscription &agrave; notre newsletter, votre participation &agrave; des &eacute;v&eacute;nements, ou lors de l&apos;utilisation du formulaire de contact. Les donn&eacute;es collect&eacute;es peuvent inclure votre nom, adresse e-mail, num&eacute;ro de t&eacute;l&eacute;phone, et toute autre information pertinente.
            <br /><br />
            <strong>2. Utilisation des donn&eacute;es personnelles</strong><br />
            Les informations personnelles que nous collectons sont utilis&eacute;es pour :
            <ul className="list-disc ml-5">
              <li>Vous fournir les informations et services demand&eacute;s.</li>
              <li>Vous envoyer des communications concernant nos activit&eacute;s, &eacute;v&eacute;nements, et actualit&eacute;s.</li>
              <li>Am&eacute;liorer notre site et nos services.</li>
            </ul>
            <br />
            <strong>3. Partage des donn&eacute;es personnelles</strong><br />
            Nous ne partageons pas vos informations personnelles avec des tiers, sauf si cela est n&eacute;cessaire pour fournir les services demand&eacute;s ou si la loi nous y oblige.
            <br /><br />
            <strong>4. S&eacute;curit&eacute; des donn&eacute;es</strong><br />
            Nous mettons en &oelig;uvre des mesures de s&eacute;curit&eacute; appropri&eacute;es pour prot&eacute;ger vos donn&eacute;es personnelles contre toute perte, utilisation abusive, acc&egrave;s non autoris&eacute;, divulgation, alt&eacute;ration ou destruction.
            <br /><br />
            <strong>5. Conservation des donn&eacute;es</strong><br />
            Nous conservons vos donn&eacute;es personnelles aussi longtemps que n&eacute;cessaire pour atteindre les objectifs pour lesquels elles ont &eacute;t&eacute; collect&eacute;es ou pour respecter les exigences l&eacute;gales applicables.
            <br /><br />
            <strong>6. Vos droits</strong><br />
            Vous avez le droit d&apos;acc&eacute;der &agrave; vos donn&eacute;es personnelles, de les corriger, de les supprimer, de limiter leur traitement, et de vous opposer &agrave; leur traitement. Vous pouvez exercer ces droits en nous contactant &agrave; l&apos;adresse suivante : <a href="mailto:g4simgamecs27@gmail.com" className="text-blue-600 underline">g4simgamecs27@gmail.com</a>.
            <br /><br />
            <strong>7. Cookies</strong><br />
            Notre site utilise des cookies pour am&eacute;liorer votre exp&eacute;rience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalit&eacute;s du site pourraient ne pas fonctionner correctement.
            <br /><br />
            <strong>8. Modifications de la politique de confidentialit&eacute;</strong><br />
            Nous nous r&eacute;servons le droit de modifier cette politique de confidentialit&eacute; &agrave; tout moment. Les modifications prendront effet d&egrave;s leur publication sur le site.
            <br /><br />
            <strong>9. Contact</strong><br />
            Pour toute question ou pr&eacute;occupation concernant notre politique de confidentialit&eacute;, veuillez nous contacter &agrave; l&apos;adresse suivante : <a href="mailto:g4simgamecs27@gmail.com" className="text-blue-600 underline">g4simgamecs27@gmail.com</a>.
          </p>
        </div>
        <div className="text-center mt-4">
          <button className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700" style={{ fontFamily: 'Calibri, sans-serif' }}>
          <Link href="/inscription">
            OK
          </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
