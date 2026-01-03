-- SETUP SUPER ADMIN (Version corrigée)
-- 1. Remplacez 'VOTRE_EMAIL' par l'email de votre compte Supabase Auth
-- 2. Exécutez ce script dans l'éditeur SQL de Supabase

DO $$ 
DECLARE 
    user_id_var UUID;
    brand_id_var UUID;
BEGIN
    -- Récupérer votre ID utilisateur
    SELECT id INTO user_id_var FROM auth.users WHERE email = 'VOTRE_EMAIL';
    
    -- Récupérer l'ID de la marque principale (Hadilike)
    SELECT id INTO brand_id_var FROM public.brands WHERE slug = 'hadilike' LIMIT 1;

    IF user_id_var IS NOT NULL AND brand_id_var IS NOT NULL THEN
        INSERT INTO public.brand_admins (user_id, brand_id, role)
        VALUES (user_id_var, brand_id_var, 'super_admin')
        ON CONFLICT (user_id, brand_id) DO UPDATE SET role = 'super_admin';
        
        RAISE NOTICE 'Utilisateur promu Super Admin avec succès.';
    ELSE
        RAISE EXCEPTION 'Utilisateur ou Marque non trouvé. Vérifiez l''email et assurez-vous d''avoir exécuté seed.sql';
    END IF;
END $$;