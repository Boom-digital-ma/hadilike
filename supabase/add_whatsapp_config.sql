-- AJOUTER LA CONFIG WHATSAPP DANS LES RÉGLAGES
-- Copier ce script dans Supabase SQL Editor

DO $$ 
DECLARE 
    brand_id_var UUID;
BEGIN
    SELECT id INTO brand_id_var FROM brands WHERE slug = 'hadilike';

    IF brand_id_var IS NOT NULL THEN
        INSERT INTO public.site_settings (brand_id, key, value)
        VALUES (brand_id_var, 'whatsapp_config', '{"number": "212661000000"}')
        ON CONFLICT (brand_id, city_id, key) DO NOTHING;
    END IF;
END $$;
