import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: any = null;

export const getSupabaseBrowserClient = () => {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
};

// Instance statique pour compatibilité ascendante si besoin
export const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null;