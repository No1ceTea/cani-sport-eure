import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🔹 Requête reçue dans l'API Next.js");

    const { email, password, first_name, last_name } = await req.json();
    console.log("📩 Données reçues :", { email, first_name, last_name });

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/validate-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, // 🔍 Vérifie cette clé
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    const data = await response.json();
    console.log("📡 Réponse de Supabase :", data);

    if (!response.ok) {
      console.error("❌ Erreur de Supabase :", data.error);
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    console.log("✅ Inscription réussie !");
    return NextResponse.json({ message: "Inscription réussie !" }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur dans l'API /api/signup :", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }
}
