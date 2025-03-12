"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      console.log("🔍 Vérification de la session...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.log("❌ Pas de session, redirection vers connexion.");
        router.push("/connexion");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log("❌ Erreur de récupération de l'utilisateur, redirection.");
        router.push("/connexion");
        return;
      }

      const isAdmin = userData.user.user_metadata?.administrateur === true;
      console.log("🟢 Rôle utilisateur récupéré :", userData.user.user_metadata);

      if (!isAdmin) {
        console.log("🔴 Utilisateur NON ADMIN, redirection vers client.");
        router.push("/dashboard/client");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkUserRole();
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (!isAuthorized) return null; // Évite un affichage inutile

  return <>{children}</>;
}
