import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[60%] max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4" style={{ fontFamily: 'OpenDyslexic, sans-serif' }}>
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4" style={{ fontFamily: 'Calibri, sans-serif' }}>Dernière mise à jour : 06 Mars 2025</p>
        <div className="h-64 overflow-y-auto p-2 border border-gray-300 rounded-lg">
          <p className="text-gray-700 text-sm" style={{ fontFamily: 'Calibri, sans-serif' }}>
            Bienvenue sur le site de l'association Cani Sport Eure. En utilisant ce site, vous acceptez les présentes Conditions Générales d'Utilisation (CGU). Veuillez les lire attentivement.
            <br /><br />
            <strong>1. Objet du site</strong><br />
            Le site vitrine de l'association Cani Sport Eure (<a href="https://cani-sport-eure.vercel.app" className="text-blue-600 underline">https://cani-sport-eure.vercel.app</a>) a pour objectif de présenter les activités, événements, et informations relatives à l'association Cani Sport Eure.
            <br /><br />
            <strong>2. Accès au site</strong><br />
            L'accès au Site est gratuit. Toutefois, l'utilisateur est responsable de ses équipements informatiques et de l'accès à Internet. L'association Cani Sport Eure ne pourra être tenue responsable de tout dysfonctionnement lié à l'utilisation du Site.
            <br /><br />
            <strong>3. Propriété intellectuelle</strong><br />
            Tous les contenus (textes, images, vidéos, graphiques, logos, etc.) présents sur le Site sont la propriété de l'association Cani Sport Eure ou de leurs auteurs respectifs. Toute reproduction, distribution, modification ou utilisation sans autorisation écrite est strictement interdite.
            <br /><br />
            <strong>4. Données personnelles</strong><br />
            Les informations collectées sur le Site sont traitées conformément à la politique de confidentialité de l'association Cani Sport Eure. Les utilisateurs disposent d'un droit d'accès, de rectification et de suppression de leurs données personnelles, en contactant l'association via le formulaire de contact.
            <br /><br />
            <strong>5. Responsabilité</strong><br />
            L'association Cani Sport Eure s'efforce de fournir des informations exactes et à jour sur le Site. Cependant, elle ne saurait être tenue responsable des erreurs ou omissions, ni des éventuels dommages résultant de l'utilisation du Site.
            <br /><br />
            <strong>6. Liens externes</strong><br />
            Le Site peut contenir des liens vers des sites externes. L'association Cani Sport Eure n'a aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant à leur contenu ou à leur utilisation.
            <br /><br />
            <strong>7. Modification des CGU</strong><br />
            L'association Cani Sport Eure se réserve le droit de modifier les présentes Conditions Générales d'Utilisation à tout moment. Les modifications prendront effet dès leur publication sur le Site.
            <br /><br />
            <strong>8. Loi applicable</strong><br />
            Les présentes CGU sont soumises à la loi française. En cas de litige, les tribunaux français seront seuls compétents.
            <br /><br />
            En utilisant le Site, vous acceptez ces Conditions Générales d'Utilisation. Pour toute question ou information complémentaire, veuillez contacter l'association Cani Sport Eure via le formulaire de contact.
          </p>
        </div>
        <div className="text-center mt-4">
          <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700" style={{ fontFamily: 'Calibri, sans-serif' }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
