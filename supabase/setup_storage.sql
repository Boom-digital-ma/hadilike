-- CONFIGURATION SUPABASE STORAGE
-- 1. Créez d'abord un bucket nommé 'images' (Public) dans l'interface Storage.
-- 2. Puis exécutez ce script pour les permissions (Policies).

-- Lecture publique
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

-- Insertion (Upload) pour admins
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Suppression pour admins
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Mise à jour pour admins
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
