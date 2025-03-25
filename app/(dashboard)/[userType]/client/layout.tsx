"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: userSession } = await supabase.auth.getSession();

      if (!userSession.session) {
        console.log("🔴 Pas de session, redirection vers connexion.");
        router.replace("/connexion"); // 🔹 Remplace l'historique pour éviter le retour en arrière
        return;
      }

      const { data: userData, error } = await supabase.auth.getUser();

      if (error || !userData?.user) {
        console.log("❌ Erreur lors de la récupération de l'utilisateur :", error);
        router.replace("/connexion");
        return;
      }

      console.log("🔍 Données de l'utilisateur récupérées :", userData.user.user_metadata);

      const isAdmin = userData.user.user_metadata?.administrateur === true;

      if (isAdmin) {
        console.log("🔴 Admin détecté, redirection vers /dashboard/admin");
        router.replace("/dashboard/admin");
      } else {
        console.log("✅ Utilisateur adhérent détecté, accès autorisé !");
        setIsAuthorized(true);
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [router, supabase.auth]);

  if (isLoading) return <p>Chargement...</p>;
  if (!isAuthorized) return null; // 🔹 Évite l'affichage du contenu avant redirection

  return <>{children}</>;
}
