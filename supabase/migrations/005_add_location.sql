-- Migration 005: Add location to signalements (nullable — IA fills when detected)
alter table public.signalements add column location text;
