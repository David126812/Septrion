---
id: story-6-1
epic: 6
name: "Dashboard avec remontee automatique"
status: done
commit: a5a3107
---

# Story 6.1: Dashboard avec remontee automatique

## User Story
As a **membre du conseil syndical**, I want **voir un tableau de bord avec les infos cles**, So that **je sais ou en sont les choses en un coup d'oeil**.

## Acceptance Criteria
- Given je suis connecte sur /dashboard
- When la page se charge
- Then je vois le header avec le nom de la copro et le prenom
- And les quick actions sont fonctionnelles avec un badge count signalements
- And une carte assistant redirige vers /assistant
- And une section activite recente affiche les derniers dossiers
- And une section prochains evenements est affichee (dummy avec badge "Exemple")
- And une mention IA est visible

## Tasks
- [x] Dashboard.tsx page
- [x] Greeting copro + prenom
- [x] Quick actions grid avec badge count
- [x] Carte hero assistant
- [x] Dossiers bloques alert
- [x] Activite recente
- [x] Sign-out button

## Dev Notes
**Architecture patterns:** Page dashboard avec sections modulaires: header greeting, grid quick actions avec badge count dynamique, carte hero assistant, alerte dossiers bloques, liste activite recente, section evenements dummy.
**Source files:** src/pages/Dashboard.tsx
**Testing:** Verifier le greeting personnalise, le badge count signalements, la navigation vers /assistant, l'affichage activite recente et evenements, le sign-out.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Dashboard.tsx implementee avec toutes les sections: header greeting copro + prenom, quick actions grid avec badge count signalements en temps reel, carte hero assistant vers /assistant, alerte dossiers bloques, activite recente depuis les dossiers, section evenements dummy avec badge "Exemple", et bouton sign-out.
**Gaps:** Aucun.
