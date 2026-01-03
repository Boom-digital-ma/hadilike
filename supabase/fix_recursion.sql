-- FIX INFINITE RECURSION IN RLS
-- 1. Exécutez ce script dans l'éditeur SQL de Supabase

-- Supprimer les anciennes règles
DROP POLICY IF EXISTS "Admins can read their own role" ON public.brand_admins;
DROP POLICY IF EXISTS "Super Admin manage all roles" ON public.brand_admins;

-- Créer une fonction de vérification sécurisée (évite la récursion)
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.brand_admins
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Règle de lecture de son propre rôle (Non récursive)
CREATE POLICY "Allow users to read their own profile" 
ON public.brand_admins 
FOR SELECT 
USING (auth.uid() = user_id);

-- Règle de gestion totale pour les Super Admins
CREATE POLICY "Allow super_admins to manage everything" 
ON public.brand_admins 
FOR ALL 
USING (check_is_super_admin());

ALTER TABLE public.brand_admins ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.brand_admins TO authenticated;
