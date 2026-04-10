---
id: story-4-4
epic: 4
name: "Liste des dossiers"
status: done
commit: 5a74857
---

# Story 4.4: Liste des dossiers

## User Story
As a **membre du conseil syndical**, I want **consulter la liste de tous mes dossiers**, So that **j'ai une vue d'ensemble**.

## Acceptance Criteria
- Given je suis connecte
- When j'accede a la page dossiers
- Then je vois la liste des dossiers pour ma copro_id
- And chaque dossier affiche: titre, badge statut colore, urgence, derniere mise a jour
- And les dossiers sont tries par updated_at decroissant

## Tasks
- [x] DossiersList.tsx page
- [x] Query dossiers pour copro_id
- [x] Badges statut colores
- [x] Urgence et date derniere MAJ
- [x] Tri par updated_at decroissant

## Dev Notes
**Architecture patterns:** Page liste avec query Supabase filtree sur copro_id, badges de statut avec couleurs differenciees, tri par updated_at desc.
**Source files:** src/pages/DossiersList.tsx
**Testing:** Verifier le filtrage par copro_id, les badges colores par statut, et le tri par updated_at.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** DossiersList.tsx implementee avec query Supabase, badges statut colores (en_cours, bloque, termine), affichage urgence et date, tri par updated_at desc.
**Gaps:** Aucun.
