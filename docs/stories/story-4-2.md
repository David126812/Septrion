---
id: story-4-2
epic: 4
name: "Qualifier -> creer un dossier"
status: done
commit: 5a74857
---

# Story 4.2: Qualifier -> creer un dossier

## User Story
As a **membre du conseil syndical**, I want **transformer un signalement en nouveau dossier**, So that **le sujet est formellement suivi**.

## Acceptance Criteria
- Given un signalement avec status nouveau
- When je clique sur "Creer un dossier"
- Then un dossier est cree avec copro_id, name, urgency, status en_cours, resume IA, next_step
- And le signalement passe en status qualifie avec dossier_id associe
- And le document est rattache au dossier
- And un event timeline est cree
- Also When je clique sur "Rejeter"
- Then le signalement passe en status rejete

## Tasks
- [x] Bouton "Creer un dossier"
- [x] Insert dossier en base
- [x] Update signalement en status qualifie
- [x] Rattachement document au dossier
- [x] Bouton "Rejeter"

## Dev Notes
**Architecture patterns:** Action de qualification depuis la liste des signalements, creation dossier avec resume IA genere, mise a jour atomique du signalement et creation timeline.
**Source files:** src/pages/Signalements.tsx
**Testing:** Verifier la creation du dossier, la mise a jour du signalement, le rattachement document et le rejet.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Boutons "Creer un dossier" et "Rejeter" implementes dans Signalements.tsx. La creation de dossier insere en base avec tous les champs requis, met a jour le signalement en qualifie, rattache le document et cree un event timeline.
**Gaps:** Aucun.
