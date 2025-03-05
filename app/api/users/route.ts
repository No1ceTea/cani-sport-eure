import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔹 Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔹 Récupération de tous les utilisateurs (GET)
export async function GET() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs." }, { status: 500 });
    }

    // 🔍 Extraction des infos nécessaires
    const users = data.users.map((user) => ({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
      administrateur: user.user_metadata?.administrateur || false,
      statut_inscription: user.user_metadata?.statut_inscription || "en attente",
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// 🔹 Mise à jour du statut d'inscription (PUT)
export async function PUT(req: Request) {
  try {
    const { id, statut_inscription } = await req.json();

    if (!id || !statut_inscription) {
      return NextResponse.json({ error: "ID et statut_inscription sont requis." }, { status: 400 });
    }

    if (!["inscrit", "refusé"].includes(statut_inscription)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    // 🔄 Mise à jour dans Supabase
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { statut_inscription },
    });

    if (error) {
      return NextResponse.json({ error: "Erreur Supabase : " + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Statut mis à jour avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
