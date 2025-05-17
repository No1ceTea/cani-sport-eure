"use client"; // Indique que ce composant s'exécute côté client

import { useRouter } from "next/navigation"; // Hook de navigation Next.js
import { useEffect, useState } from "react"; // Hooks React
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Client Supabase

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // Initialisation du router pour la navigation
  const supabase = createClientComponentClient(); // Création du client Supabase
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
  const [isAuthorized, setIsAuthorized] = useState(false); // État pour l'autorisation

  // Vérification des droits d'administration au chargement
  useEffect(() => {
    const checkUserRole = async () => {
      console.log("🔍 Vérification de la session..."); // Log de débogage

      // Récupération de la session utilisateur
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      // Redirection si pas de session
      if (sessionError || !sessionData.session) {
        console.log("❌ Pas de session, redirection vers connexion.");
        router.push("/connexion");
        return;
      }

      // Récupération des données utilisateur
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log("❌ Erreur de récupération de l'utilisateur, redirection.");
        router.push("/connexion");
        return;
      }

      // Vérification du statut d'administrateur dans les métadonnées
      const isAdmin = userData.user.user_metadata?.administrateur === true;
      console.log(
        "🟢 Rôle utilisateur récupéré :",
        userData.user.user_metadata
      );

      // Redirection vers le dashboard client si non admin
      if (!isAdmin) {
        console.log("🔴 Utilisateur NON ADMIN, redirection vers client.");
        router.push("/dashboard/client");
        return;
      }

      // Autorisation confirmée
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkUserRole(); // Exécution de la vérification
  }, [router, supabase.auth]); // Dépendances de l'effet

  // Affichage pendant le chargement
  if (isLoading) return <p>Chargement...</p>;

  // Pas de rendu si non autorisé (évite un affichage temporaire)
  if (!isAuthorized) return null;

  // Rendu des composants enfants si autorisé
  return <>{children}</>;
}
