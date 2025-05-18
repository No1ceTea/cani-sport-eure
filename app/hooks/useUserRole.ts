// Hook personnalisé pour récupérer le rôle de l'utilisateur connecté
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient"; // Client Supabase

export default function useUserRole() {
  // État pour stocker le rôle de l'utilisateur
  const [role, setRole] = useState<"admin" | "adherent" | null>(null);
  // État pour indiquer si la vérification est en cours
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer l'utilisateur et déterminer son rôle
    const getUser = async () => {
      // Récupération de la session utilisateur depuis Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        // Vérification des métadonnées de l'utilisateur pour déterminer son rôle
        const metadata = user.user_metadata;

        if (metadata?.administrateur) {
          // Si l'utilisateur a le flag "administrateur"
          setRole("admin");
        } else if (metadata?.statut_inscription === "inscrit") {
          // Si l'utilisateur a le statut "inscrit"
          setRole("adherent");
        } else {
          // Si l'utilisateur n'a pas de métadonnées ou de statut reconnu
          setRole(null);
        }
      } else {
        // Aucun utilisateur connecté
        setRole(null);
      }

      // Fin de chargement
      setIsLoading(false);
    };

    // Exécution de la fonction lors du montage du composant
    getUser();
  }, []); // Tableau de dépendances vide : exécution uniquement au montage

  // Retourne le rôle et l'état de chargement
  return { role, isLoading };
}
