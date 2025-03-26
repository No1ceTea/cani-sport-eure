// src/lib/supabaseClient.ts
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

const supabase = createBrowserSupabaseClient(); // il lit automatiquement les clés .env

export default supabase;
