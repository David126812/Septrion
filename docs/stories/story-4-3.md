---
id: story-4-3
epic: 4
name: "Qualifier -> rattacher a un dossier existant"
status: partial
commit: 5a74857
---

# Story 4.3: Qualifier -> rattacher a un dossier existant

## User Story
As a **membre du conseil syndical**, I want **rattacher un signalement a un dossier existant**, So that **l'information s'accumule au bon endroit**.

## Acceptance Criteria
- Given un signalement avec status nouveau
- When je clique sur "Rattacher"
- Then la liste des dossiers existants est affichee
- And je selectionne un dossier
- And le signalement passe en status qualifie avec dossier_id associe
- And le document est rattache au dossier
- And un event timeline est cree
- And regenerateDossierSummary() est appelee pour mettre a jour le resume

## Tasks
- [x] Bouton "Rattacher a un dossier"
- [x] Liste de selection des dossiers existants
- [x] Update signalement avec status qualifie et dossier_id
- [x] Timeline event cree
- [ ] Appel regenerateDossierSummary()

## Dev Notes
**Architecture patterns:** Modale de selection de dossier existant, rattachement avec mise a jour signalement et timeline. La fonction regenerateDossierSummary existe dans _shared mais n'est pas branchee.
**Source files:** src/pages/Signalements.tsx, supabase/functions/_shared/regenerateDossierSummary.ts
**Testing:** Verifier le rattachement complet et l'appel a regenerateDossierSummary (actuellement manquant).

## Dev Agent Record
**Model:** Claude
**Status:** partial
**Implementation notes:** Le flow de rattachement fonctionne (selection dossier, update signalement, timeline event) mais regenerateDossierSummary n'est jamais appelee apres le rattachement.
**Gaps:** regenerateDossierSummary() n'est pas invoquee dans le flow de rattachement. La fonction existe dans supabase/functions/_shared/regenerateDossierSummary.ts mais n'est pas branchee au flow UI.
