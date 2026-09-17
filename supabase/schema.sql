-- ============================================================
-- MRP Supply LLC — Esquema del catalogo
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- ------------------------------------------------------------
-- Tabla de productos
-- ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  active boolean not null default true,
  photos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Publico (anon): solo puede LEER productos activos
drop policy if exists "public can read active products" on public.products;
create policy "public can read active products"
  on public.products
  for select
  to anon
  using (active = true);

-- Usuario admin (authenticated): acceso completo
drop policy if exists "admin full access" on public.products;
create policy "admin full access"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------
-- Bucket de fotos (publico de lectura)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

-- Lectura de fotos para todos
drop policy if exists "public can view product photos" on storage.objects;
create policy "public can view product photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-photos');

-- Subida solo para el admin logueado
drop policy if exists "admin can upload photos" on storage.objects;
create policy "admin can upload photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-photos');

drop policy if exists "admin can update photos" on storage.objects;
create policy "admin can update photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-photos');

drop policy if exists "admin can delete photos" on storage.objects;
create policy "admin can delete photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-photos');
