---
id: story-9-3
epic: 9
name: "Suggestions, chips & actions contextuelles"
status: done
commit: "a5a3107"
---

# Story 9.3: Suggestions, chips & actions contextuelles

## User Story
As a **membre CS**, I want **voir des suggestions et actions apres chaque reponse**, So that **je sais quoi demander et je passe a l'action en un tap**.

## Acceptance Criteria
- Given reponse avec matched_dossiers
- When reponse affichee
- Then boutons action:
  - Consulter dossier -> /dossiers/:id
  - Creer signalement
- And si aucun match, proposer creer signalement
- And premier lancement: message bienvenue + chips:
  - "Ou en est l'ascenseur?"
  - "Quels dossiers sont bloques?"
  - "Resume la situation"
- And tap chip envoie comme message

## Tasks
- [x] Boutons action contextuels
- [x] Navigation vers dossier
- [x] Message bienvenue
- [x] 3 chips suggestions
- [x] Tap chip -> message

## Dev Notes
**Architecture patterns:** Boutons d'action generes dynamiquement a partir de suggested_actions et matched_dossiers retournes par l'Edge Function. Chips de suggestion affiches au premier lancement et apres chaque reponse. Navigation via React Router.
**Source files:** src/pages/AssistantIA.tsx
**Testing:** Verifier les boutons d'action apres une reponse avec dossiers matches, les chips de suggestion au premier lancement, et la navigation vers les dossiers.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Actions contextuelles et chips de suggestion completement implementes. Les boutons naviguent vers les dossiers ou proposent de creer un signalement. Le message de bienvenue inclut 3 chips pre-definis.
**Gaps:** Aucun gap identifie.
