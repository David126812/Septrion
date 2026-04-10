---
id: story-8-1
epic: 8
name: "Pre-chargement de dossiers seed"
status: partial
commit: "bb92f6a"
---

# Story 8.1: Pre-chargement de dossiers seed

## User Story
As a **administrateur**, I want **que des dossiers dummy soient presents au lancement**, So that **le testeur demarre avec un dashboard peuple**.

## Acceptance Criteria
- Given app deployee pour nouvelle copro
- When testeur connecte apres onboarding
- Then dossiers seed presents:
  - PV AG type
  - Devis fictif
  - Echange syndic simule
- And avec signalements + timelines + documents realistes
- And badge "Exemple" visible sur les dossiers seed
- And inseres via script SQL ou migration (PAS via WhatsApp)

## Tasks
- [x] SEED_DOSSIERS array (3 dossiers realistes)
- [x] Chargement au step 5 onboarding
- [ ] Migrer vers script SQL separe
- [ ] Badge "Exemple" sur dossiers seed dans la liste

## Dev Notes
**Architecture patterns:** Actuellement le seed est hardcode dans le composant React StepPremierDoc. La cible est un script SQL dans les migrations Supabase pour un chargement propre cote serveur.
**Source files:** src/components/onboarding/StepPremierDoc.tsx (actuel), supabase/migrations/ (cible)
**Testing:** Verifier que les 3 dossiers seed apparaissent dans la liste apres onboarding, avec le badge "Exemple".

## Dev Agent Record
**Model:** Claude
**Status:** partial
**Implementation notes:** Les 3 dossiers seed sont definis et charges au step 5 de l'onboarding via le composant React. Le mecanisme fonctionne mais l'architecture n'est pas ideale.
**Gaps:** Seed hardcode dans composant React au lieu de SQL. Pas de badge "Exemple" visible dans DossiersList.
