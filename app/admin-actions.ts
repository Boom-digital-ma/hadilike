"use server";

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
// WARNING: This requires SUPABASE_SERVICE_ROLE_KEY to be set in .env
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function createBrandAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const brandId = formData.get("brandId") as string;
  const role = formData.get("role") as string || 'admin';

  if (!email || !password || !brandId) {
    return { success: false, message: "Tous les champs sont requis." };
  }

  try {
    // 1. Create or Get User
    let userId;
    
    // Try to create user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto confirm email
    });

    if (createError) {
        // If user already exists, we need to find their ID
        // Note: checking error message is brittle but standard way without extra calls
        if (createError.message.includes("already registered")) {
            // Sadly, listUsers is the only way to search by email in Admin API efficiently
            // Or we just try to sign in? No.
            // Let's assume we can't easily get the ID if they exist without listUsers permission which is heavy.
            // BETTER APPROACH: We just tell the user "User already exists".
            // BUT, for a smoother flow, let's try to fetch user.
            
            // NOTE: supabaseAdmin.rpc() could call a postgres function to get user_id by email if we had one.
            // For now, let's return a specific error.
            return { success: false, message: "Cet email est déjà utilisé. L'utilisateur doit être ajouté manuellement via SQL pour le moment." };
        }
        throw createError;
    }

    userId = newUser.user.id;

    // 2. Assign to Brand (Insert into brand_admins)
    const { error: linkError } = await supabaseAdmin
        .from('brand_admins')
        .insert({
            user_id: userId,
            brand_id: brandId,
            role: role
        });

    if (linkError) throw linkError;

    return { success: true, message: "Administrateur créé et assigné avec succès !" };

  } catch (error: any) {
    console.error("Create Admin Error:", error);
    return { success: false, message: "Erreur: " + error.message };
  }
}
