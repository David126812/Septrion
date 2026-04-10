---
id: story-3-5
epic: 3
name: "Auto-completion IA sur fichier attache"
status: done
commit: 0006491
---

# Story 3.5: Auto-completion IA sur fichier attache

## User Story

As a **membre CS**,
I want **demander a l'IA d'analyser mon fichier pour pre-remplir le formulaire**,
So that **je n'ai pas a tout saisir moi-meme**.

## Acceptance Criteria

Given fichier attache
When clic "Analyser avec l'IA"
Then Edge Function analyze-document appelee, champs pre-remplis (titre, localisation, description), modifiables, loading indicator, toast erreur si echec

## Tasks

- [x] Bouton "Analyser avec l'IA"
- [x] Appel analyze-document
- [x] Pre-remplissage champs
- [x] Loading indicator
- [x] Toast erreur

## Dev Notes

**Architecture patterns:** Edge Function invocation from client, optimistic UI with loading state, form pre-fill from IA response
**Source files:** src/pages/SignalerIncident.tsx, supabase/functions/analyze-document/index.ts
**Testing:** Test with various file types, verify fields are pre-filled and editable, test error handling when Edge Function fails

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** "Analyser avec l'IA" button added to SignalerIncident form, visible only when a file is attached. Calls analyze-document Edge Function which uses the shared analyzeMessage pipeline. Response pre-fills titre, localisation, and description fields (all remain editable). Loading indicator shown during analysis. Toast error displayed on failure.
**Gaps:** None
