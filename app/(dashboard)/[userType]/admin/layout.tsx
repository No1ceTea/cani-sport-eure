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
      const { data: userSession } = await supabase.auth.getSession();

      if (!userSession.session) {
        router.push("/connexion"); // 🔹 Redirige si pas de session
        return;
      }

      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        router.push("/connexion");
        return;
      }

      // 🔹 Vérifie si c'est bien un ADMIN
      const isAdmin = userData.user.user_metadata?.administrateur === true;
      if (!isAdmin) {
        router.push("/dashboard/client"); // 🔹 Redirige un adhérent
      } else {
        setIsAuthorized(true);
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (!isAuthorized) return null; // Évite l'affichage avant redirection

  return <>{children}</>;
}
