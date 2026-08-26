-- ============================================================
--  mumzzmum · Supabase schema
--  Run this whole file in: Supabase Dashboard → SQL Editor → Run.
--
--  Security model (per project spec):
--    · Anyone (even logged-out visitors) can READ all content.
--    · Only an ADMIN can INSERT / UPDATE / DELETE — enforced at the
--      DATABASE level via Row Level Security, so a normal user calling
--      the API directly still cannot write.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
--  00. Profiles + admin helper
--      Every auth user gets a profile row (role defaults to 'user').
--      Promote yourself to admin with the UPDATE at the bottom.
-- ============================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A profile is readable by its owner; role is never client-writable.
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
  on public.profiles for select
  using (auth.uid() = id);

-- Auto-create a profile whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Self-serve admin bootstrap. The FIRST signed-in user may claim admin with
-- no SQL; once an admin exists it refuses, so it is safe to leave enabled.
create or replace function public.claim_admin()
returns text
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    return 'not-authenticated';
  end if;
  if exists (select 1 from public.profiles where role = 'admin') then
    return 'admin-exists';
  end if;
  update public.profiles set role = 'admin' where id = auth.uid();
  return 'promoted';
end;
$$;

grant execute on function public.claim_admin() to authenticated;

-- SECURITY DEFINER so RLS policies can call it without recursing on profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
--  01. Brands
-- ============================================================
create table if not exists public.brands (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  image_url           text,
  target              text,
  price_range         text,
  mood                text,
  description         text,
  brand_character     text[],
  signature           text,
  core_products       text,
  materials           text,
  color_palette       text,
  sns_content         text,
  what_i_like         text,
  what_i_would_change text,
  created_at          timestamptz not null default now()
);

-- ============================================================
--  02. Products  (Brand 1 : N Product)
-- ============================================================
create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  brand_id            uuid not null references public.brands (id) on delete cascade,
  name                text not null,
  image_urls          text[],
  price               text,
  category            text,
  color               text,
  material            text,
  silhouette          text,
  detail              text,
  what_i_like         text,
  what_i_would_change text,
  created_at          timestamptz not null default now()
);
create index if not exists products_brand_id_idx on public.products (brand_id);

-- ============================================================
--  03. Inspiration
-- ============================================================
create table if not exists public.inspiration (
  id         uuid primary key default gen_random_uuid(),
  title      text,
  image_url  text,
  category   text,
  source     text,
  note       text not null default '',
  tags       text[],
  created_at timestamptz not null default now()
);

-- ============================================================
--  04. Exhibition (my own designs)
-- ============================================================
create table if not exists public.exhibition (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  image_urls   text[],
  category     text,
  concept      text,
  design_notes text,
  material     text,
  silhouette   text,
  details      text,
  date         text,
  created_at   timestamptz not null default now()
);

-- ============================================================
--  Row Level Security
--  read  → everyone (using true)
--  write → admins only (public.is_admin())
-- ============================================================
alter table public.brands      enable row level security;
alter table public.products    enable row level security;
alter table public.inspiration enable row level security;
alter table public.exhibition  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['brands', 'products', 'inspiration', 'exhibition']
  loop
    execute format('drop policy if exists "public read %1$s" on public.%1$I;', t);
    execute format('drop policy if exists "admin write %1$s" on public.%1$I;', t);
    execute format(
      'create policy "public read %1$s" on public.%1$I for select using (true);', t);
    execute format(
      'create policy "admin write %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ============================================================
--  Storage: 'media' bucket (public read, admin-only write)
--  Create the bucket, then lock down writes to admins.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read"   on storage.objects;
drop policy if exists "media admin insert"  on storage.objects;
drop policy if exists "media admin update"  on storage.objects;
drop policy if exists "media admin delete"  on storage.objects;

create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

create policy "media admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ============================================================
--  ⚑ BOOTSTRAP THE ADMIN  (run once, after you sign up)
--  1) Create your admin user:
--       Dashboard → Authentication → Users → Add user
--       (email + password; this is the "mumzzmum" admin login)
--  2) Promote it to admin by email:
-- ============================================================
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'YOUR-ADMIN-EMAIL');

-- ============================================================
--  Optional sample data
-- ============================================================
insert into public.brands (slug, name, target, price_range, mood, description, brand_character, signature, core_products, materials, color_palette, what_i_like, what_i_would_change)
values
  ('lee', 'Lee', '20–30s / casual / vintage', '₩50,000 – ₩200,000',
   'Vintage · Americana · Workwear',
   'A heritage American denim house whose vintage washes and workwear cuts feel lived-in rather than costume.',
   array['Vintage','Casual','Americana','Workwear'],
   'Denim · Logo · Vintage wash', 'Denim · Jacket · Cap',
   'Denim, heavy cotton, corduroy', 'Indigo, ecru, faded brown',
   'The washes look genuinely aged, never forced.',
   'A slightly more modern, cleaner silhouette.'),
  ('carhartt-wip', 'Carhartt WIP', '20–30s / workwear / street', '₩100,000 – ₩250,000',
   'Workwear · Utility · Vintage-not-kitsch',
   'Real workwear heritage translated into everyday lifestyle wear — the material does the talking.',
   array['Workwear','Utility','Street','Heritage'],
   'Duck canvas · Square C label', 'Detroit Jacket · Double Knee Pant',
   'Duck canvas, corduroy, heavy cotton', 'Hamilton brown, olive, black',
   'Details are restrained; the fabric speaks.',
   'A touch more contemporary in the fit.')
on conflict (slug) do nothing;
