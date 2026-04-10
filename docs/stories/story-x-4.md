---
id: story-x-4
epic: extra
name: "Migration 001 -- tables core"
status: missing
commit: "N/A"
---

# Story X.4: Migration 001 -- tables core

**Priority: CRITICAL**

## User Story
As a **developpeur**, I want **creer les tables core dans les migrations**, So that **le schema DB est complet et deployable**.

## Acceptance Criteria
- Given fresh Supabase instance
- When migrations executees en ordre
- Then tables dossiers, signalements, published_updates creees avec schema complet
- And pre-requis pour migrations 004 (copro_id) et 006 (RLS)

## Tasks
- [ ] Creer supabase/migrations/001_core_tables.sql
- [ ] CREATE TABLE dossiers
- [ ] CREATE TABLE signalements
- [ ] CREATE TABLE published_updates
- [ ] ENABLE ROW LEVEL SECURITY sur les 3 tables
- [ ] Verifier que migrations 004 et 006 fonctionnent apres

## Schema

### dossiers
| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PRIMARY KEY |
| name | text | NOT NULL |
| status | text | DEFAULT 'en_cours' |
| urgency | text | DEFAULT 'normal' |
| responsible | text | |
| next_step | text | |
| last_action | text | |
| blocage_reason | text | |
| created_via_agent | boolean | DEFAULT false |
| timeline | jsonb | DEFAULT '[]' |
| documents | jsonb | DEFAULT '[]' |
| prestataires | jsonb | DEFAULT '[]' |
| syndic_history | jsonb | DEFAULT '[]' |
| syndic_contact | jsonb | |
| copro_id | text | |
| location | text | |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### signalements
| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PRIMARY KEY, DEFAULT gen_random_uuid()::text |
| name | text | |
| urgency | text | DEFAULT 'normal' |
| summary | text | |
| location | text | |
| next_step | text | |
| status | text | DEFAULT 'nouveau' |
| copro_id | text | |
| document_url | text | |
| raw_analysis | jsonb | |
| sender_name | text | |
| sender_phone | text | |
| dossier_id | text | REFERENCES dossiers(id) |
| created_at | timestamptz | DEFAULT now() |

### published_updates
| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PRIMARY KEY, DEFAULT gen_random_uuid()::text |
| copro_id | text | |
| dossier_id | text | REFERENCES dossiers(id) |
| content | text | |
| channel | text | |
| sent_at | timestamptz | DEFAULT now() |

## Dev Notes
**Architecture patterns:** Migration SQL standard Supabase. RLS active sur toutes les tables. Les foreign keys sur dossier_id lient signalements et published_updates a dossiers. Les colonnes jsonb (timeline, documents, prestataires, syndic_history) stockent des donnees structurees flexibles.
**Source files:** supabase/migrations/001_core_tables.sql (a creer)
**Reference:** Architecture section "Modele de Donnees"
**Testing:** Executer les migrations sur une instance Supabase vierge. Verifier que les migrations 004 et 006 s'appliquent correctement apres.

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Aucune migration core n'existe. Les tables sont probablement creees ad-hoc ou via l'interface Supabase, mais pas via une migration versionee.
**Gaps:** Migration entierement a creer. Pre-requis pour les migrations suivantes (004 copro_id, 006 RLS). Critique pour la reproductibilite du deploiement.
