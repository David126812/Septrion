---
id: story-2-1
epic: 2
name: "Stepper & explication visuelle"
status: done
commit: bb92f6a
---

# Story 2.1: Stepper & explication visuelle

## User Story

As a **nouvel utilisateur**,
I want **comprendre le fonctionnement de Septrion avant de commencer**,
So that **je sais a quoi m'attendre**.

## Acceptance Criteria

Given vient de s'inscrire sur /onboarding
When page charge
Then stepper 1/5, explication visuelle du flow document -> WhatsApp/app -> dossier, bouton Suivant

## Tasks

- [x] Onboarding.tsx avec switch step
- [x] Stepper.tsx composant progression
- [x] StepExplication.tsx contenu visuel
- [x] Bouton Suivant

## Dev Notes

**Architecture patterns:** Multi-step wizard pattern with step state managed in parent Onboarding.tsx, reusable Stepper progress component
**Source files:** src/pages/Onboarding.tsx, src/components/onboarding/Stepper.tsx, src/components/onboarding/StepExplication.tsx
**Testing:** Verify stepper shows 1/5, visual content renders, navigation works

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** Onboarding page with step switch implemented, Stepper component shows progression across 5 steps, StepExplication provides visual explanation of the document flow, Suivant button advances step.
**Gaps:** None
