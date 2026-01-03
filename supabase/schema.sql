-- ==============================================================================
-- HADILIKE ARCHITECTURE V3 (MULTI-BRAND SAAS CORE)
-- Copiez ce script dans l'éditeur SQL de Supabase pour créer la structure.
-- ==============================================================================

-- Active l'extension UUID
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. TENANCY (MULTI-BRAND)
-- ---------------------------------------------------------

create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,          
  name text not null,                 
  domain text unique,                 
  theme_config jsonb default '{}'::jsonb,
  is_active boolean default true
);

create index brands_domain_idx on public.brands (domain);

-- ---------------------------------------------------------
-- 2. GÉOGRAPHIE (MULTI-CITIES)
-- ---------------------------------------------------------

create table public.cities (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  slug text not null,         
  name text not null,         
  is_active boolean default true,
  currency_symbol text default 'DH',
  config jsonb default '{}'::jsonb,
  unique(brand_id, slug)
);

-- ---------------------------------------------------------
-- 3. CATALOGUE
-- ---------------------------------------------------------

create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  slug text not null,
  title text not null,
  subtitle text,
  cover_image text,
  type text not null check (type in ('product', 'service')),
  flow text not null check (flow in ('wizard', 'direct', 'contact')),
  ui_config jsonb default '{}'::jsonb,
  display_order int default 0,
  is_active boolean default true,
  unique(brand_id, slug)
);

create table public.city_categories (
  city_id uuid references public.cities(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  is_active boolean default true,
  primary key (city_id, category_id)
);

-- ---------------------------------------------------------
-- 4. PRIX & ATTRIBUTS
-- ---------------------------------------------------------

create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  city_id uuid references public.cities(id) on delete cascade not null,
  label text not null,    
  price decimal not null, 
  display_order int default 0,
  unique (category_id, city_id, label)
);

create table public.styles (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  slug text not null,
  label text not null,
  color_code text,
  is_dark boolean default false,
  unique(brand_id, slug)
);

create table public.occasions (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  slug text not null,
  label text not null,
  image_url text not null,
  display_order int default 0,
  unique(category_id, slug)
);

-- ---------------------------------------------------------
-- 5. MÉDIAS & CONTENU (CMS)
-- ---------------------------------------------------------

create table public.gallery_images (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  image_url text not null,
  usage_type text not null,
  display_order int default 0
);

create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  city_id uuid references public.cities(id) on delete cascade, 
  key text not null, 
  value jsonb not null,
  unique (brand_id, city_id, key)
);

create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand_id uuid references public.brands(id) on delete cascade not null,
  city_id uuid references public.cities(id) on delete set null,
  author_name text not null,
  rating int default 5,
  content text,
  is_visible boolean default true,
  source text default 'google'
);

-- ---------------------------------------------------------
-- 6. TRANSACTIONS (COMMANDES)
-- ---------------------------------------------------------

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand_id uuid references public.brands(id) on delete cascade not null,
  city_id uuid references public.cities(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  total_amount decimal not null,
  currency text default 'DH',
  payment_method text not null,
  payment_status text default 'pending',
  order_status text default 'new',
  items jsonb not null,
  metadata jsonb default '{}'::jsonb
);

-- ---------------------------------------------------------
-- 7. SÉCURITÉ (RLS)
-- ---------------------------------------------------------

create table public.brand_admins (
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references public.brands(id) on delete cascade not null,
  role text default 'admin',
  primary key (user_id, brand_id)
);

alter table public.brands enable row level security;
alter table public.cities enable row level security;
alter table public.categories enable row level security;
alter table public.city_categories enable row level security;
alter table public.budgets enable row level security;
alter table public.styles enable row level security;
alter table public.occasions enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.brand_admins enable row level security;

-- Policies Publiques
create policy "Public Read Active Brands" on public.brands for select using (is_active = true);
create policy "Public Read Active Cities" on public.cities for select using (is_active = true);
create policy "Public Read Active Categories" on public.categories for select using (is_active = true);
create policy "Public Read Budgets" on public.budgets for select using (true);
create policy "Public Read Styles" on public.styles for select using (true);
create policy "Public Read Occasions" on public.occasions for select using (true);
create policy "Public Read Gallery" on public.gallery_images for select using (true);
create policy "Public Read Settings" on public.site_settings for select using (true);
create policy "Public Read Reviews" on public.reviews for select using (is_visible = true);
create policy "Public Create Orders" on public.orders for insert with check (true);

-- Policies Admin (Simplifiées pour le moment)
create policy "Admin Full Access" on public.brands for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Cities" on public.cities for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Categories" on public.categories for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Orders" on public.orders for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Settings" on public.site_settings for all using (auth.role() = 'authenticated');
