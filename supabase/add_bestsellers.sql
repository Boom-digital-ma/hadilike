-- AJOUT DES BEST SELLERS MANQUANTS
-- Copier ce script dans Supabase SQL Editor

DO $$ 
DECLARE 
    brand_id_var UUID;
    cat_boite_id UUID;
    cat_bouquet_id UUID;
BEGIN

    -- Récupérer les IDs (On suppose qu'ils existent déjà via le seed précédent)
    SELECT id INTO brand_id_var FROM brands WHERE slug = 'hadilike';
    SELECT id INTO cat_boite_id FROM categories WHERE slug = 'boites-a-fleurs';
    SELECT id INTO cat_bouquet_id FROM categories WHERE slug = 'bouquets';

    -- Best Sellers BOITES
    INSERT INTO public.gallery_images (brand_id, category_id, image_url, usage_type, display_order) VALUES
    (brand_id_var, cat_boite_id, '/images/boites/best/best1.jpeg', 'best_seller', 1),
    (brand_id_var, cat_boite_id, '/images/boites/best/best2.jpeg', 'best_seller', 2),
    (brand_id_var, cat_boite_id, '/images/boites/best/best3.jpeg', 'best_seller', 3),
    (brand_id_var, cat_boite_id, '/images/boites/best/best4.jpeg', 'best_seller', 4);

    -- Best Sellers BOUQUETS
    INSERT INTO public.gallery_images (brand_id, category_id, image_url, usage_type, display_order) VALUES
    (brand_id_var, cat_bouquet_id, '/images/boquets/best/best1.jpeg', 'best_seller', 1),
    (brand_id_var, cat_bouquet_id, '/images/boquets/best/best2.jpeg', 'best_seller', 2),
    (brand_id_var, cat_bouquet_id, '/images/boquets/best/best3.jpeg', 'best_seller', 3),
    (brand_id_var, cat_bouquet_id, '/images/boquets/best/best4.jpeg', 'best_seller', 4);

END $$;
