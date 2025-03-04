import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Initialisation du client Supabase
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

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

    const passwordError = validatePassword(password);npx supabase functions logs validate-signup --project=ton_project_id

    if (passwordError) {
      return new Response(JSON.stringify({ error: passwordError }), { status: 400 });
    }

    // 🔍 Vérification si l'email existe déjà via Admin API
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      return new Response(JSON.stringify({ error: "Erreur serveur. Réessayez plus tard." }), { status: 500 });
    }

    const emailExists = users.users.some((user) => user.email === email);

    if (emailExists) {
      return new Response(JSON.stringify({ error: "Cet email est déjà utilisé." }), { status: 400 });
    }

    if (userError && userError.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: "Erreur serveur. Réessayez plus tard." }), { status: 500 });
    }

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Cet email est déjà utilisé." }), { status: 400 });
    }

    // 🔄 Création de l'utilisateur
    const { error } = await supabase.auth.admin.createUser({
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
