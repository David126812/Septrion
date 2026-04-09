-- Migration 004: Add copro_id to dossiers and signalements
alter table public.dossiers add column copro_id text references public.coproprietes(id);
alter table public.signalements add column copro_id text references public.coproprietes(id);
alter table public.published_updates add column copro_id text references public.coproprietes(id);
