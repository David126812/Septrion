---
id: story-1-5
epic: 1
name: "Politique de confidentialite"
status: done
commit: 2167d58
---

# Story 1.5: Politique de confidentialite

## User Story

As a **utilisateur**,
I want **consulter la politique de confidentialite**,
So that **je sais comment mes donnees sont traitees**.

## Acceptance Criteria

Given connecte
When accede a la politique
Then page RGPD affichee

## Tasks

- [x] Page PrivacyPolicy.tsx
- [x] Route /privacy dans App.tsx

## Dev Notes

**Architecture patterns:** Static page component with route registration in App.tsx
**Source files:** src/pages/PrivacyPolicy.tsx
**Testing:** Verify page renders correctly, route accessible

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** PrivacyPolicy page component created with RGPD content, route registered at /privacy in App.tsx.
**Gaps:** None
