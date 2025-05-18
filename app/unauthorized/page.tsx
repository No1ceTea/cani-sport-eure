import Link from "next/link"; // Import du composant Link de Next.js pour la navigation

// Composant de page pour l'erreur d'accès non autorisé
export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200"> {/* Conteneur principal centré */}
      <div className="text-center p-10 bg-white shadow-2xl rounded-lg max-w-md"> {/* Carte d'erreur */}
        
        {/* Icône d'alerte circulaire */}
        <div className="flex justify-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">🚫</div>
        </div>

        {/* Message d'erreur */}
        <h1 className="text-4xl font-bold text-red-500 mt-4">Accès refusé</h1>
        <p className="text-gray-600 mt-2">
          Vous n&apos;avez pas l&apos;autorisation d&apos;accéder à cette page.
        </p>

        {/* Bouton de retour à l'accueil */}
        <Link href="/">
          <button className="btn btn-primary mt-6">
            Retour à l&apos;accueil
          </button>
        </Link>
      </div>
    </div>
  );
}
