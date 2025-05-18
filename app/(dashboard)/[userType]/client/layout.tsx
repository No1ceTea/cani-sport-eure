"use client"; // Indique que ce composant s'exécute côté client

import { useRouter } from "next/navigation"; // Navigation programmatique
import { useEffect, useState } from "react"; // Hooks React
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Client Supabase

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Hook pour la navigation
  const supabase = createClientComponentClient(); // Initialisation du client Supabase
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [isAuthorized, setIsAuthorized] = useState(false); // État d'autorisation

  // Vérification de l'authentification et des permissions au chargement
  useEffect(() => {
    const checkUserRole = async () => {
      // Récupération de la session utilisateur
      const { data: userSession } = await supabase.auth.getSession();

      // Redirection si aucune session active
      if (!userSession.session) {
        console.log("🔴 Pas de session, redirection vers connexion.");
        router.replace("/connexion"); // Remplace l'URL pour éviter le retour arrière
        return;
      }

      // Récupération des données complètes de l'utilisateur
      const { data: userData, error } = await supabase.auth.getUser();

      // Gestion des erreurs
      if (error || !userData?.user) {
        console.log("❌ Erreur lors de la récupération de l'utilisateur :", error);
        router.replace("/connexion");
        return;
      }

      console.log("🔍 Données de l'utilisateur récupérées :", userData.user.user_metadata);

      // Vérification si l'utilisateur est admin
      const isAdmin = userData.user.user_metadata?.administrateur === true;

      // Autorisation accordée
      console.log("✅ Utilisateur adhérent détecté, accès autorisé !");
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkUserRole(); // Exécution de la vérification
  }, [router, supabase.auth]); // Dépendances de l'effet

  // Affichage pendant le chargement
  if (isLoading) return <p>Chargement...</p>;
  
  // Pas de rendu si non autorisé (évite l'affichage du contenu pendant la redirection)
  if (!isAuthorized) return null;

  // Rendu du contenu si autorisé
  return <>{children}</>;
}
