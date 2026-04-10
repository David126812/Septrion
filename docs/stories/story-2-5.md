---
id: story-2-5
epic: 2
name: "Premier document ou exploration"
status: partial
commit: bb92f6a
---

# Story 2.5: Premier document ou exploration

## User Story

As a **nouvel utilisateur**,
I want **creer mon premier signalement ou explorer l'app directement**,
So that **je commence a utiliser Septrion immediatement**.

## Acceptance Criteria

Given etape 5
When page charge
Then 3 options: "Uploader un document" (pipeline IA), "Utiliser un document exemple" (dummy), "Explorer d'abord" (dashboard). Flag onboarding_completed enregistre. Redirect vers signalements ou dashboard.

## Tasks

- [x] StepPremierDoc.tsx 3 options
- [x] Seed data (3 dossiers)
- [x] Upload + pipeline IA
- [ ] Flag onboarding_completed dans profiles
- [ ] Redirect conditionnel post-login

## Dev Notes

**Architecture patterns:** Final onboarding step with multiple exit paths, seed data for demo experience
**Source files:** src/components/onboarding/StepPremierDoc.tsx
**Testing:** Test all 3 options lead to correct destinations, verify seed data creation for dummy option

## Dev Agent Record

**Model:** Claude
**Status:** partial
**Implementation notes:** StepPremierDoc component implemented with 3 options (upload, example document, explore). Seed data with 3 sample dossiers implemented. Upload with IA pipeline functional.
**Gaps:** Flag onboarding_completed absent -- the profiles table is not updated to mark onboarding as complete. Pas de redirect conditionnel -- post-login always goes to /dashboard regardless of onboarding status.
