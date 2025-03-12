"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ClientDashboardPage: React.FC = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const checkUser = async () => {
      // 🔹 Vérifie si l'utilisateur est connecté
      const { data: userSession } = await supabase.auth.getSession();
  
      if (!userSession.session) {
        console.log("🔴 Utilisateur non connecté, redirection vers /connexion");
        router.replace("/connexion");
        return;
      }
  
      // 🔹 Récupère les données utilisateur
      const { data: userData, error } = await supabase.auth.getUser();
  
      if (error || !userData?.user) {
        console.log("❌ Erreur lors de la récupération de l'utilisateur :", error);
        router.replace("/connexion");
        return;
      }
  
      console.log("🔍 Données de l'utilisateur :", userData.user.user_metadata);
  
      // ✅ Stocke l'UUID de l'utilisateur
      setUserId(userData.user.id);
  
      const isAdmin = userData.user.user_metadata?.administrateur === true;
  
      if (isAdmin) {
        console.log("🔴 Admin détecté, redirection vers /dashboard/admin");
        router.replace("/dashboard/admin");
      } else {
        console.log("✅ Utilisateur adhérent détecté, accès autorisé !");
        setUserType("client");
      }
      
      console.log(userData.user.id)

      setIsLoading(false);
    };
  
    checkUser();
  }, []);
  

  if (isLoading) return <p>Chargement...</p>;
  if (!userType) return null; // 🔹 Évite l'affichage du contenu avant redirection

  return (
    <div>
      <h1>Dashboard Client</h1>
      <p>Vous êtes sur la page dashboard client.</p>
    </div>
  );
};

export default ClientDashboardPage;
