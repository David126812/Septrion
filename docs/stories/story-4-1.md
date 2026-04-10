---
id: story-4-1
epic: 4
name: "Inbox signalements"
status: done
commit: 5a74857
---

# Story 4.1: Inbox signalements

## User Story
As a **membre du conseil syndical**, I want **consulter la liste des signalements en attente**, So that **je vois ce qui est arrive et ce que je dois traiter**.

## Acceptance Criteria
- Given je suis connecte
- When j'accede a la page signalements
- Then je vois la liste des signalements avec status 'nouveau' pour ma copro_id
- And chaque carte affiche: titre, urgence, localisation, date, resume
- And les signalements sont tries par date decroissante

## Tasks
- [x] Signalements.tsx page
- [x] Query signalements avec status nouveau
- [x] Carte avec titre/urgence/localisation/date/resume
- [x] Tri par date decroissante

## Dev Notes
**Architecture patterns:** Page liste avec query filtree sur copro_id et status nouveau, cartes de signalement avec badges urgence.
**Source files:** src/pages/Signalements.tsx
**Testing:** Verifier le filtrage par copro_id et le tri par date desc.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Page Signalements.tsx implementee avec query Supabase filtrant sur status nouveau et copro_id, affichage en cartes avec tous les champs requis, tri par date decroissante.
**Gaps:** Aucun.
