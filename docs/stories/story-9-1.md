---
id: story-9-1
epic: 9
name: "Edge Function assistant-query (prompt RAG)"
status: done
commit: "a5a3107"
---

# Story 9.1: Edge Function assistant-query (prompt RAG)

## User Story
As a **developpeur**, I want **une Edge Function qui repond aux questions en contexte**, So that **l'assistant a acces aux dossiers pour repondre**.

## Acceptance Criteria
- Given question + copro_id
- When fonction executee
- Then charge dossiers + signalements
- And construit prompt RAG
- And appelle Claude
- And retourne JSON:
  - `response` (texte)
  - `matched_dossiers` [{id, name, status}]
  - `suggested_actions` [{type, label, target}]
- And si aucun dossier, matched_dossiers vide

## Tasks
- [x] assistant-query/index.ts
- [x] Query dossiers + signalements
- [x] Prompt RAG construction
- [x] Claude Sonnet API
- [x] JSON response structure

## Dev Notes
**Architecture patterns:** Supabase Edge Function avec requete Supabase pour charger le contexte dossiers/signalements, construction d'un prompt RAG enrichi, appel a l'API Claude Sonnet, parsing et retour JSON structure.
**Source files:** supabase/functions/assistant-query/index.ts
**Testing:** Tester via curl ou depuis l'interface chat avec des questions portant sur les dossiers existants.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Edge Function completement implementee. Charge les dossiers et signalements de la copro, construit le prompt RAG avec contexte, appelle Claude Sonnet, et retourne la reponse structuree avec matched_dossiers et suggested_actions.
**Gaps:** Aucun gap identifie.
