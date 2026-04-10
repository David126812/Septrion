---
id: story-1-4
epic: 1
name: "RLS par copropriete"
status: partial
commit: 2167d58
---

# Story 1.4: RLS par copropriete

## User Story

As a **membre CS**,
I want **ne voir que les donnees de ma copropriete**,
So that **les donnees sont isolees entre coproprietes**.

## Acceptance Criteria

Given tables ont copro_id
When requete Supabase
Then RLS filtre par copro_id via auth.uid() -> profiles.copro_id

## Tasks

- [x] Migration 006 RLS policies
- [x] copro_id sur dossiers/signalements/published_updates (migration 004)
- [ ] Migration 001 CREATE TABLE pour tables core

## Dev Notes

**Architecture patterns:** Supabase RLS policies filtering by copro_id, joined through profiles table via auth.uid()
**Source files:** supabase/migrations/004_add_copro_id.sql, supabase/migrations/006_rls_policies.sql
**Testing:** Verify cross-copropriete data isolation, test RLS with different user contexts

## Dev Agent Record

**Model:** Claude
**Status:** partial
**Implementation notes:** RLS policies written in migration 006, copro_id column added via migration 004 on dossiers, signalements, and published_updates tables.
**Gaps:** Migration 001 manquante -- les tables core (dossiers, signalements, published_updates) ne sont jamais creees. Les migrations 004 et 006 referencent des tables qui n'existent pas. The RLS policies and column additions are written but cannot be applied without the base table creation migration.
