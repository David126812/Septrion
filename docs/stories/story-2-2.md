---
id: story-2-2
epic: 2
name: "Inscription + profil fusionnes & opt-in"
status: partial
commit: bb92f6a
---

# Story 2.2: Inscription + profil fusionnes & opt-in

## User Story

As a **nouvel utilisateur**,
I want **creer mon compte et renseigner mon profil en une seule etape**,
So that **je suis operationnel rapidement**.

## Acceptance Criteria

Given etape 2
When remplit formulaire
Then champs: numero, mdp, email optionnel, prenom, copro, checkbox opt-in. Compte Auth cree, coproprietes cree, profiles cree avec first_name, copro_id, whatsapp_phone, email, notification_consent. PostHog identify.

## Tasks

- [x] StepProfil.tsx formulaire
- [x] Collecte prenom + copro + whatsapp_phone + notification_consent
- [ ] Inscription fusionnee (actuellement separee dans Auth.tsx)
- [ ] PostHog identify + group

## Dev Notes

**Architecture patterns:** Combined signup+profile form in onboarding step, should create Auth account and profile in single flow
**Source files:** src/components/onboarding/StepProfil.tsx
**Testing:** Test complete form submission creates auth account, copropriete, and profile in one step

## Dev Agent Record

**Model:** Claude
**Status:** partial
**Implementation notes:** StepProfil form component created collecting prenom, copro, whatsapp_phone, and notification_consent fields.
**Gaps:** L'inscription est dans Auth.tsx, pas fusionnee au step 2. PostHog non integre. The signup flow remains separate from the onboarding stepper -- users must register first on Auth.tsx, then complete profile in onboarding. PostHog identify and group calls are not implemented.
