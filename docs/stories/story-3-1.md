---
id: story-3-1
epic: 3
name: "Pipeline IA partage"
status: done
commit: 0006491
---

# Story 3.1: Pipeline IA partage

## User Story

As a **developpeur**,
I want **une fonction d'analyse IA reutilisable**,
So that **le webhook WhatsApp et l'upload app utilisent le meme pipeline**.

## Acceptance Criteria

Given document stocke
When analyzeMessage() appelee
Then JSON: name, urgency, location (nullable), nextStep, summary. Traite PDF, images, texte. Si pas de location, null. Si echec, objet erreur.

## Tasks

- [x] analyzeMessage.ts dans _shared/
- [x] Claude Sonnet API
- [x] Support PDF + image + texte
- [x] Fallback keywords si Claude fail

## Dev Notes

**Architecture patterns:** Shared utility function in Supabase Edge Functions _shared/ directory, Claude Sonnet for document analysis with keyword fallback
**Source files:** supabase/functions/_shared/analyzeMessage.ts
**Testing:** Test with PDF, image, and text inputs. Verify fallback behavior when Claude API is unavailable.

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** analyzeMessage.ts created in _shared/ directory as a reusable function. Uses Claude Sonnet API for document analysis returning structured JSON (name, urgency, location, nextStep, summary). Handles PDF, image, and text content types. Keyword-based fallback implemented for when Claude API call fails.
**Gaps:** None
