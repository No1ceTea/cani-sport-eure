// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// 🔹 Initialisation du client Supabase
const supabase = createClient(
  // @ts-ignore
  Deno.env.get("SUPABASE_URL")!,
  // @ts-ignore
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // ⚠️ Clé sensible : uniquement côté serveur !
);

// 🔹 Fonction serveur
serve(async (req: Request) => {
  console.log("🔹 Requête reçue dans Supabase Function");

  try {
    const body = await req.json();
    console.log("📩 Données reçues :", body);

    const { email, password, first_name, last_name } = body;

    if (!email || !password || !first_name || !last_name) {
      console.error("❌ Tous les champs sont requis.");
      return new Response(JSON.stringify({ error: "Tous les champs sont requis." }), { status: 400 });
    }

    // 🔍 Vérification stricte du mot de passe
    const validatePassword = (password: string): string | null => {
      if (password.length < 12) return "Le mot de passe doit contenir au moins 12 caractères.";
      if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
      if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
      if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
      if (!/[!@#$%^&+=*?]/.test(password)) return "Le mot de passe doit contenir au moins un caractère spécial.";
      if (/\s/.test(password)) return "Le mot de passe ne doit pas contenir d'espaces.";
      return null;
    };

    const passwordError = validatePassword(password);
    if (passwordError) {
      console.error("❌ Erreur de validation du mot de passe :", passwordError);
      return new Response(JSON.stringify({ error: passwordError }), { status: 400 });
    }

    // Vérification si l'email existe déjà
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("❌ Erreur Supabase lors de la recherche d'utilisateur :", userError);
      return new Response(JSON.stringify({ error: "Erreur serveur. Réessayez plus tard." }), { status: 500 });
    }

    // Vérification si l'utilisateur avec cet email existe déjà
    const existingUser = users?.users.find((user: { email?: string }) => user.email === email);

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Cet email est déjà utilisé." }), { status: 400 });
    }

    // 🔄 Création de l'utilisateur avec administrateur par défaut à false et statut_inscription à "en attente"
    console.log("🛠 Création de l'utilisateur :", email);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        first_name, 
        last_name, 
        administrateur: false, 
        statut_inscription: "en attente" // ✅ Ajout du champ
      },
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Erreur Supabase lors de la création de l'utilisateur :", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    console.log("✅ Utilisateur créé avec succès :", data.user?.id);

    // ✅ Retourner l'ID utilisateur
    return new Response(JSON.stringify({ message: "Inscription réussie !", userId: data.user?.id }), { status: 200 });

  } catch (err) {
    console.error("❌ Erreur serveur dans Supabase Function :", err);
    return new Response(JSON.stringify({ error: "Erreur lors de l'inscription." }), { status: 500 });
  }
});
