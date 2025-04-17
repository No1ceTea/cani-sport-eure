"use client"; // Directive pour exécuter ce composant côté client

import { useState, useEffect } from "react";
import {
  createClientComponentClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
// Import des composants pour les différentes sections de la page d'accueil
import Title from "./components/accueil/TitleSection";
import Presentation from "./components/accueil/PresentationSection";
import AgendaHome from "./components/accueil/AgendaSection";
import Sponsor from "./components/accueil/SponsorSection";
import Sidebar from "./components/sidebars/Sidebar";
import Footer from "./components/sidebars/Footer";
import LatestEvents from "./components/LastestEvents";
import LastestArticles from "./components/LastestArticles";

// Initialisation du client Supabase pour l'authentification
const supabase = createClientComponentClient();

export default function HomePage() {
  // État pour stocker les informations de session utilisateur
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Récupère la session utilisateur au chargement de la page
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      console.log("Session sur HomePage:", data.session);
    };

    fetchSession();

    // Abonnement aux changements d'authentification (connexion/déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Changement d'état auth:", event, session);
        setSession(session);
      }
    );

    // Nettoyage de l'écouteur à la destruction du composant
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Structure de la page d'accueil avec différentes sections
  return (
    <main className="bg-cover bg-center">
      <Title /> {/* Section titre/bannière */}
      <Presentation /> {/* Présentation de l'association */}
      <AgendaHome /> {/* Calendrier des événements */}
      <Sponsor /> {/* Section des sponsors */}
      <LatestEvents /> {/* Derniers événements */}
      <LastestArticles /> {/* Derniers articles */}
      <Sidebar /> {/* Barre latérale de navigation */}
      <Footer /> {/* Pied de page */}
    </main>
  );
}
