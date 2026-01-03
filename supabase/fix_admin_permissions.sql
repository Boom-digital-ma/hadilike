-- FIX ADMIN PERMISSIONS
-- Grant full access to authenticated users for all admin tables

-- 1. Gallery
DROP POLICY IF EXISTS "Admin Manage Gallery" ON public.gallery_images;
CREATE POLICY "Admin Manage Gallery" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- 2. Cities
DROP POLICY IF EXISTS "Admin Manage Cities" ON public.cities;
CREATE POLICY "Admin Manage Cities" ON public.cities FOR ALL USING (auth.role() = 'authenticated');

-- 3. Budgets
DROP POLICY IF EXISTS "Admin Manage Budgets" ON public.budgets;
CREATE POLICY "Admin Manage Budgets" ON public.budgets FOR ALL USING (auth.role() = 'authenticated');

-- 4. Reviews
DROP POLICY IF EXISTS "Admin Manage Reviews" ON public.reviews;
CREATE POLICY "Admin Manage Reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');

-- 5. Site Settings
DROP POLICY IF EXISTS "Admin Manage Settings" ON public.site_settings;
CREATE POLICY "Admin Manage Settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- 6. Pages
DROP POLICY IF EXISTS "Admin Manage Pages" ON public.pages;
CREATE POLICY "Admin Manage Pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');

-- 7. Leads
DROP POLICY IF EXISTS "Admin Manage Leads" ON public.leads;
CREATE POLICY "Admin Manage Leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');

-- 8. Orders
DROP POLICY IF EXISTS "Admin Full Access Orders" ON public.orders;
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- Base Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
