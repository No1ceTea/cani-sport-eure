import { NextResponse } from "next/server"; // Gestion des réponses API
import { createClient } from "@supabase/supabase-js"; // Client Supabase

// Initialisation du client Supabase avec les clés d'API
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé avec droits d'administration
);

// Récupération de tous les utilisateurs (GET)
export async function GET() {
  try {
    // Appel à l'API Supabase pour lister tous les utilisateurs
    const { data, error } = await supabase.auth.admin.listUsers();

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des utilisateurs." },
        { status: 500 }
      );
    }

    // Transformation et nettoyage des données utilisateurs
    const users = data.users.map((user) => ({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
      birthdate: user.user_metadata?.birthdate || "",
      license_number: user.user_metadata?.license_number || "",
      administrateur: user.user_metadata?.administrateur || false,
      comptable: user.user_metadata.comptable === true,
      statut_inscription: user.user_metadata?.statut_inscription || "en attente",
    }));

    // Retour des utilisateurs au format JSON
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    // Gestion des erreurs génériques
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// Mise à jour des informations d'un utilisateur (PUT)
export async function PUT(req: Request) {
  try {
    // Extraction des données de la requête
    const { 
      id, 
      first_name, 
      last_name, 
      email, 
      birthdate, 
      license_number, 
      statut_inscription, 
      administrateur, 
      comptable 
    } = await req.json();

    // Validation des données requises
    if (!id) {
      return NextResponse.json({ error: "L'ID de l'utilisateur est requis." }, { status: 400 });
    }

    if (!email || !first_name || !last_name) {
      return NextResponse.json({ error: "Email, prénom et nom sont obligatoires." }, { status: 400 });
    }

    // Validation du statut d'inscription
    if (statut_inscription && !["inscrit", "refusé", "en attente"].includes(statut_inscription)) {
      return NextResponse.json({ error: "Statut d'inscription invalide." }, { status: 400 });
    }

    // Mise à jour de l'utilisateur dans Supabase
    const { error } = await supabase.auth.admin.updateUserById(id, {
      email,
      user_metadata: {
        first_name,
        last_name,
        birthdate: birthdate || "",
        license_number: license_number || "",
        statut_inscription: statut_inscription || "en attente",
        administrateur: administrateur || false, // Gestion du statut admin
        comptable: comptable === true,
      },
    });

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json({ error: "Erreur Supabase : " + error.message }, { status: 500 });
    }

    // Confirmation de mise à jour réussie
    return NextResponse.json({ message: "Utilisateur mis à jour avec succès." }, { status: 200 });
  } catch (error) {
    // Gestion des erreurs génériques
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// Suppression d'un utilisateur (DELETE)
export async function DELETE(req: Request) {
  try {
    // Extraction de l'ID utilisateur depuis la requête
    const body = await req.json();
    console.log("Requête DELETE reçue avec :", body);

    const { id } = body;

    // Validation de l'ID
    if (!id) {
      return NextResponse.json({ error: "L'ID de l'utilisateur est requis." }, { status: 400 });
    }

    // Suppression de l'utilisateur dans Supabase
    const { error } = await supabase.auth.admin.deleteUser(id);

    // Gestion des erreurs Supabase
    if (error) {
      console.error("Erreur Supabase :", error);
      return NextResponse.json({ error: "Erreur Supabase : " + error.message }, { status: 500 });
    }

    // Confirmation de suppression réussie
    return NextResponse.json({ message: "Utilisateur supprimé avec succès." }, { status: 200 });
  } catch (error) {
    // Gestion et journalisation des erreurs génériques
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
