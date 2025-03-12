import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[60%] max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4" style={{ fontFamily: 'OpenDyslexic, sans-serif' }}>
          Conditions G&eacute;n&eacute;rales d&apos;Utilisation
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4" style={{ fontFamily: 'Calibri, sans-serif' }}>Derni&egrave;re mise &agrave; jour : 06 Mars 2025</p>
        <div className="h-64 overflow-y-auto p-2 border border-gray-300 rounded-lg">
          <p className="text-gray-700 text-sm" style={{ fontFamily: 'Calibri, sans-serif' }}>
            Bienvenue sur le site de l&apos;association Cani Sport Eure. En utilisant ce site, vous acceptez les pr&eacute;sentes Conditions G&eacute;n&eacute;rales d&apos;Utilisation (CGU). Veuillez les lire attentivement.
            <br /><br />
            <strong>1. Objet du site</strong><br />
            Le site vitrine de l&apos;association Cani Sport Eure (<a href="https://cani-sport-eure.vercel.app" className="text-blue-600 underline">https://cani-sport-eure.vercel.app</a>) a pour objectif de pr&eacute;senter les activit&eacute;s, &eacute;v&eacute;nements, et informations relatives &agrave; l&apos;association Cani Sport Eure.
            <br /><br />
            <strong>2. Acc&egrave;s au site</strong><br />
            L&apos;acc&egrave;s au Site est gratuit. Toutefois, l&apos;utilisateur est responsable de ses &eacute;quipements informatiques et de l&apos;acc&egrave;s &agrave; Internet. L&apos;association Cani Sport Eure ne pourra &ecirc;tre tenue responsable de tout dysfonctionnement li&eacute; &agrave; l&apos;utilisation du Site.
            <br /><br />
            <strong>3. Propri&eacute;t&eacute; intellectuelle</strong><br />
            Tous les contenus (textes, images, vid&eacute;os, graphiques, logos, etc.) pr&eacute;sents sur le Site sont la propri&eacute;t&eacute; de l&apos;association Cani Sport Eure ou de leurs auteurs respectifs. Toute reproduction, distribution, modification ou utilisation sans autorisation &eacute;crite est strictement interdite.
            <br /><br />
            <strong>4. Donn&eacute;es personnelles</strong><br />
            Les informations collect&eacute;es sur le Site sont trait&eacute;es conform&eacute;ment &agrave; la politique de confidentialit&eacute; de l&apos;association Cani Sport Eure. Les utilisateurs disposent d&apos;un droit d&apos;acc&egrave;s, de rectification et de suppression de leurs donn&eacute;es personnelles, en contactant l&apos;association via le formulaire de contact.
            <br /><br />
            <strong>5. Responsabilit&eacute;</strong><br />
            L&apos;association Cani Sport Eure s&apos;efforce de fournir des informations exactes et &agrave; jour sur le Site. Cependant, elle ne saurait &ecirc;tre tenue responsable des erreurs ou omissions, ni des &eacute;ventuels dommages r&eacute;sultant de l&apos;utilisation du Site.
            <br /><br />
            <strong>6. Liens externes</strong><br />
            Le Site peut contenir des liens vers des sites externes. L&apos;association Cani Sport Eure n&apos;a aucun contr&ocirc;le sur le contenu de ces sites et d&eacute;cline toute responsabilit&eacute; quant &agrave; leur contenu ou &agrave; leur utilisation.
            <br /><br />
            <strong>7. Modification des CGU</strong><br />
            L&apos;association Cani Sport Eure se r&eacute;serve le droit de modifier les pr&eacute;sentes Conditions G&eacute;n&eacute;rales d&apos;Utilisation &agrave; tout moment. Les modifications prendront effet d&egrave;s leur publication sur le Site.
            <br /><br />
            <strong>8. Loi applicable</strong><br />
            Les pr&eacute;sentes CGU sont soumises &agrave; la loi fran&ccedil;aise. En cas de litige, les tribunaux fran&ccedil;ais seront seuls comp&eacute;tents.
            <br /><br />
            En utilisant le Site, vous acceptez ces Conditions G&eacute;n&eacute;rales d&apos;Utilisation. Pour toute question ou information compl&eacute;mentaire, veuillez contacter l&apos;association Cani Sport Eure via le formulaire de contact.
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
