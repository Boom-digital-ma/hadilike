-- GESTION DES PAGES DE CONTENU (CMS)
-- Copier ce script dans Supabase SQL Editor

-- 1. Création de la table PAGES
CREATE TABLE public.pages (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  slug text not null,          -- ex: 'a-propos', 'cgv', 'mentions-legales'
  title text not null,         -- ex: "L'Atelier Hadilike"
  content text,                -- Contenu HTML ou Texte riche
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(brand_id, slug)
);

-- 2. RLS (Sécurité)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les pages
CREATE POLICY "Public Read Pages" ON public.pages FOR SELECT USING (true);

-- Seuls les admins peuvent modifier (via la policy Admin Full Access existante ou celle-ci)
CREATE POLICY "Admin Manage Pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');


-- 3. INSERTION DES DONNÉES INITIALES (SEED)
DO $$ 
DECLARE 
    brand_id_var UUID;
BEGIN
    SELECT id INTO brand_id_var FROM brands WHERE slug = 'hadilike';

    IF brand_id_var IS NOT NULL THEN
        INSERT INTO public.pages (brand_id, slug, title, content) VALUES
        (brand_id_var, 'a-propos', 'L''Atelier', 'Bienvenue dans notre atelier de création florale à Marrakech. Nous sélectionnons chaque fleur avec passion pour créer des émotions uniques.'),
        (brand_id_var, 'mentions-legales', 'Mentions Légales', 'Éditeur du site : Hadilike. Hébergement : Vercel. Contact : contact@hadilike.ma'),
        (brand_id_var, 'cgv', 'Conditions Générales de Vente', '1. Objet : Les présentes conditions régissent les ventes... 2. Prix... 3. Livraison...');
    END IF;
END $$;
