---
id: story-2-4
epic: 2
name: "Explication WhatsApp"
status: done
commit: bb92f6a
---

# Story 2.4: Explication WhatsApp

## User Story

As a **nouvel utilisateur**,
I want **comprendre comment envoyer des documents a Septrion via WhatsApp**,
So that **je sais utiliser le canal principal d'ingestion**.

## Acceptance Criteria

Given etape 4
When page charge
Then contenu explicatif, numero WhatsApp affiche + bouton "Copier", bouton Suivant

## Tasks

- [x] StepWhatsApp.tsx avec explications
- [x] Numero + bouton copier
- [x] Bouton progression

## Dev Notes

**Architecture patterns:** Informational onboarding step with clipboard copy functionality
**Source files:** src/components/onboarding/StepWhatsApp.tsx
**Testing:** Verify WhatsApp number displays, copy button works, progression button advances step

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** StepWhatsApp component created with explanatory content about WhatsApp document sending, WhatsApp number displayed with copy-to-clipboard button, and Suivant button for progression.
**Gaps:** None
