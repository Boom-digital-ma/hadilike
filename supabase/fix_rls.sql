-- FIX RLS FOR ORDERS
-- Permettre à tout le monde (anon) de créer une commande
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;

CREATE POLICY "Public Create Orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Permettre la lecture de la commande qu'on vient de créer (optionnel mais utile pour le retour)
-- Attention: Idéalement on ne devrait lire que ses propres commandes, mais sans auth utilisateur, c'est délicat.
-- Pour l'instant, on laisse l'insert retourner les données.
