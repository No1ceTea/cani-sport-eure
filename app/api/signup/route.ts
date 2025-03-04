import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, first_name, last_name } = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/validate-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, // Utilisation de la clé anonyme
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json({ message: "Inscription réussie !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API /api/signup :", error); // 🔍 Log de l'erreur pour debug
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }
}
