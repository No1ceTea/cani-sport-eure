// Importation des modules nécessaires
import { NextResponse } from "next/server"; // Pour gérer les réponses d'API
import { createClient } from "@supabase/supabase-js"; // Client Supabase
import { Agent } from "http"; // Module HTTP (importation non utilisée)

// Initialisation du client Supabase avec les variables d'environnement
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé avec privilèges d'administration
);

// Fonction pour gérer les requêtes POST (inscription)
export async function POST(req: Request) {
  try {
    console.log("🔹 Requête reçue dans l'API Next.js");

    // Extraction des données du corps de la requête
    const { email, password, first_name, last_name } = await req.json();
    console.log("📩 Données reçues :", { email, first_name, last_name });

    // Étape 1: Appel de l'Edge Function Supabase pour créer l'utilisateur
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/validate-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, // Authentification avec droits admin
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    // Récupération et log de la réponse
    const data = await response.json();
    console.log("📡 Réponse de Supabase :", data);

    // Gestion des erreurs de l'Edge Function
    if (!response.ok) {
      console.error("❌ Erreur de Supabase :", data.error);
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    // Vérification de la présence de l'ID utilisateur
    if (!data.userId) {
      console.error("❌ Aucun ID utilisateur reçu.");
      return NextResponse.json({ error: "Erreur lors de la récupération de l'utilisateur." }, { status: 500 });
    }

    const userId = data.userId;
    console.log("✅ ID utilisateur reçu :", userId);

    // Étape 2: Création du profil utilisateur dans la table personnalisée
    const { error: profileError } = await supabase.from("profils").insert([
      {
        id: userId, // Association avec l'ID de l'utilisateur dans Auth
        created_at: new Date().toISOString(),
        nom: last_name,
        prenom: first_name,
        email: email,
      },
    ]);

    // Gestion des erreurs de création de profil
    if (profileError) {
      console.error("❌ Erreur lors de l'ajout du profil :", profileError);
      return NextResponse.json({ error: "Erreur lors de l'ajout du profil." }, { status: 500 });
    }

    // Réponse de succès
    console.log("✅ Inscription et profil créés avec succès !");
    return NextResponse.json({ message: "Inscription réussie !" }, { status: 200 });

  } catch (error) {
    // Gestion des erreurs générales
    console.error("❌ Erreur dans l'API /api/signup :", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }
}
