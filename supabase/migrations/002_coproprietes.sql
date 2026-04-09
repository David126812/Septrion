-- Migration 002: Create coproprietes table
create table public.coproprietes (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  lots_count integer,
  created_at timestamptz not null default now()
);

alter table public.coproprietes enable row level security;
create policy "Allow all for POC" on public.coproprietes for all using (true) with check (true);
