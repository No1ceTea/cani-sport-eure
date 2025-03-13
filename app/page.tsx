"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";
import Title from "./components/accueil/TitleSection";
import Presentation from "./components/accueil/PresentationSection";
import Agenda from "./components/accueil/AgendaSection";
import Sponsor from "./components/accueil/SponsorSection";
import Sidebar from "./components/sidebars/Sidebar";
import Footer from "./components/sidebars/Footer";

// Créez votre client Supabase (les variables d'environnement sont utilisées automatiquement)
const supabase = createClientComponentClient();

export default function HomePage() {
  // Typage de l'état : Session ou null
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Récupération de la session initiale
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      console.log("Session sur HomePage:", data.session);
    };

    fetchSession();

    // Abonnement aux changements d'état d'authentification
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Changement d'état auth:", event, session);
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <main className="bg-cover bg-center">
      <Title />
      <Presentation />
      <Agenda />
      <Sponsor />

      {/* Transmet la session à Sidebar */}
      <Sidebar session={session} />
      <Footer />
    </main>
  );
}
