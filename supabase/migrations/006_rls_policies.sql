-- Migration 006: RLS policies by copropriété
-- Drop POC policies and replace with copro-based policies

-- Dossiers: users see only their copro's dossiers
drop policy if exists "Allow all for POC" on public.dossiers;
create policy "Users see own copro dossiers" on public.dossiers
  for all using (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  ) with check (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  );

-- Signalements: users see only their copro's signalements
drop policy if exists "Allow all for POC" on public.signalements;
create policy "Users see own copro signalements" on public.signalements
  for all using (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  ) with check (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  );

-- Published updates: users see only their copro's updates
drop policy if exists "Allow all for POC" on public.published_updates;
create policy "Users see own copro updates" on public.published_updates
  for all using (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  ) with check (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  );

-- Profiles: users can read/update their own profile
drop policy if exists "Allow all for POC" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Coproprietes: authenticated users can read, insert allowed for signup flow
drop policy if exists "Allow all for POC" on public.coproprietes;
create policy "Authenticated users read coproprietes" on public.coproprietes
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users create coproprietes" on public.coproprietes
  for insert with check (auth.role() = 'authenticated');
