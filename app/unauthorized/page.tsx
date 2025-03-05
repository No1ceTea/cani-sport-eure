export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="text-center p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Accès refusé</h1>
        <p className="text-gray-700 mb-6">Vous n'avez pas l'autorisation d'accéder à cette page.</p>
        <a href="/" className="btn btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  );
}
