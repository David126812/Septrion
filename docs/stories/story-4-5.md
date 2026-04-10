---
id: story-4-5
epic: 4
name: "Detail d'un dossier"
status: done
commit: 5a74857
---

# Story 4.5: Detail d'un dossier

## User Story
As a **membre du conseil syndical**, I want **consulter le detail complet d'un dossier**, So that **je retrouve toute l'info au meme endroit**.

## Acceptance Criteria
- Given je clique sur un dossier dans la liste
- When la page detail se charge
- Then je vois le resume IA en encart principal
- And l'urgence et le next_step sont visibles
- And la chronologie timeline est affichee
- And les documents sont listes
- And le statut est affiche

## Tasks
- [x] DossierDetail.tsx page
- [x] Resume IA card (encart principal)
- [x] Urgence et next_step visibles
- [x] Timeline chronologique
- [x] Documents liste
- [x] Statut badge

## Dev Notes
**Architecture patterns:** Page detail avec sections distinctes: resume IA, metadata (urgence, next_step, statut), timeline chronologique, liste documents. Query par dossier_id.
**Source files:** src/pages/DossierDetail.tsx
**Testing:** Verifier l'affichage de tous les champs: resume, urgence, next_step, timeline, documents, statut.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** DossierDetail.tsx implementee avec toutes les sections requises: carte resume IA en encart principal, badges urgence et statut, next_step, timeline chronologique, et liste des documents rattaches.
**Gaps:** Aucun.
