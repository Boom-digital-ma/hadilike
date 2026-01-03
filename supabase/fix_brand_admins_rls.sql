-- FIX RLS FOR BRAND_ADMINS TABLE
-- This allows the app to check the user role (super_admin vs admin)

-- 1. Allow any authenticated user to read their own role record
DROP POLICY IF EXISTS "Admins can read their own role" ON public.brand_admins;
CREATE POLICY "Admins can read their own role" 
ON public.brand_admins 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Allow Super Admins to manage all role assignments
DROP POLICY IF EXISTS "Super Admin manage all roles" ON public.brand_admins;
CREATE POLICY "Super Admin manage all roles" 
ON public.brand_admins 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.brand_admins 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- 3. Ensure the table has RLS enabled
ALTER TABLE public.brand_admins ENABLE ROW LEVEL SECURITY;

-- 4. Grant basic permissions to the authenticated role
GRANT SELECT ON public.brand_admins TO authenticated;
