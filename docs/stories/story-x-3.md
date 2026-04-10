---
id: story-x-3
epic: extra
name: "Auth guard conditionnel onboarding"
status: missing
commit: "N/A"
---

# Story X.3: Auth guard conditionnel onboarding

**Priority: HIGH**

## User Story
As a **systeme**, I want **rediriger vers l'onboarding si non complete**, So that **les nouveaux utilisateurs passent par la configuration avant d'acceder a l'app**.

## Acceptance Criteria
- Given utilisateur connecte
- When AuthGuard verifie
- Then query profiles pour onboarding_completed
- And si false ou null -> redirect /onboarding
- And si true -> render children
- And migration: ajouter colonne onboarding_completed boolean default false dans profiles

## Tasks
- [ ] Migration SQL: ALTER TABLE profiles ADD COLUMN onboarding_completed boolean default false
- [ ] Modifier AuthGuard pour query profiles.onboarding_completed
- [ ] Si false -> Navigate /onboarding
- [ ] Modifier StepPremierDoc pour SET onboarding_completed = true apres completion
- [ ] Modifier Auth.tsx login redirect: enlever hardcoded /dashboard

## Dev Notes
**Architecture patterns:** AuthGuard enrichi avec verification du statut onboarding. Query supplementaire sur la table profiles apres verification auth. Nouvelle colonne SQL avec migration. Redirect conditionnel via React Router Navigate.
**Source files:** src/components/auth/AuthGuard.tsx (a modifier), supabase/migrations/ (nouvelle migration)
**Reference:** UX Spec "Auth guard" + Epic 2 Story 2.5
**Testing:** Tester avec un nouvel utilisateur (doit aller sur /onboarding), puis apres completion (doit aller sur /dashboard). Tester avec utilisateur existant (onboarding_completed = true, doit passer directement).

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Aucune implementation. AuthGuard actuel ne verifie pas le statut onboarding. La colonne onboarding_completed n'existe pas dans la table profiles.
**Gaps:** Migration SQL a creer. AuthGuard a modifier. StepPremierDoc a modifier pour marquer completion. Auth.tsx redirect hardcode a corriger.
