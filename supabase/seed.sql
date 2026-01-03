-- ==============================================================================
-- SEED DATA FOR HADILIKE MARRAKECH (Multi-Brand Ready)
-- Copiez ce script dans l'éditeur SQL de Supabase APRES avoir exécuté schema.sql
-- ==============================================================================

DO $$ 
DECLARE 
    brand_id_var UUID;
    city_id_var UUID;
    cat_boite_id UUID;
    cat_bouquet_id UUID;
    cat_compo_id UUID;
    cat_wedding_id UUID;
    cat_deco_id UUID;
BEGIN

-- 1. CRÉATION DE LA MARQUE
INSERT INTO public.brands (slug, name, domain, theme_config)
VALUES ('hadilike', 'Hadilike Marrakech', 'hadilike.ma', '{
    "logo_url": "/images/logo-new.jpeg",
    "colors": { "primary": "#000000", "secondary": "#ffffff", "accent": "#f4d03f" },
    "fonts": { "heading": "Urbanist", "body": "Manrope" }
}')
RETURNING id INTO brand_id_var;

-- 2. CRÉATION DE LA VILLE (Marrakech)
INSERT INTO public.cities (brand_id, slug, name, config)
VALUES (brand_id_var, 'marrakech', 'Marrakech', '{"delivery_fee": 0, "min_delay_hours": 2}')
RETURNING id INTO city_id_var;

-- 3. INSERTION DES CATÉGORIES
-- Boîtes à fleurs
INSERT INTO public.categories (brand_id, slug, title, subtitle, cover_image, type, flow, ui_config, display_order)
VALUES (brand_id_var, 'boites-a-fleurs', 'Boîtes à fleurs', 'L''élégance en boîte', '/images/bouqet.jpeg', 'product', 'wizard', '{"quickBuyPrice": "650 dh", "showExtras": false}', 1)
RETURNING id INTO cat_boite_id;

-- Bouquets
INSERT INTO public.categories (brand_id, slug, title, subtitle, cover_image, type, flow, ui_config, display_order)
VALUES (brand_id_var, 'bouquets', 'Bouquets', 'L''Art Floral', '/images/boite.jpeg', 'product', 'wizard', '{"quickBuyPrice": "580 dh", "showExtras": true}', 2)
RETURNING id INTO cat_bouquet_id;

-- Composition Spéciale
INSERT INTO public.categories (brand_id, slug, title, subtitle, cover_image, type, flow, ui_config, display_order)
VALUES (brand_id_var, 'composition-speciale', 'Composition Spéciale', 'Sur Mesure', '/images/composition.jpeg', 'product', 'direct', '{"descriptionLabel": "Description", "descriptionPlaceholder": "Décrivez la composition souhaitée..."}', 3)
RETURNING id INTO cat_compo_id;

-- Wedding
INSERT INTO public.categories (brand_id, slug, title, subtitle, cover_image, type, flow, display_order)
VALUES (brand_id_var, 'evenements', 'Wedding', '', '/images/event.jpeg', 'service', 'contact', 4)
RETURNING id INTO cat_wedding_id;

-- Art Floral
INSERT INTO public.categories (brand_id, slug, title, subtitle, cover_image, type, flow, display_order)
VALUES (brand_id_var, 'decoration', 'Art floral', '', '/images/deco.jpeg', 'service', 'contact', 5)
RETURNING id INTO cat_deco_id;

-- 4. INSERTION DES BUDGETS (PRIX PAR VILLE)
-- Boîtes
INSERT INTO public.budgets (brand_id, city_id, category_id, label, price, display_order) VALUES
(brand_id_var, city_id_var, cat_boite_id, 'Le Petit Geste', 450, 1),
(brand_id_var, city_id_var, cat_boite_id, 'Le Plaisir', 650, 2),
(brand_id_var, city_id_var, cat_boite_id, 'L''Exception', 850, 3),
(brand_id_var, city_id_var, cat_boite_id, 'La Folie', 1350, 4);

-- Bouquets
INSERT INTO public.budgets (brand_id, city_id, category_id, label, price, display_order) VALUES
(brand_id_var, city_id_var, cat_bouquet_id, 'Le Petit Geste', 250, 1),
(brand_id_var, city_id_var, cat_bouquet_id, 'Le Plaisir', 580, 2),
(brand_id_var, city_id_var, cat_bouquet_id, 'L''Exception', 700, 3),
(brand_id_var, city_id_var, cat_bouquet_id, 'La Folie', 1200, 4);

-- Composition
INSERT INTO public.budgets (brand_id, city_id, category_id, label, price, display_order) VALUES
(brand_id_var, city_id_var, cat_compo_id, 'Le Petit Geste', 400, 1),
(brand_id_var, city_id_var, cat_compo_id, 'Le Plaisir', 700, 2),
(brand_id_var, city_id_var, cat_compo_id, 'L''Exception', 1200, 3),
(brand_id_var, city_id_var, cat_compo_id, 'La Folie', 2000, 4);

-- 5. INSERTION DES STYLES (GLOBAL MARQUE)
INSERT INTO public.styles (brand_id, slug, label, color_code, is_dark) VALUES
(brand_id_var, 'boheme', 'Bohème', 'bg-[#e5e0d8]', false),
(brand_id_var, 'romantique', 'Romantique', 'bg-[#fce7f3]', false),
(brand_id_var, 'purete', 'Pureté', 'bg-[#f3f4f6]', false),
(brand_id_var, 'surprise-du-chef', 'Surprise du Chef', 'bg-fuchsia-600', true);

-- 6. INSERTION DES OCCASIONS
-- Pour Boîtes
INSERT INTO public.occasions (brand_id, category_id, slug, label, image_url) VALUES
(brand_id_var, cat_boite_id, 'amour', 'Amour', '/images/boites/amour.jpeg'),
(brand_id_var, cat_boite_id, 'anniversaire', 'Anniversaire', '/images/boites/anniversair.jpeg'),
(brand_id_var, cat_boite_id, 'plaisir-d-offrir', 'Plaisir d''offrir', '/images/boites/plaisir.jpeg');

-- Pour Bouquets
INSERT INTO public.occasions (brand_id, category_id, slug, label, image_url) VALUES
(brand_id_var, cat_bouquet_id, 'amour', 'Amour', '/images/boquets/amour.jpeg'),
(brand_id_var, cat_bouquet_id, 'anniversaire', 'Anniversaire', '/images/boquets/anniversaire.jpeg'),
(brand_id_var, cat_bouquet_id, 'plaisir-d-offrir', 'Plaisir d''offrir', '/images/boquets/plaisirdoffrir.jpeg'),
(brand_id_var, cat_bouquet_id, 'deuil', 'Deuil', '/images/boquets/deuil.jpeg');

-- 7. INSERTION DES IMAGES GALERIE (INSPIRATIONS / BEST SELLERS)
INSERT INTO public.gallery_images (brand_id, category_id, image_url, usage_type) VALUES
-- Compo Inspirations
(brand_id_var, cat_compo_id, '/images/compo/comp1.jpeg', 'inspiration'),
(brand_id_var, cat_compo_id, '/images/compo/comp2.jpeg', 'inspiration'),
(brand_id_var, cat_compo_id, '/images/compo/comp3.jpeg', 'inspiration'),
-- Wedding Sliders
(brand_id_var, cat_wedding_id, '/images/event/event1.jpeg', 'inspiration'),
(brand_id_var, cat_wedding_id, '/images/event/event2.jpeg', 'inspiration');

-- 8. RÉGLAGES DU SITE (CMS)
INSERT INTO public.site_settings (brand_id, city_id, key, value) VALUES
(brand_id_var, NULL, 'promo_popup', '{"enabled": false, "title": "L''Éclat de Marrakech", "buttonText": "Découvrir"}'),
(brand_id_var, NULL, 'chatbot_config', '{"enabled": true}'),
(brand_id_var, NULL, 'reviews_config', '{"enabled": true, "title": "Ils nous font confiance", "googleMapsLink": "https://maps.app.goo.gl/PvpLHoaLEpQ9fRzY6"}');

-- 9. AVIS CLIENTS
INSERT INTO public.reviews (brand_id, city_id, author_name, content, rating) VALUES
(brand_id_var, city_id_var, 'Sarah B.', 'Un service exceptionnel ! Le bouquet était magnifique.', 5),
(brand_id_var, city_id_var, 'Mehdi K.', 'J''ai commandé une box, elle a adoré. Très classe.', 5);

END $$;
