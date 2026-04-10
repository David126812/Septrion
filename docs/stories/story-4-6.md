---
id: story-4-6
epic: 4
name: "Transitions de statut"
status: done
commit: 5a74857
---

# Story 4.6: Transitions de statut

## User Story
As a **membre du conseil syndical**, I want **changer le statut d'un dossier**, So that **le suivi reflete la realite**.

## Acceptance Criteria
- Given je suis sur le detail d'un dossier
- When je clique sur un bouton de changement de statut
- Then les transitions autorisees sont: en_cours->bloque, en_cours->termine, bloque->en_cours, termine->en_cours
- And le statut est mis a jour en base
- And un event timeline est cree
- And un dossier termine reste consultable
- And un dossier bloque est mis en evidence sur le dashboard

## Tasks
- [x] Boutons transition statut
- [x] Update status en base de donnees
- [x] Timeline event a chaque transition
- [x] Distinction visuelle termine/bloque

## Dev Notes
**Architecture patterns:** Machine a etats simple pour les transitions de statut avec validation cote client, update Supabase et creation event timeline. Boutons conditionnes par le statut courant.
**Source files:** src/pages/DossierDetail.tsx
**Testing:** Verifier chaque transition autorisee, le refus des transitions invalides, la creation d'events timeline, et la distinction visuelle.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Boutons de transition implementes dans DossierDetail.tsx avec les transitions autorisees (en_cours->bloque, en_cours->termine, bloque->en_cours, termine->en_cours). Chaque transition met a jour la base et cree un event timeline. Distinction visuelle pour les dossiers bloques et termines.
**Gaps:** Aucun.
