-- TABLE POUR LES DEMANDES DE CONTACT (LEADS)
-- Copier ce script dans Supabase SQL Editor

CREATE TABLE public.leads (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand_id uuid references public.brands(id) on delete cascade not null,
  
  type text not null, -- 'contact', 'wedding', 'decoration'
  name text not null,
  phone text not null,
  email text,
  message text,
  status text default 'new' -- 'new', 'contacted', 'converted', 'archived'
);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut créer (Formulaire public)
CREATE POLICY "Public Create Leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Seuls les admins peuvent lire
CREATE POLICY "Admin Read Leads" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Leads" ON public.leads FOR UPDATE USING (auth.role() = 'authenticated');
