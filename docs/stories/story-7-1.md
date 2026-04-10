---
id: story-7-1
epic: 7
name: "Initialisation PostHog & identification"
status: missing
commit: "N/A"
---

# Story 7.1: Initialisation PostHog & identification

## User Story
As a **product owner**, I want **identifier chaque testeur dans l'outil d'analytics**, So that **je peux mesurer l'engagement individuel et par copro**.

## Acceptance Criteria
- Given app charge dans main.tsx
- When PostHog initialise
- Then posthog.init() avec cle API + host EU
- And apres auth, posthog.identify(user.id)
- And posthog.group('copro', copro_name)
- And Autocapture active

## Tasks
- [ ] Creer src/lib/posthog.ts
- [ ] posthog.init() dans main.tsx
- [ ] posthog.identify() apres auth dans useAuth ou App.tsx
- [ ] posthog.group() avec copro_name
- [ ] Autocapture active

## Dev Notes
**Architecture patterns:** PostHog JS SDK avec initialisation au boot, identification apres authentification Supabase, groupement par copropriete pour analytics segmentees.
**Source files:** src/lib/posthog.ts (a creer), src/main.tsx (a modifier)
**Env vars:** VITE_POSTHOG_KEY, VITE_POSTHOG_HOST (deja dans .env.example)
**Testing:** Verifier dans PostHog dashboard que les events autocapture remontent avec user_id et copro group.

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Package posthog-js est installe dans package.json mais aucun code d'initialisation n'existe. Il faut creer le module d'init et l'integrer dans le cycle de vie de l'app.
**Gaps:** Zero code PostHog dans le projet. Tout est a implementer.
