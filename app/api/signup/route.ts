import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Agent } from "http";

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    console.log("🔹 Requête reçue dans l'API Next.js");

    const { email, password, first_name, last_name } = await req.json();
    console.log("📩 Données reçues :", { email, first_name, last_name });

    // 🔍 1️⃣ Envoi des infos à la Edge Function pour inscription
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/validate-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    const data = await response.json();
    console.log("📡 Réponse de Supabase :", data);

    if (!response.ok) {
      console.error("❌ Erreur de Supabase :", data.error);
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    if (!data.userId) {
      console.error("❌ Aucun ID utilisateur reçu.");
      return NextResponse.json({ error: "Erreur lors de la récupération de l'utilisateur." }, { status: 500 });
    }

    const userId = data.userId;
    console.log("✅ ID utilisateur reçu :", userId);

    // 🔍 2️⃣ Ajouter l'utilisateur dans la table `profils`
    const { error: profileError } = await supabase.from("profils").insert([
      {
        id: userId, // Lier à l'utilisateur Auth
        created_at: new Date().toISOString(),
        nom: last_name,
        prenom: first_name,
        email: email,
      },
    ]);

    if (profileError) {
      console.error("❌ Erreur lors de l'ajout du profil :", profileError);
      return NextResponse.json({ error: "Erreur lors de l'ajout du profil." }, { status: 500 });
    }

    console.log("✅ Inscription et profil créés avec succès !");
    return NextResponse.json({ message: "Inscription réussie !" }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur dans l'API /api/signup :", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }
}
