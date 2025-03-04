// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Initialisation du client Supabase
const supabase = createClient(
  // @ts-ignore
  Deno.env.get("SUPABASE_URL")!,
  // @ts-ignore
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // ⚠️ Clé sensible : uniquement côté serveur !
);

// @ts-ignore
serve(async (req) => {
  try {
    const { email, password, first_name, last_name } = await req.json();

    if (!email || !password || !first_name || !last_name) {
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
      return new Response(JSON.stringify({ error: passwordError }), { status: 400 });
    }

    // 🔍 Vérification si l'email existe déjà
    const { data: existingUser, error: userError } = await supabase.auth.admin.getUserByEmail(email);

    if (userError && userError.message !== "User not found") {
      return new Response(JSON.stringify({ error: "Erreur serveur. Réessayez plus tard." }), { status: 500 });
    }

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Cet email est déjà utilisé." }), { status: 400 });
    }

    // 🔄 Création de l'utilisateur
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name, last_name },
      email_confirm: true,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Inscription réussie !" }), { status: 200 });
  } catch (err) {
    console.log("Erreur serveur :", err);
    return new Response(JSON.stringify({ error: "Erreur lors de l'inscription." }), { status: 500 });
  }
});
