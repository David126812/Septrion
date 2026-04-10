---
id: story-2-3
epic: 2
name: "Instructions d'installation PWA"
status: done
commit: bb92f6a
---

# Story 2.3: Instructions d'installation PWA

## User Story

As a **nouvel utilisateur**,
I want **savoir comment installer l'app sur mon ecran d'accueil**,
So that **j'ai un acces rapide a Septrion**.

## Acceptance Criteria

Given etape 3
When page charge
Then instructions iOS + Android affichees, bouton "C'est fait"

## Tasks

- [x] StepInstallPWA.tsx avec instructions
- [x] Bouton progression

## Dev Notes

**Architecture patterns:** Informational onboarding step with platform-specific instructions
**Source files:** src/components/onboarding/StepInstallPWA.tsx
**Testing:** Verify iOS and Android instructions both render, progression button advances step

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** StepInstallPWA component created with iOS and Android installation instructions and a "C'est fait" button to advance to next step.
**Gaps:** None
