-- MISE À JOUR GALERIE POUR BEST SELLERS INTELLIGENTS
-- Ajouter titre, prix et configuration JSON pour les produits vedettes

ALTER TABLE public.gallery_images 
ADD COLUMN title text,          -- ex: "L'Amour Rouge"
ADD COLUMN price text,          -- ex: "650 DH"
ADD COLUMN target_config jsonb default '{}'::jsonb; -- ex: { "style": "Romantique", "occasion": "Amour" }

-- Mettre à jour les best sellers existants avec des données fictives pour l'exemple
UPDATE public.gallery_images
SET 
    title = 'Coup de Cœur',
    price = '650 DH',
    target_config = '{"style": "Création du Chef", "occasion": "Plaisir"}'
WHERE usage_type = 'best_seller';
