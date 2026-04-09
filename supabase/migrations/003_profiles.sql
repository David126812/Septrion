-- Migration 003: Create profiles table (extension of auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  copro_id text references public.coproprietes(id),
  whatsapp_phone text not null default '',
  email text,
  notification_consent boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Allow all for POC" on public.profiles for all using (true) with check (true);
